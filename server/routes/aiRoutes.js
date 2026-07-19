const express = require("express");
const router = express.Router();
const { askGemini, getRecommendations } = require("../controllers/aiController");
const { verifyToken } = require("../middleware/authMiddleware");

// Chat with Campus Compass AI (auth required — logs query to DB)
router.post("/chat",      verifyToken, askGemini);

// Get personalized AI recommendations (auth required)
router.post("/recommend", verifyToken, getRecommendations);

module.exports = router;
