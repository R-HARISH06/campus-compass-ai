const express = require("express");
const router = express.Router();

const { getEvents, rsvpForEvent, getUserRSVPs, cancelRSVP, createEvent, updateEvent, deleteEvent } = require("../controllers/eventController");
const { verifyToken, verifyMasterAdmin } = require("../middleware/authMiddleware");

router.get("/",                  getEvents);                      // Public
router.get("/rsvps",             verifyToken, getUserRSVPs);      // Auth
router.post("/:eventId/rsvp",    verifyToken, rsvpForEvent);      // Auth
router.delete("/:eventId/rsvp",  verifyToken, cancelRSVP);        // Auth
router.post("/",                 verifyMasterAdmin, createEvent);        // Admin
router.put("/:id",               verifyMasterAdmin, updateEvent);        // Admin
router.delete("/:id",            verifyMasterAdmin, deleteEvent);        // Admin

module.exports = router;