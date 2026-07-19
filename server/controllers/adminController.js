const db = require("../config/db");

// GET /api/admin/stats
const getAdminStats = async (req, res) => {
  try {
    const [[{ totalEvents }]] = await db.query("SELECT COUNT(*) AS totalEvents FROM events");
    const [[{ totalClubs }]] = await db.query("SELECT COUNT(*) AS totalClubs FROM clubs");
    const [[{ totalUsers }]] = await db.query("SELECT COUNT(*) AS totalUsers FROM users");
    const [[{ totalFaculty }]] = await db.query("SELECT COUNT(*) AS totalFaculty FROM faculty");
    const [[{ totalAnnouncements }]] = await db.query("SELECT COUNT(*) AS totalAnnouncements FROM announcements");

    res.status(200).json({
      totalEvents:        totalEvents || 0,
      totalClubs:         totalClubs || 0,
      totalUsers:         totalUsers || 0,
      totalFaculty:       totalFaculty || 0,
      totalAnnouncements: totalAnnouncements || 0
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ message: "Failed to fetch admin stats." });
  }
};

// GET /api/admin/analytics — engagement data for charts
const getAnalytics = async (req, res) => {
  try {
    // Signups by month (last 6 months)
    const [signupsByMonth] = await db.query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS count
      FROM users
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY month ORDER BY month
    `);

    // Event registrations per event
    const [eventRegistrations] = await db.query(`
      SELECT e.title, COUNT(er.id) AS registrations
      FROM events e
      LEFT JOIN event_registrations er ON e.id = er.event_id
      GROUP BY e.id, e.title
      ORDER BY registrations DESC
      LIMIT 10
    `);

    // Club memberships per club
    const [clubMemberships] = await db.query(`
      SELECT c.name, COUNT(cm.id) AS members
      FROM clubs c
      LEFT JOIN club_memberships cm ON c.id = cm.club_id
      GROUP BY c.id, c.name
      ORDER BY members DESC
    `);

    // Top AI queries (most recent 10 unique)
    const [topQueries] = await db.query(`
      SELECT query, COUNT(*) AS count, MAX(created_at) AS last_asked
      FROM ai_query_logs
      GROUP BY query
      ORDER BY count DESC
      LIMIT 10
    `);

    // Users by department
    const [usersByDept] = await db.query(`
      SELECT COALESCE(department, 'Unknown') AS department, COUNT(*) AS count
      FROM users
      GROUP BY department
      ORDER BY count DESC
    `);

    res.status(200).json({ signupsByMonth, eventRegistrations, clubMemberships, topQueries, usersByDept });
  } catch (error) {
    console.error("Admin analytics error:", error);
    res.status(500).json({ message: "Failed to fetch analytics." });
  }
};

// GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, name, email, role, department, year, interests, phone, created_at FROM users ORDER BY created_at DESC"
    );
    res.status(200).json(users);
  } catch (error) {
    console.error("Admin get users error:", error);
    res.status(500).json({ message: "Failed to fetch users list." });
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (req.user.id === Number(id)) {
    return res.status(400).json({ message: "You cannot delete your own admin account." });
  }
  try {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found." });
    res.status(200).json({ message: "User removed successfully." });
  } catch (error) {
    console.error("Admin delete user error:", error);
    res.status(500).json({ message: "Failed to delete user." });
  }
};

// PATCH /api/admin/users/:id/role — promote/demote user role
const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const validRoles = ["student", "faculty", "master_admin", "data_admin", "club_admin", "cafe_owner"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role." });
  }
  if (req.user.id === Number(id)) {
    return res.status(400).json({ message: "You cannot change your own role." });
  }
  try {
    const [result] = await db.query("UPDATE users SET role = ? WHERE id = ?", [role, id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found." });
    res.status(200).json({ message: `User role updated to ${role}.` });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({ message: "Failed to update role." });
  }
};

module.exports = { getAdminStats, getAnalytics, getUsers, deleteUser, updateUserRole };
