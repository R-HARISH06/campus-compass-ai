const express = require("express");
const router = express.Router();
const { getAnnouncements, createAnnouncement, deleteAnnouncement } = require("../controllers/announcementController");
const { verifyMasterAdmin } = require("../middleware/authMiddleware");

router.get("/",       getAnnouncements);                    // Public
router.post("/",      verifyMasterAdmin, createAnnouncement);     // Admin only
router.delete("/:id", verifyMasterAdmin, deleteAnnouncement);     // Admin only

module.exports = router;
