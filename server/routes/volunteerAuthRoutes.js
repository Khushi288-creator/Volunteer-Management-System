const express = require("express");
const router = express.Router();

const {
  registerVolunteer,
  loginVolunteer,
  getMe,
} = require("../controllers/volunteerAuthController");
const { protectVolunteer } = require("../middleware/authMiddleware");

// Public
router.post("/register", registerVolunteer);
router.post("/login", loginVolunteer);

// Protected
router.get("/me", protectVolunteer, getMe);

module.exports = router;
