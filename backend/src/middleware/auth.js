const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const User = require("../models/User");

const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw new ApiError(401, "Not authorized, no token provided");
  }
  const token = header.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (err) {
    throw new ApiError(401, "Not authorized, token invalid or expired");
  }

  const user = await User.findById(decoded.sub);
  if (!user) throw new ApiError(401, "Not authorized, user not found");
  if (user.isSuspended) throw new ApiError(403, "Account suspended");

  req.user = user;
  next();
});

const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    throw new ApiError(403, "Admin access required");
  }
  next();
};

module.exports = { protect, adminOnly };
