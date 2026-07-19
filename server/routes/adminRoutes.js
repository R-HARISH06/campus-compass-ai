const express = require("express");
const router = express.Router();
const { getAdminStats, getAnalytics, getUsers, deleteUser, updateUserRole } = require("../controllers/adminController");
const { verifyMasterAdmin } = require("../middleware/authMiddleware");

router.get("/stats",              verifyMasterAdmin, getAdminStats);
router.get("/analytics",          verifyMasterAdmin, getAnalytics);
router.get("/users",              verifyMasterAdmin, getUsers);
router.delete("/users/:id",       verifyMasterAdmin, deleteUser);
router.patch("/users/:id/role",   verifyMasterAdmin, updateUserRole);

module.exports = router;
