const express = require("express");
const { protect } = require("../middleware/auth");
const {
  dashboardSummary,
  monthlySpending,
  categoryBreakdown,
  weeklyTrends,
  cashFlow,
  heatmap,
  topCategories,
} = require("../controllers/analyticsController");

const router = express.Router();
router.use(protect);

router.get("/dashboard", dashboardSummary);
router.get("/monthly-spending", monthlySpending);
router.get("/category-breakdown", categoryBreakdown);
router.get("/weekly-trends", weeklyTrends);
router.get("/cash-flow", cashFlow);
router.get("/heatmap", heatmap);
router.get("/top-categories", topCategories);

module.exports = router;
