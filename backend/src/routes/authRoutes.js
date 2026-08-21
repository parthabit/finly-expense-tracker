const express = require("express");
const rateLimit = require("express-rate-limit");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../schemas/authSchemas");
const {
  register,
  login,
  refresh,
  logout,
  me,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Please try again later." },
});

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", protect, logout);
router.get("/me", protect, me);
router.post("/forgot-password", authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", authLimiter, validate(resetPasswordSchema), resetPassword);

module.exports = router;
