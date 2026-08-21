const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

const overview = asyncHandler(async (req, res) => {
  const [totalUsers, totalTransactions, categoryUsage, recentUsers] = await Promise.all([
    User.countDocuments(),
    Transaction.countDocuments(),
    Transaction.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]),
    User.find().sort({ createdAt: -1 }).limit(8).select("name email createdAt role isSuspended"),
  ]);

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalTransactions,
      // Demo revenue figure: a stand-in for a real billing integration.
      revenue: totalUsers * 499,
    },
    mostUsedCategories: categoryUsage.map((c) => ({ category: c._id, count: c.count })),
    recentUsers,
  });
});

const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, users });
});

const suspendUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");
  user.isSuspended = !user.isSuspended;
  await user.save();
  res.json({ success: true, user: user.toSafeObject() });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, "User not found");
  await Transaction.deleteMany({ user: user._id });
  res.json({ success: true, message: "User deleted" });
});

module.exports = { overview, listUsers, suspendUser, deleteUser };
