const Volunteer = require("../models/Volunteer");

const registerVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.create(req.body);

    res.status(201).json({
      success: true,
      message: "Volunteer Registered Successfully",
      volunteer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerVolunteer,
};