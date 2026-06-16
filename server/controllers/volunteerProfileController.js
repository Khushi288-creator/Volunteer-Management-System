const Volunteer = require("../models/volunteer");

// ── GET /api/volunteer/profile ─────────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.volunteer.id).select(
      "-password"
    );
    if (!volunteer) {
      return res
        .status(404)
        .json({ success: false, message: "Volunteer not found" });
    }
    res.status(200).json({ success: true, volunteer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── PUT /api/volunteer/profile ─────────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    // Fields a volunteer is allowed to self-update
    const allowed = [
      "fullName",
      "phone",
      "college",
      "skills",
      "preferredDomain",
      "availability",
      "bio",
    ];

    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No valid fields to update" });
    }

    // Phone: exactly 10 digits when provided
    if (updates.phone !== undefined) {
      const digits = String(updates.phone).replace(/\D/g, "");
      if (digits.length !== 10) {
        return res.status(400).json({
          success: false,
          message: "Phone number must be exactly 10 digits",
        });
      }
      updates.phone = digits;
    }

    const volunteer = await Volunteer.findByIdAndUpdate(
      req.volunteer.id,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    if (!volunteer) {
      return res
        .status(404)
        .json({ success: false, message: "Volunteer not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      volunteer,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET /api/volunteer/dashboard/stats ────────────────────────────────────
const getDashboardStats = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.volunteer.id).select(
      "fullName preferredDomain totalHours status createdAt"
    );

    if (!volunteer) {
      return res
        .status(404)
        .json({ success: false, message: "Volunteer not found" });
    }

    res.status(200).json({
      success: true,
      stats: {
        fullName: volunteer.fullName,
        preferredDomain: volunteer.preferredDomain,
        totalHours: volunteer.totalHours,
        status: volunteer.status,
        memberSince: volunteer.createdAt,
        // Placeholder counters — will be real values from Phase 2 onwards
        applications: 0,
        activeTasks: 0,
        certificates: 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProfile, updateProfile, getDashboardStats };
