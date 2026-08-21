const asyncHandler = require("../utils/asyncHandler");
const Transaction = require("../models/Transaction");

const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);

// Generates human-readable insights by comparing this month's spend to last month's,
// per category and overall. No external AI call - purely derived from the user's own data.
const getInsights = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const lastMonthStart = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));

  const [thisMonthByCat, lastMonthByCat, thisMonthTotals, lastMonthTotals] = await Promise.all([
    Transaction.aggregate([
      { $match: { user: userId, type: "expense", date: { $gte: thisMonthStart } } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]),
    Transaction.aggregate([
      { $match: { user: userId, type: "expense", date: { $gte: lastMonthStart, $lt: thisMonthStart } } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]),
    Transaction.aggregate([
      { $match: { user: userId, date: { $gte: thisMonthStart } } },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]),
    Transaction.aggregate([
      { $match: { user: userId, date: { $gte: lastMonthStart, $lt: thisMonthStart } } },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]),
  ]);

  const toMap = (arr) => Object.fromEntries(arr.map((a) => [a._id, a.total]));
  const thisCat = toMap(thisMonthByCat);
  const lastCat = toMap(lastMonthByCat);
  const thisTotals = toMap(thisMonthTotals);
  const lastTotals = toMap(lastMonthTotals);

  const insights = [];

  Object.keys(thisCat).forEach((category) => {
    const current = thisCat[category];
    const previous = lastCat[category];
    if (!previous) return;
    const pctChange = Math.round(((current - previous) / previous) * 100);
    if (Math.abs(pctChange) >= 10) {
      insights.push({
        type: pctChange > 0 ? "warning" : "positive",
        message:
          pctChange > 0
            ? `You spent ${pctChange}% more on ${category} this month.`
            : `Nice — ${category} spending dropped ${Math.abs(pctChange)}% from last month.`,
      });
    }
  });

  const thisSavings = (thisTotals.income || 0) - (thisTotals.expense || 0);
  const lastSavings = (lastTotals.income || 0) - (lastTotals.expense || 0);
  if (lastSavings > 0) {
    const savingsChange = Math.round(((thisSavings - lastSavings) / Math.abs(lastSavings)) * 100);
    if (Math.abs(savingsChange) >= 5) {
      insights.push({
        type: savingsChange > 0 ? "positive" : "warning",
        message:
          savingsChange > 0
            ? `Your savings increased by ${savingsChange}% compared to last month.`
            : `Your savings dropped ${Math.abs(savingsChange)}% compared to last month.`,
      });
    }
  }

  // Highlight the single largest category this month as a savings opportunity.
  const sortedCats = Object.entries(thisCat).sort((a, b) => b[1] - a[1]);
  if (sortedCats.length) {
    const [topCategory, topAmount] = sortedCats[0];
    const potentialSaving = Math.round(topAmount * 0.15);
    if (potentialSaving > 0) {
      insights.push({
        type: "tip",
        message: `You could save around ₹${potentialSaving.toLocaleString("en-IN")} by trimming ${topCategory.toLowerCase()} spending by 15%.`,
      });
    }
  }

  if (!insights.length) {
    insights.push({
      type: "info",
      message: "Add a few more transactions and check back — insights get sharper with more data.",
    });
  }

  res.json({ success: true, insights: insights.slice(0, 6) });
});

module.exports = { getInsights };
