const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateTokens");

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  path: "/api/auth",
};

const issueTokens = async (res, user) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshTokens = [...(user.refreshTokens || []), refreshToken].slice(-5);
  await user.save();
  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
  return accessToken;
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, "An account with this email already exists");

  const user = await User.create({ name, email, password });
  const accessToken = await issueTokens(res, user);

  res.status(201).json({
    success: true,
    message: "Account created. Please verify your email to unlock all features.",
    accessToken,
    user: user.toSafeObject(),
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }
  if (user.isSuspended) throw new ApiError(403, "This account has been suspended");

  const accessToken = await issueTokens(res, user);
  res.json({ success: true, accessToken, user: user.toSafeObject() });
});

const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw new ApiError(401, "No refresh token provided");

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw new ApiError(401, "Refresh token invalid or expired");
  }

  const user = await User.findById(decoded.sub);
  if (!user || !user.refreshTokens.includes(token)) {
    throw new ApiError(401, "Refresh token not recognized");
  }

  // Rotate refresh token
  user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
  const accessToken = await issueTokens(res, user);

  res.json({ success: true, accessToken, user: user.toSafeObject() });
});

const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token && req.user) {
    req.user.refreshTokens = req.user.refreshTokens.filter((t) => t !== token);
    await req.user.save();
  }
  res.clearCookie("refreshToken", { path: "/api/auth" });
  res.json({ success: true, message: "Logged out" });
});

const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user.toSafeObject() });
});

// Demo-friendly forgot/reset password flow (no real email transport wired up).
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  // Always respond the same way to avoid leaking which emails exist.
  const resetToken = user
    ? jwt.sign({ sub: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" })
    : null;

  res.json({
    success: true,
    message: "If an account exists for that email, a reset link has been sent.",
    // Exposed here only because this project has no email transport configured yet.
    devResetToken: resetToken,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch {
    throw new ApiError(400, "Reset link is invalid or has expired");
  }
  const user = await User.findById(decoded.sub);
  if (!user) throw new ApiError(400, "Reset link is invalid or has expired");

  user.password = password;
  user.refreshTokens = [];
  await user.save();
  res.json({ success: true, message: "Password reset. Please log in." });
});

module.exports = { register, login, refresh, logout, me, forgotPassword, resetPassword };
