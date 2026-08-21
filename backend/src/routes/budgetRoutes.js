const express = require("express");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { budgetSchema } = require("../schemas/budgetSchemas");
const {
  createBudget,
  listBudgets,
  getBudget,
  updateBudget,
  deleteBudget,
} = require("../controllers/budgetController");

const router = express.Router();
router.use(protect);

router.get("/", listBudgets);
router.post("/", validate(budgetSchema), createBudget);
router.get("/:id", getBudget);
router.put("/:id", validate(budgetSchema.partial()), updateBudget);
router.delete("/:id", deleteBudget);

module.exports = router;
