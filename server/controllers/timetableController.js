const db = require("../config/db");

// GET /api/timetable?dept=CSE&year=2
const getTimetable = async (req, res) => {
  const { dept, year } = req.query;
  if (!dept || !year) {
    return res.status(400).json({ message: "dept and year query parameters are required." });
  }
  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  try {
    const [rows] = await db.query(
      `SELECT * FROM timetable 
       WHERE department = ? AND year = ?
       ORDER BY FIELD(day,'Monday','Tuesday','Wednesday','Thursday','Friday'), time_slot`,
      [dept.toUpperCase(), Number(year)]
    );
    // Group by day for easy frontend rendering
    const grouped = {};
    dayOrder.forEach(d => { grouped[d] = []; });
    rows.forEach(row => {
      if (grouped[row.day]) grouped[row.day].push(row);
    });
    res.status(200).json({ department: dept.toUpperCase(), year: Number(year), timetable: grouped });
  } catch (error) {
    console.error("Get timetable error:", error);
    res.status(500).json({ message: "Failed to fetch timetable." });
  }
};

// POST /api/timetable — admin adds a slot
const addTimetableSlot = async (req, res) => {
  const { department, year, day, time_slot, subject, faculty_name, room } = req.body;
  if (!department || !year || !day || !time_slot || !subject) {
    return res.status(400).json({ message: "department, year, day, time_slot, and subject are required." });
  }
  try {
    const [result] = await db.query(
      "INSERT INTO timetable (department, year, day, time_slot, subject, faculty_name, room) VALUES (?,?,?,?,?,?,?)",
      [department.toUpperCase(), Number(year), day, time_slot, subject, faculty_name || null, room || null]
    );
    res.status(201).json({ message: "Timetable slot added.", id: result.insertId });
  } catch (error) {
    console.error("Add timetable slot error:", error);
    res.status(500).json({ message: "Failed to add timetable slot." });
  }
};

// DELETE /api/timetable/:id — admin removes a slot
const deleteTimetableSlot = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM timetable WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Slot not found." });
    res.status(200).json({ message: "Timetable slot removed." });
  } catch (error) {
    console.error("Delete timetable slot error:", error);
    res.status(500).json({ message: "Failed to delete timetable slot." });
  }
};

module.exports = { getTimetable, addTimetableSlot, deleteTimetableSlot };
