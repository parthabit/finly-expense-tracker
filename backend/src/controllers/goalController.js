const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const Goal = require("../models/Goal");

const createGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, goal });
});

const listGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, goals });
});

const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
  if (!goal) throw new ApiError(404, "Goal not found");
  Object.assign(goal, req.body);
  if (goal.currentAmount >= goal.targetAmount) goal.isAchieved = true;
  await goal.save();
  res.json({ success: true, goal });
});

const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!goal) throw new ApiError(404, "Goal not found");
  res.json({ success: true, message: "Goal deleted" });
});

module.exports = { createGoal, listGoals, updateGoal, deleteGoal };
