const db = require("../config/db");
const { sendPush } = require("../config/firebaseAdmin");
const Event = require("../models/eventmodel");

// GET /api/events
const getEvents = async (req, res) => {
  try {
    const { dept, type } = req.query;
    let sql = "SELECT * FROM events WHERE 1=1";
    const params = [];
    if (dept) { sql += " AND (department = ? OR department IS NULL)"; params.push(dept.toUpperCase()); }
    if (type) { sql += " AND event_type = ?"; params.push(type); }
    sql += " ORDER BY id DESC";
    const [rows] = await db.query(sql, params);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

// POST /api/events/:eventId/rsvp
const rsvpForEvent = async (req, res) => {
  const eventId = req.params.eventId;
  const userId = req.user.id;
  try {
    await Event.registerForEvent(userId, eventId);
    res.status(201).json({ message: "RSVP successful." });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Already RSVPed to this event." });
    }
    console.error("RSVP error:", error);
    res.status(500).json({ message: "Failed to process RSVP. Details: " + (error.message || error.toString()) });
  }
};

// GET /api/events/rsvps — get logged-in user's RSVPed event IDs
const getUserRSVPs = async (req, res) => {
  const userId = req.user.id;
  try {
    const rsvps = await Event.getUserRSVPs(userId);
    res.status(200).json(rsvps);
  } catch (error) {
    console.error("Fetch RSVPs error:", error);
    res.status(500).json({ message: "Failed to fetch RSVPs." });
  }
};

// DELETE /api/events/:eventId/rsvp
const cancelRSVP = async (req, res) => {
  const eventId = req.params.eventId;
  const userId = req.user.id;
  try {
    const result = await Event.cancelRSVP(userId, eventId);
    if (result.affectedRows === 0) return res.status(404).json({ message: "RSVP not found." });
    res.status(200).json({ message: "RSVP cancelled successfully." });
  } catch (error) {
    console.error("Cancel RSVP error:", error);
    res.status(500).json({ message: "Failed to cancel RSVP." });
  }
};

// POST /api/events — admin creates event
const createEvent = async (req, res) => {
  const { title, description, venue, date, department, event_type } = req.body;
  if (!title) return res.status(400).json({ message: "Event title is required." });
  try {
    const [result] = await db.query(
      "INSERT INTO events (title, description, venue, date, department, event_type, created_by) VALUES (?,?,?,?,?,?,?)",
      [title, description || null, venue || null, date || null,
       department ? department.toUpperCase() : null,
       event_type || "general",
       req.user.id]
    );

    // Broadcast FCM notification
    try {
      const [users] = await db.query("SELECT fcm_token FROM users WHERE fcm_token IS NOT NULL");
      const tokens = users.map(u => u.fcm_token);
      
      if (tokens.length > 0) {
        const message = {
          notification: {
            title: `🎉 New Event: ${title}`,
            body: `Join us at ${venue} on ${new Date(date).toLocaleDateString()}!`
          },
          tokens: tokens
        };
        const response = await sendPush(message);
        console.log(`Successfully sent ${response.successCount} event notifications.`);
      }
    } catch (pushErr) {
      console.error("Failed to send push notifications:", pushErr);
    }

    res.status(201).json({ message: "Event created.", id: result.insertId });
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({ message: "Failed to create event." });
  }
};

// PUT /api/events/:id — admin updates event
const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, venue, date, department, event_type } = req.body;
  try {
    const [result] = await db.query(
      "UPDATE events SET title=?, description=?, venue=?, date=?, department=?, event_type=? WHERE id=?",
      [title, description, venue, date, department ? department.toUpperCase() : null, event_type || "general", id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Event not found." });
    res.status(200).json({ message: "Event updated." });
  } catch (error) {
    console.error("Update event error:", error);
    res.status(500).json({ message: "Failed to update event." });
  }
};

// DELETE /api/events/:id — admin deletes event
const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM events WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Event not found." });
    res.status(200).json({ message: "Event deleted." });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ message: "Failed to delete event." });
  }
};

module.exports = { getEvents, rsvpForEvent, getUserRSVPs, cancelRSVP, createEvent, updateEvent, deleteEvent };