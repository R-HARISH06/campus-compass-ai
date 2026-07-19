const express = require("express");
const router = express.Router();
const {
  getFaculty,
  getDepartments,
  getHODs,
  createFaculty,
  updateFaculty,
  deleteFaculty
} = require("../controllers/facultyController");
const { verifyToken, verifyDataAdmin } = require("../middleware/authMiddleware");

router.get("/",            getFaculty);        // Public: list all faculty (with filters)
router.get("/departments", getDepartments);    // Public: list dept codes
router.get("/hods",        getHODs);           // Public: list all HODs

router.post("/",           verifyDataAdmin, createFaculty);      // Admin: create
router.put("/:id",         verifyDataAdmin, updateFaculty);      // Admin: update
router.delete("/:id",      verifyDataAdmin, deleteFaculty);      // Admin: delete

module.exports = router;
