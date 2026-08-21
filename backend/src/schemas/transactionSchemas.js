const { z } = require("zod");
const { CATEGORIES } = require("../models/Transaction");

const tagsPreprocess = (val) => {
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return val.split(",").map((t) => t.trim()).filter(Boolean);
    }
  }
  return val;
};

// z.coerce is used throughout so this schema accepts both JSON bodies and
// multipart/form-data bodies (where every field arrives as a string).
const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  category: z.enum(CATEGORIES),
  date: z.coerce.date().optional(),
  paymentMethod: z.enum(["bank", "cash", "credit_card", "upi"]).optional(),
  description: z.string().max(200).optional(),
  tags: z.preprocess(tagsPreprocess, z.array(z.string())).optional(),
  notes: z.string().max(1000).optional(),
  isRecurring: z.coerce.boolean().optional(),
  recurringFrequency: z.enum(["daily", "weekly", "monthly", "yearly"]).nullable().optional(),
});

const updateTransactionSchema = transactionSchema.partial();

module.exports = { transactionSchema, updateTransactionSchema };
