import express from "express";
import validate from "../middleware/validateMiddleware.js";

import {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
} from "../controllers/authController.js";
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from "../validations/authValidations.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.get("/verify-email/:token", verifyEmail);

export default router;