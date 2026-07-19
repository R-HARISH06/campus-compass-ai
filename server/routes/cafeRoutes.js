const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyCafeOwner } = require("../middleware/authMiddleware");

// GET /api/cafe/menu (Public for all students)
router.get("/menu", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM canteen_menu ORDER BY item_type, item_name");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Fetch cafe menu error:", error);
    res.status(500).json({ message: "Failed to load canteen menu." });
  }
});

// POST /api/cafe/menu (Cafe Owner/Admin only)
router.post("/menu", verifyCafeOwner, async (req, res) => {
  const { item_name, item_type, price, is_available, image_url } = req.body;
  
  if (!item_name || !item_type || !price) {
    return res.status(400).json({ message: "Item name, type, and price are required." });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO canteen_menu (item_name, item_type, price, is_available, image_url, updated_by) VALUES (?, ?, ?, ?, ?, ?)",
      [item_name, item_type, price, is_available !== undefined ? is_available : true, image_url || null, req.user.id]
    );
    res.status(201).json({ message: "Item added successfully.", id: result.insertId });
  } catch (error) {
    console.error("Add menu item error:", error);
    res.status(500).json({ message: "Failed to add item." });
  }
});

// PUT /api/cafe/menu/:id (Cafe Owner/Admin only)
router.put("/menu/:id", verifyCafeOwner, async (req, res) => {
  const { id } = req.params;
  const { item_name, item_type, price, is_available, image_url } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE canteen_menu SET item_name = ?, item_type = ?, price = ?, is_available = ?, image_url = ?, updated_by = ? WHERE id = ?",
      [item_name, item_type, price, is_available, image_url, req.user.id, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Item not found." });
    res.status(200).json({ message: "Item updated." });
  } catch (error) {
    console.error("Update menu error:", error);
    res.status(500).json({ message: "Failed to update item." });
  }
});

// DELETE /api/cafe/menu/:id (Cafe Owner/Admin only)
router.delete("/menu/:id", verifyCafeOwner, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM canteen_menu WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Item not found." });
    res.status(200).json({ message: "Item deleted." });
  } catch (error) {
    console.error("Delete menu error:", error);
    res.status(500).json({ message: "Failed to delete item." });
  }
});

module.exports = router;
