const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

const monthRange = (month, year) => {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 1);
  return { start, end };
};

const attachActuals = async (budget, userId) => {
  const { start, end } = monthRange(budget.month, budget.year);
  const spent = await Transaction.aggregate([
    { $match: { user: userId, type: "expense", date: { $gte: start, $lt: end } } },
    { $group: { _id: "$category", total: { $sum: "$amount" } } },
  ]);
  const spentByCategory = Object.fromEntries(spent.map((s) => [s._id, s.total]));
  const totalSpent = spent.reduce((sum, s) => sum + s.total, 0);

  return {
    ...budget.toObject(),
    totalSpent,
    remaining: budget.totalBudget - totalSpent,
    percentUsed: budget.totalBudget > 0 ? Math.round((totalSpent / budget.totalBudget) * 100) : 0,
    isOverspent: totalSpent > budget.totalBudget,
    categoryBudgets: budget.categoryBudgets.map((cb) => {
      const spentAmt = spentByCategory[cb.category] || 0;
      return {
        ...cb.toObject(),
        spent: spentAmt,
        remaining: cb.limit - spentAmt,
        percentUsed: cb.limit > 0 ? Math.round((spentAmt / cb.limit) * 100) : 0,
        isOverspent: spentAmt > cb.limit,
      };
    }),
  };
};

const createBudget = asyncHandler(async (req, res) => {
  const existing = await Budget.findOne({
    user: req.user._id,
    month: req.body.month,
    year: req.body.year,
  });
  if (existing) throw new ApiError(409, "A budget for this month already exists");

  const budget = await Budget.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, budget: await attachActuals(budget, req.user._id) });
});

const listBudgets = asyncHandler(async (req, res) => {
  const budgets = await Budget.find({ user: req.user._id }).sort({ year: -1, month: -1 });
  const withActuals = await Promise.all(budgets.map((b) => attachActuals(b, req.user._id)));
  res.json({ success: true, budgets: withActuals });
});

const getBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findOne({ _id: req.params.id, user: req.user._id });
  if (!budget) throw new ApiError(404, "Budget not found");
  res.json({ success: true, budget: await attachActuals(budget, req.user._id) });
});

const updateBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findOne({ _id: req.params.id, user: req.user._id });
  if (!budget) throw new ApiError(404, "Budget not found");
  Object.assign(budget, req.body);
  await budget.save();
  res.json({ success: true, budget: await attachActuals(budget, req.user._id) });
});

const deleteBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!budget) throw new ApiError(404, "Budget not found");
  res.json({ success: true, message: "Budget deleted" });
});

module.exports = { createBudget, listBudgets, getBudget, updateBudget, deleteBudget };
