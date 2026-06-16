const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const volunteerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /^\d{10}$/.test(v),
        message: "Phone number must be exactly 10 digits",
      },
    },

    college: {
      type: String,
      required: true,
    },

    skills: {
      type: String,
      required: true,
    },

    preferredDomain: {
      type: String,
      required: true,
    },

    availability: {
      type: String,
      required: true,
    },

    // ── Phase 1 additions ──────────────────────────────────────────
    password: {
      type: String,
      default: null, // null for volunteers registered via old public form
    },

    bio: {
      type: String,
      default: "",
      maxlength: 500,
    },

    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },

    totalHours: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving (only when it is set and modified)
volunteerSchema.pre("save", async function () {
  if (!this.password || !this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

volunteerSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Volunteer", volunteerSchema);
