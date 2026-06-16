const Volunteer = require("../models/volunteer");

const getVolunteers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search && search.trim()) {
      const term = search.trim();
      const regex = new RegExp(term, "i");
      query = {
        $or: [
          { fullName: regex },
          { email: regex },
          { phone: regex },
          { college: regex },
          { skills: regex },
          { preferredDomain: regex },
          { availability: regex },
        ],
      };
    }

    const volunteers = await Volunteer.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: volunteers.length,
      volunteers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getStats = async (req, res) => {
  try {
    const totalVolunteers = await Volunteer.countDocuments();

    const recentRegistrations = await Volunteer.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("fullName email preferredDomain createdAt");

    const domainStats = await Volunteer.aggregate([
      {
        $group: {
          _id: "$preferredDomain",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const domainBreakdown = domainStats.map((item) => ({
      domain: item._id || "Unspecified",
      count: item.count,
    }));

    res.status(200).json({
      success: true,
      stats: {
        totalVolunteers,
        recentRegistrations,
        domainBreakdown,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Volunteer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getVolunteers,
  getStats,
  deleteVolunteer,
};
