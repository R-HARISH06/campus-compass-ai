const db = require("../config/db");

// GET /api/faculty — list all faculty with optional filters
// Query params: ?dept=CSE&designation=Professor&hod=true
const getFaculty = async (req, res) => {
  try {
    const { dept, designation, hod } = req.query;
    let sql = "SELECT * FROM faculty WHERE 1=1";
    const params = [];

    if (dept) {
      sql += " AND department = ?";
      params.push(dept.toUpperCase());
    }
    if (designation) {
      sql += " AND designation LIKE ?";
      params.push(`%${designation}%`);
    }
    if (hod === "true") {
      sql += " AND is_hod = TRUE";
    }
    sql += " ORDER BY department, FIELD(designation,'Professor & Head','Professor','Associate Professor','Assistant Professor'), name";

    const [rows] = await db.query(sql, params);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Get faculty error:", error);
    res.status(500).json({ message: "Failed to fetch faculty list." });
  }
};

// GET /api/faculty/departments — list unique dept codes
const getDepartments = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT DISTINCT department FROM faculty ORDER BY department");
    res.status(200).json(rows.map(r => r.department));
  } catch (error) {
    console.error("Get departments error:", error);
    res.status(500).json({ message: "Failed to fetch departments." });
  }
};

// GET /api/faculty/hods — all Heads of Departments
const getHODs = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM faculty WHERE is_hod = TRUE ORDER BY department"
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("Get HODs error:", error);
    res.status(500).json({ message: "Failed to fetch HODs." });
  }
};

// POST /api/faculty — admin creates a faculty member
const createFaculty = async (req, res) => {
  const { name, qualification, designation, department, email, office_hours, subjects_handled, is_hod } = req.body;
  if (!name || !department) {
    return res.status(400).json({ message: "Name and department are required." });
  }
  try {
    const [result] = await db.query(
      "INSERT INTO faculty (name, qualification, designation, department, email, office_hours, subjects_handled, is_hod) VALUES (?,?,?,?,?,?,?,?)",
      [name, qualification || null, designation || null, department.toUpperCase(), email || null, office_hours || null, subjects_handled || null, is_hod ? 1 : 0]
    );
    res.status(201).json({ message: "Faculty member added.", id: result.insertId });
  } catch (error) {
    console.error("Create faculty error:", error);
    res.status(500).json({ message: "Failed to add faculty member." });
  }
};

// PUT /api/faculty/:id — admin updates a faculty member
const updateFaculty = async (req, res) => {
  const { id } = req.params;
  const { name, qualification, designation, department, email, office_hours, subjects_handled, is_hod } = req.body;
  try {
    const [result] = await db.query(
      "UPDATE faculty SET name=?, qualification=?, designation=?, department=?, email=?, office_hours=?, subjects_handled=?, is_hod=? WHERE id=?",
      [name, qualification, designation, department ? department.toUpperCase() : null, email, office_hours, subjects_handled, is_hod ? 1 : 0, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Faculty not found." });
    res.status(200).json({ message: "Faculty updated successfully." });
  } catch (error) {
    console.error("Update faculty error:", error);
    res.status(500).json({ message: "Failed to update faculty." });
  }
};

// DELETE /api/faculty/:id — admin deletes a faculty member
const deleteFaculty = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM faculty WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Faculty not found." });
    res.status(200).json({ message: "Faculty removed." });
  } catch (error) {
    console.error("Delete faculty error:", error);
    res.status(500).json({ message: "Failed to delete faculty." });
  }
};

module.exports = { getFaculty, getDepartments, getHODs, createFaculty, updateFaculty, deleteFaculty };
