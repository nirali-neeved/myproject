const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailverifyToken: String,
    emailverifyExpire: Date,

    resetOtp: String,
    resetOtpExpire: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);