import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import catchAsync from "../utils/catchAsync.js";
import { comparePassword, hashPassword } from "../utils/hashingHelper.js";
import { sendMail } from "../utils/emailHelper.js";
import { otpHelper } from "../utils/otpHelper.js";

export const register = catchAsync(async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      const error = new Error("Email already exists");
      error.statusCode = 400;
      return next(error);
    }

    const hashedPassword = await hashPassword(password);
    const verifyToken = crypto.randomBytes(32).toString("hex");

    await User.create({
      username,
      email,
      password: hashedPassword,
      emailverifyToken: verifyToken,
      emailverifyExpire: Date.now() + 5 * 60 * 1000,
    });

    const verifyLink = `${process.env.BASE_URL}/api/auth/verify-email/${verifyToken}`;
    await sendMail(
      email,
      "Verify your email",
      `<a href="${verifyLink}">Verify Now</a>`
    );

    res
      .status(201)
      .json({ message: "Registration successful. Check your email." });
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
});

export const login = catchAsync(async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user || !(await comparePassword(password, user.password))) {
      const error = new Error("Invalid Password");
      error.statusCode = 400;
      return next(error);
    }

    if (!user.isVerified) {
      const error = new Error("Verify your email");
      error.statusCode = 401;
      return next(error);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("Invalid email,Not exisiting email");
      error.statusCode = 404;
      return next(error);
    }

    const otp = otpHelper(6);
    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 3 * 60 * 1000;
    await user.save();

    await sendMail(
      email,
      "Reset Password OTP",
      `<p>Your OTP is <b>${otp}</b></p>`
    );
    res.json({ message: "OTP sent to email" });
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({
      email,
      resetOtp: otp,
      resetOtpExpire: { $gt: Date.now() },
    });

    if (!user) {
      const error = new Error("Expired OTP");
      error.statusCode = 400;
      return next(error);
    }

    user.password = await hashPassword(newPassword);
    user.resetOtp = null;
    user.resetOtpExpire = null;

    await user.save();
    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
});

export const verifyEmail = catchAsync(async (req, res, next) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailverifyToken: token,
      emailverifyExpire: { $gt: Date.now() },
    });

    if (!user) {
      const error = new Error("Expired verification link");
      error.statusCode = 400;
      return next(error);
    }

    user.isVerified = true;
    user.emailverifyToken = undefined;
    user.emailverifyExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
});
