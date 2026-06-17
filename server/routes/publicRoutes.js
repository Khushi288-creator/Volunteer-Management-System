const express = require("express");
const router = express.Router();
const Volunteer = require("../models/volunteer");

/**
 * GET /api/public/stats
 * No authentication required — used by the homepage Statistics section.
 * Returns real counts from MongoDB.
 * Future Phase 2+ fields are returned as 0 now and will be populated
 * once the Application / Task / Certificate models are added.
 */
router.get("/stats", async (req, res) => {
  try {
    const totalVolunteers = await Volunteer.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        totalVolunteers,       // ← real, from DB
        totalApplications: 0,  // Phase 2 — Application.countDocuments()
        totalHours: 0,         // Phase 4 — sum of Task.hoursAwarded
        certificatesIssued: 0, // Phase 6 — Certificate.countDocuments()
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
