const express = require("express");
const router = express.Router();
const { register, login, getCurrentUser, updateProfile, saveFCMToken } = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/register",   register);
router.post("/login",      login);
router.get("/me",          verifyToken, getCurrentUser);
router.patch("/profile",   verifyToken, updateProfile);   // Student updates own profile
router.post("/fcm-token",  verifyToken, saveFCMToken);

module.exports = router;