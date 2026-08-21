const express = require("express");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { goalSchema } = require("../schemas/budgetSchemas");
const { createGoal, listGoals, updateGoal, deleteGoal } = require("../controllers/goalController");

const router = express.Router();
router.use(protect);

router.get("/", listGoals);
router.post("/", validate(goalSchema), createGoal);
router.put("/:id", validate(goalSchema.partial()), updateGoal);
router.delete("/:id", deleteGoal);

module.exports = router;
