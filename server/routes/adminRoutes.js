const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  getVolunteers,
  getStats,
  deleteVolunteer,
} = require("../controllers/adminController");

router.use(protect);

router.get("/volunteers", getVolunteers);
router.get("/stats", getStats);
router.delete("/volunteers/:id", deleteVolunteer);

module.exports = router;
