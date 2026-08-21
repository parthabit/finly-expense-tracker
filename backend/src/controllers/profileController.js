const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ["name", "currency", "language", "timezone", "notificationPreferences"];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) req.user[field] = req.body[field];
  });
  await req.user.save();
  res.json({ success: true, user: req.user.toSafeObject() });
});

const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No image uploaded");

  const uploadFromBuffer = () =>
    new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "expense-tracker/avatars" },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

  const result = await uploadFromBuffer();
  req.user.avatar = result.secure_url;
  await req.user.save();
  res.json({ success: true, avatar: result.secure_url });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await require("../models/User").findById(req.user._id).select("+password");
  if (!(await user.comparePassword(currentPassword))) {
    throw new ApiError(401, "Current password is incorrect");
  }
  user.password = newPassword;
  user.refreshTokens = [];
  await user.save();
  res.json({ success: true, message: "Password changed. Please log in again." });
});

const deleteAccount = asyncHandler(async (req, res) => {
  const Transaction = require("../models/Transaction");
  const Budget = require("../models/Budget");
  const Goal = require("../models/Goal");
  await Promise.all([
    Transaction.deleteMany({ user: req.user._id }),
    Budget.deleteMany({ user: req.user._id }),
    Goal.deleteMany({ user: req.user._id }),
    User.findByIdAndDelete(req.user._id),
  ]);
  res.clearCookie("refreshToken", { path: "/api/auth" });
  res.json({ success: true, message: "Account and all associated data deleted" });
});

module.exports = { updateProfile, uploadAvatar, changePassword, deleteAccount };
