const db = require("../config/db");
const { sendPush } = require("../config/firebaseAdmin");

// GET /api/announcements — list all (newest first)
const getAnnouncements = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT a.*, u.name AS created_by_name
       FROM announcements a
       LEFT JOIN users u ON a.created_by = u.id
       ORDER BY a.created_at DESC`
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("Get announcements error:", error);
    res.status(500).json({ message: "Failed to fetch announcements." });
  }
};

// POST /api/announcements — admin creates announcement
const createAnnouncement = async (req, res) => {
  const { title, body } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required." });
  try {
    const [result] = await db.query(
      "INSERT INTO announcements (title, body, created_by) VALUES (?, ?, ?)",
      [title, body, req.user.id]
    );

    // Broadcast FCM notification to all users who have an fcm_token
    try {
      const [users] = await db.query("SELECT fcm_token FROM users WHERE fcm_token IS NOT NULL");
      const tokens = users.map(u => u.fcm_token);
      
      if (tokens.length > 0) {
        const message = {
          notification: {
            title: `📢 New Announcement: ${title}`,
            body: body ? body.substring(0, 100) + (body.length > 100 ? "..." : "") : ""
          },
          tokens: tokens
        };
        const response = await sendPush(message);
        console.log(`Successfully sent ${response.successCount} messages; Failed ${response.failureCount}`);
      }
    } catch (pushErr) {
      console.error("Failed to send push notifications:", pushErr);
    }

    res.status(201).json({ message: "Announcement created.", id: result.insertId });
  } catch (error) {
    console.error("Create announcement error:", error);
    res.status(500).json({ message: "Failed to create announcement." });
  }
};

// DELETE /api/announcements/:id — admin deletes announcement
const deleteAnnouncement = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM announcements WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Announcement not found." });
    res.status(200).json({ message: "Announcement deleted." });
  } catch (error) {
    console.error("Delete announcement error:", error);
    res.status(500).json({ message: "Failed to delete announcement." });
  }
};

module.exports = { getAnnouncements, createAnnouncement, deleteAnnouncement };
