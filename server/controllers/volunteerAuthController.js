const jwt = require("jsonwebtoken");
const Volunteer = require("../models/volunteer");

// Generate a volunteer-scoped JWT
const generateToken = (volunteer) => {
  return jwt.sign(
    { id: volunteer._id, email: volunteer.email, role: "volunteer" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ── POST /api/auth/volunteer/register ──────────────────────────────────────
const registerVolunteer = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      college,
      skills,
      preferredDomain,
      availability,
    } = req.body;

    // Basic field validation
    if (
      !fullName ||
      !email ||
      !password ||
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

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
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

    // Duplicate check
    const existing = await Volunteer.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const volunteer = await Volunteer.create({
      fullName,
      email,
      password,
      phone: digits,
      college,
      skills,
      preferredDomain,
      availability,
    });

    const token = generateToken(volunteer);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      volunteer: {
        id: volunteer._id,
        fullName: volunteer.fullName,
        email: volunteer.email,
        preferredDomain: volunteer.preferredDomain,
        status: volunteer.status,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── POST /api/auth/volunteer/login ─────────────────────────────────────────
const loginVolunteer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const volunteer = await Volunteer.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!volunteer || !volunteer.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await volunteer.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (volunteer.status === "suspended") {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended. Please contact support.",
      });
    }

    const token = generateToken(volunteer);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      volunteer: {
        id: volunteer._id,
        fullName: volunteer.fullName,
        email: volunteer.email,
        preferredDomain: volunteer.preferredDomain,
        status: volunteer.status,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET /api/auth/volunteer/me ─────────────────────────────────────────────
const getMe = async (req, res) => {
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

module.exports = { registerVolunteer, loginVolunteer, getMe };
