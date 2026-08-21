const { z } = require("zod");

const budgetSchema = z.object({
  month: z.number().int().min(0).max(11),
  year: z.number().int().min(2000).max(2100),
  totalBudget: z.number().nonnegative(),
  categoryBudgets: z
    .array(z.object({ category: z.string(), limit: z.number().nonnegative() }))
    .optional(),
});

const goalSchema = z.object({
  title: z.string().min(2).max(80),
  targetAmount: z.number().positive(),
  currentAmount: z.number().nonnegative().optional(),
  targetDate: z.coerce.date().optional(),
  icon: z.string().optional(),
});

module.exports = { budgetSchema, goalSchema };
