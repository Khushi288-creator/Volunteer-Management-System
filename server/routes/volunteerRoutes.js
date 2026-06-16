const express = require("express");
const router = express.Router();

const {
  registerVolunteer,
} = require("../controllers/volunteerController");

const {
  getProfile,
  updateProfile,
  getDashboardStats,
} = require("../controllers/volunteerProfileController");

const { protectVolunteer } = require("../middleware/authMiddleware");

// ── Public (existing — unchanged) ─────────────────────────────────────────
router.post("/register", registerVolunteer);

// ── Volunteer protected (Phase 1) ──────────────────────────────────────────
router.get("/profile", protectVolunteer, getProfile);
router.put("/profile", protectVolunteer, updateProfile);
router.get("/dashboard/stats", protectVolunteer, getDashboardStats);

module.exports = router;