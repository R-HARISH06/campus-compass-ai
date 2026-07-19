const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyToken, verifyMasterAdmin } = require("../middleware/authMiddleware");

// GET /api/clubs — list all clubs
router.get("/", async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM clubs ORDER BY name");
    res.json(result);
  } catch (error) {
    console.error("Get clubs error:", error);
    res.status(500).json({ message: "Database error" });
  }
});

// GET /api/clubs/mine — get clubs the logged-in student has joined
router.get("/mine", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.* FROM clubs c
       INNER JOIN club_memberships cm ON c.id = cm.club_id
       WHERE cm.user_id = ?
       ORDER BY c.name`,
      [req.user.id]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("Get my clubs error:", error);
    res.status(500).json({ message: "Failed to fetch your clubs." });
  }
});

// POST /api/clubs/:id/join — student joins a club
router.post("/:id/join", verifyToken, async (req, res) => {
  const clubId = req.params.id;
  const userId = req.user.id;
  try {
    await db.query(
      "INSERT INTO club_memberships (user_id, club_id) VALUES (?, ?)",
      [userId, clubId]
    );
    res.status(201).json({ message: "Successfully joined the club!" });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "You have already joined this club." });
    }
    console.error("Join club error:", error);
    res.status(500).json({ message: "Failed to join club." });
  }
});

// DELETE /api/clubs/:id/leave — student leaves a club
router.delete("/:id/leave", verifyToken, async (req, res) => {
  const clubId = req.params.id;
  const userId = req.user.id;
  try {
    const [result] = await db.query(
      "DELETE FROM club_memberships WHERE user_id = ? AND club_id = ?",
      [userId, clubId]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Club membership not found." });
    res.status(200).json({ message: "Left the club successfully." });
  } catch (error) {
    console.error("Leave club error:", error);
    res.status(500).json({ message: "Failed to leave club." });
  }
});

const { verifyClubAdmin } = require("../middleware/authMiddleware");

// GET /api/clubs/:id/requests — Club admin views pending requests
router.get("/:id/requests", verifyClubAdmin, async (req, res) => {
  const clubId = req.params.id;
  try {
    // Check if they are the admin of this club (or master_admin)
    if (req.user.role !== "master_admin") {
      const [clubCheck] = await db.query("SELECT admin_id FROM clubs WHERE id = ?", [clubId]);
      if (clubCheck.length === 0 || clubCheck[0].admin_id !== req.user.id) {
        return res.status(403).json({ message: "You are not the admin of this club." });
      }
    }

    const [requests] = await db.query(
      `SELECT u.id, u.name, u.email, u.department, u.year, cm.joined_at, cm.status 
       FROM club_memberships cm
       JOIN users u ON cm.user_id = u.id
       WHERE cm.club_id = ? AND cm.status = 'pending'`,
      [clubId]
    );
    res.status(200).json(requests);
  } catch (error) {
    console.error("Get requests error:", error);
    res.status(500).json({ message: "Database error." });
  }
});

// PUT /api/clubs/:id/requests/:userId — Club admin approves/rejects
router.put("/:id/requests/:userId", verifyClubAdmin, async (req, res) => {
  const { id: clubId, userId } = req.params;
  const { status } = req.body; // 'approved' or 'rejected'
  
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: "Invalid status." });
  }

  try {
    if (req.user.role !== "master_admin") {
      const [clubCheck] = await db.query("SELECT admin_id FROM clubs WHERE id = ?", [clubId]);
      if (clubCheck.length === 0 || clubCheck[0].admin_id !== req.user.id) {
        return res.status(403).json({ message: "You are not the admin of this club." });
      }
    }

    if (status === 'rejected') {
      await db.query("DELETE FROM club_memberships WHERE user_id = ? AND club_id = ?", [userId, clubId]);
      return res.status(200).json({ message: "Request rejected." });
    } else {
      await db.query("UPDATE club_memberships SET status = 'approved' WHERE user_id = ? AND club_id = ?", [userId, clubId]);
      return res.status(200).json({ message: "Request approved." });
    }
  } catch (error) {
    console.error("Update request error:", error);
    res.status(500).json({ message: "Database error." });
  }
});

// POST /api/clubs — admin creates a club
router.post("/", verifyMasterAdmin, async (req, res) => {
  const { name, description, faculty_coordinator, meeting_day, contact_email } = req.body;
  if (!name) return res.status(400).json({ message: "Club name is required." });
  try {
    const [result] = await db.query(
      "INSERT INTO clubs (name, description, faculty_coordinator, meeting_day, contact_email) VALUES (?,?,?,?,?)",
      [name, description || null, faculty_coordinator || null, meeting_day || null, contact_email || null]
    );
    res.status(201).json({ message: "Club created.", id: result.insertId });
  } catch (error) {
    console.error("Create club error:", error);
    res.status(500).json({ message: "Failed to create club." });
  }
});

// PUT /api/clubs/:id — admin updates a club
router.put("/:id", verifyMasterAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description, faculty_coordinator, meeting_day, contact_email } = req.body;
  try {
    const [result] = await db.query(
      "UPDATE clubs SET name=?, description=?, faculty_coordinator=?, meeting_day=?, contact_email=? WHERE id=?",
      [name, description, faculty_coordinator, meeting_day, contact_email, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Club not found." });
    res.status(200).json({ message: "Club updated." });
  } catch (error) {
    console.error("Update club error:", error);
    res.status(500).json({ message: "Failed to update club." });
  }
});

// DELETE /api/clubs/:id — admin deletes a club
router.delete("/:id", verifyMasterAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM clubs WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Club not found." });
    res.status(200).json({ message: "Club deleted." });
  } catch (error) {
    console.error("Delete club error:", error);
    res.status(500).json({ message: "Failed to delete club." });
  }
});

module.exports = router;