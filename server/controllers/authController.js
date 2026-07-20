const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const authenticationUnavailable = (res) => {
  if (!process.env.JWT_SECRET) {
    return res.status(503).json({ message: "Authentication is not configured on the server." });
  }
  return null;
};

const register = async (req, res) => {
  const body = req.body || {};
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const department = typeof body.department === "string" ? body.department.trim().toUpperCase() : null;
  const rawYear = body.year;
  const interests = typeof body.interests === "string" ? body.interests.trim() : null;
  const phone = typeof body.phone === "string" ? body.phone.trim() : null;
  const role = typeof body.role === "string" && body.role ? body.role : "student";

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }
  if (name.length < 2 || name.length > 100) {
    return res.status(400).json({ message: "Name must be between 2 and 100 characters." });
  }
  if (!emailPattern.test(email) || email.length > 254) {
    return res.status(400).json({ message: "Please provide a valid email address." });
  }
  if (password.length < 6 || password.length > 128) {
    return res.status(400).json({ message: "Password must be between 6 and 128 characters." });
  }

  const year = rawYear === null || rawYear === undefined || rawYear === "" ? null : Number(rawYear);
  if (year !== null && (!Number.isInteger(year) || year < 1 || year > 4)) {
    return res.status(400).json({ message: "Year must be a number from 1 to 4." });
  }

  const unavailable = authenticationUnavailable(res);
  if (unavailable) return unavailable;

  try {
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const [result] = await db.query(
      "INSERT INTO users (name, email, password, department, year, interests, phone, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [name, email, hashedPassword, department || null, year, interests || null, phone || null, role]
    );

    const user = { id: result.insertId, name, email, role: role, department, year, interests, phone };
    const token = jwt.sign({ id: user.id, name, email, role: role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "Account created successfully!",
      token,
      user
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

const login = async (req, res) => {
  const body = req.body || {};
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }
  if (!emailPattern.test(email) || email.length > 254) {
    return res.status(400).json({ message: "Please provide a valid email address." });
  }

  const unavailable = authenticationUnavailable(res);
  if (unavailable) return unavailable;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const userRecord = rows[0];
    const isMatch = await bcrypt.compare(password, userRecord.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = {
      id: userRecord.id,
      name: userRecord.name,
      email: userRecord.email,
      role: userRecord.role
    };
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      message: "Login successful!",
      token,
      user
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, email, role, department, year, interests, phone, created_at FROM users WHERE id = ?",
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: "User not found." });
    res.status(200).json({ user: rows[0] });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Failed to fetch user." });
  }
};

// PATCH /api/auth/profile — student updates their own profile
const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const body = req.body || {};
  const name = typeof body.name === "string" ? body.name.trim() : null;
  const department = typeof body.department === "string" ? body.department.trim().toUpperCase() : null;
  const rawYear = body.year;
  const interests = typeof body.interests === "string" ? body.interests.trim() : null;
  const phone = typeof body.phone === "string" ? body.phone.trim() : null;

  const year = rawYear === null || rawYear === undefined || rawYear === "" ? null : Number(rawYear);
  if (year !== null && (!Number.isInteger(year) || year < 1 || year > 4)) {
    return res.status(400).json({ message: "Year must be a number from 1 to 4." });
  }

  try {
    await db.query(
      "UPDATE users SET name = COALESCE(?, name), department = COALESCE(?, department), year = COALESCE(?, year), interests = ?, phone = COALESCE(?, phone) WHERE id = ?",
      [name, department, year, interests, phone, userId]
    );
    const [rows] = await db.query(
      "SELECT id, name, email, role, department, year, interests, phone FROM users WHERE id = ?",
      [userId]
    );
    res.status(200).json({ message: "Profile updated.", user: rows[0] });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile." });
  }
};

// POST /api/auth/fcm-token — save FCM token for push notifications
const saveFCMToken = async (req, res) => {
  const userId = req.user.id;
  const { fcm_token } = req.body;
  if (!fcm_token) return res.status(400).json({ message: "FCM token is required." });

  try {
    await db.query("UPDATE users SET fcm_token = ? WHERE id = ?", [fcm_token, userId]);
    res.status(200).json({ message: "FCM token saved successfully." });
  } catch (error) {
    console.error("Save FCM token error:", error);
    res.status(500).json({ message: "Failed to save FCM token." });
  }
};

module.exports = { register, login, getCurrentUser, updateProfile, saveFCMToken };