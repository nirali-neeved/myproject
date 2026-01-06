const express = require("express");
const {
  register,
  login,
  verifyEmail,
  resetPassword,
  forgetPassword,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify-email/:token", verifyEmail);
router.post("/forget-password", forgetPassword);
router.post("/reset-password",resetPassword);

module.exports = router;