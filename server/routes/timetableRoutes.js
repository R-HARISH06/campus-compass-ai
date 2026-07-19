const express = require("express");
const router = express.Router();
const { getTimetable, addTimetableSlot, deleteTimetableSlot } = require("../controllers/timetableController");
const { verifyToken, verifyDataAdmin } = require("../middleware/authMiddleware");

router.get("/", getTimetable); // Public route
router.post("/",      verifyDataAdmin, addTimetableSlot);       // Admin: add slot
router.delete("/:id", verifyDataAdmin, deleteTimetableSlot);    // Admin: remove slot

module.exports = router;
