const jwt = require("jsonwebtoken");

// ── Admin guard (unchanged) ─────────────────────────────────────────────────
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Not authorized — no token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = { id: decoded.id, email: decoded.email };
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Not authorized — invalid or expired token",
    });
  }
};

// ── Volunteer guard (Phase 1) ───────────────────────────────────────────────
const protectVolunteer = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Not authorized — no token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure the token belongs to a volunteer, not an admin
    if (decoded.role !== "volunteer") {
      return res.status(403).json({
        success: false,
        message: "Access denied — volunteer token required",
      });
    }

    req.volunteer = { id: decoded.id, email: decoded.email };
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Not authorized — invalid or expired token",
    });
  }
};

module.exports = { protect, protectVolunteer };
