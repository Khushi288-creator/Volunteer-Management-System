const Volunteer = require("../models/volunteer");

const registerVolunteer = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      college,
      skills,
      preferredDomain,
      availability,
    } = req.body;

    // Required field check
    if (
      !fullName ||
      !email ||
      !phone ||
      !college ||
      !skills ||
      !preferredDomain ||
      !availability
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Phone: exactly 10 digits
    const digits = String(phone).replace(/\D/g, "");
    if (digits.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be exactly 10 digits",
      });
    }

    const volunteer = await Volunteer.create({ ...req.body, phone: digits });

    res.status(201).json({
      success: true,
      message: "Volunteer registered successfully",
      volunteer,
    });
  } catch (error) {
    // Mongoose validation errors
    if (error.name === "ValidationError") {
      const msg = Object.values(error.errors)
        .map((e) => e.message)
        .join(", ");
      return res.status(400).json({ success: false, message: msg });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { registerVolunteer };
