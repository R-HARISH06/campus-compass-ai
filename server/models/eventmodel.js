const db = require("../config/db");

const getAllEvents = async () => {
  const [rows] = await db.query("SELECT * FROM events");
  return rows;
};

const registerForEvent = async (userId, eventId) => {
  const [result] = await db.query(
    "INSERT INTO event_registrations (user_id, event_id) VALUES (?, ?)",
    [userId, eventId]
  );
  return result;
};

const getUserRSVPs = async (userId) => {
  const [rows] = await db.query(
    "SELECT event_id FROM event_registrations WHERE user_id = ?",
    [userId]
  );
  return rows.map(r => r.event_id);
};

const cancelRSVP = async (userId, eventId) => {
  const [result] = await db.query(
    "DELETE FROM event_registrations WHERE user_id = ? AND event_id = ?",
    [userId, eventId]
  );
  return result;
};

module.exports = { getAllEvents, registerForEvent, getUserRSVPs, cancelRSVP };