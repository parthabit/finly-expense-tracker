const asyncHandler = require("../utils/asyncHandler");
const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");

const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const startOfNextMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 1);

const dashboardSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = startOfNextMonth(now);
  const lastMonthStart = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));

  const [all, thisMonth, lastMonth, upcoming] = await Promise.all([
    Transaction.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]),
    Transaction.aggregate([
      { $match: { user: userId, date: { $gte: monthStart, $lt: monthEnd } } },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]),
    Transaction.aggregate([
      { $match: { user: userId, date: { $gte: lastMonthStart, $lt: monthStart } } },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]),
    Transaction.find({
      user: userId,
      isRecurring: true,
      type: "expense",
    })
      .sort({ date: 1 })
      .limit(5),
  ]);

  const sumByType = (arr) =>
    Object.fromEntries(arr.map((a) => [a._id, a.total]));

  const allTotals = sumByType(all);
  const monthTotals = sumByType(thisMonth);
  const lastMonthTotals = sumByType(lastMonth);

  const totalIncome = allTotals.income || 0;
  const totalExpense = allTotals.expense || 0;
  const monthlyIncome = monthTotals.income || 0;
  const monthlyExpense = monthTotals.expense || 0;

  const recentTransactions = await Transaction.find({ user: userId })
    .sort({ date: -1, createdAt: -1 })
    .limit(8);

  res.json({
    success: true,
    summary: {
      totalBalance: totalIncome - totalExpense,
      netWorth: totalIncome - totalExpense,
      monthlyIncome,
      monthlyExpense,
      savings: monthlyIncome - monthlyExpense,
      lastMonthIncome: lastMonthTotals.income || 0,
      lastMonthExpense: lastMonthTotals.expense || 0,
    },
    recentTransactions,
    upcomingBills: upcoming,
  });
});

const monthlySpending = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const results = await Transaction.aggregate([
    { $match: { user: userId, date: { $gte: from } } },
    {
      $group: {
        _id: { year: { $year: "$date" }, month: { $month: "$date" }, type: "$type" },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const months = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth() + 1, label: d.toLocaleString("default", { month: "short" }), income: 0, expense: 0 });
  }
  results.forEach((r) => {
    const m = months.find((mo) => mo.year === r._id.year && mo.month === r._id.month);
    if (m) m[r._id.type] = r.total;
  });

  res.json({ success: true, monthlySpending: months });
});

const categoryBreakdown = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { month, year } = req.query;
  const now = new Date();
  const y = year ? parseInt(year) : now.getFullYear();
  const m = month !== undefined ? parseInt(month) : now.getMonth();
  const start = new Date(y, m, 1);
  const end = new Date(y, m + 1, 1);

  const breakdown = await Transaction.aggregate([
    { $match: { user: userId, type: "expense", date: { $gte: start, $lt: end } } },
    { $group: { _id: "$category", total: { $sum: "$amount" } } },
    { $sort: { total: -1 } },
  ]);

  res.json({
    success: true,
    categoryBreakdown: breakdown.map((b) => ({ category: b._id, total: b.total })),
  });
});

const weeklyTrends = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const now = new Date();
  const from = new Date(now);
  from.setDate(from.getDate() - 7 * 8);

  const results = await Transaction.aggregate([
    { $match: { user: userId, date: { $gte: from } } },
    {
      $group: {
        _id: { week: { $week: "$date" }, type: "$type" },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.week": 1 } },
  ]);

  res.json({ success: true, weeklyTrends: results });
});

const cashFlow = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const results = await Transaction.aggregate([
    { $match: { user: userId, date: { $gte: from } } },
    {
      $group: {
        _id: { year: { $year: "$date" }, month: { $month: "$date" }, type: "$type" },
        total: { $sum: "$amount" },
      },
    },
  ]);

  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth() + 1, label: d.toLocaleString("default", { month: "short" }), inflow: 0, outflow: 0 });
  }
  results.forEach((r) => {
    const mo = months.find((x) => x.year === r._id.year && x.month === r._id.month);
    if (mo) mo[r._id.type === "income" ? "inflow" : "outflow"] = r.total;
  });

  res.json({ success: true, cashFlow: months });
});

const heatmap = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const now = new Date();
  const from = new Date(now.getFullYear(), 0, 1);

  const results = await Transaction.aggregate([
    { $match: { user: userId, type: "expense", date: { $gte: from } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        total: { $sum: "$amount" },
      },
    },
  ]);

  res.json({
    success: true,
    heatmap: results.map((r) => ({ date: r._id, total: r.total })),
  });
});

const topCategories = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const now = new Date();
  const start = startOfMonth(now);
  const end = startOfNextMonth(now);

  const results = await Transaction.aggregate([
    { $match: { user: userId, type: "expense", date: { $gte: start, $lt: end } } },
    { $group: { _id: "$category", total: { $sum: "$amount" }, count: { $sum: 1 } } },
    { $sort: { total: -1 } },
    { $limit: 5 },
  ]);

  res.json({
    success: true,
    topCategories: results.map((r) => ({ category: r._id, total: r.total, count: r.count })),
  });
});

module.exports = {
  dashboardSummary,
  monthlySpending,
  categoryBreakdown,
  weeklyTrends,
  cashFlow,
  heatmap,
  topCategories,
};
