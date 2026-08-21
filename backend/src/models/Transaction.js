const mongoose = require("mongoose");

const CATEGORIES = [
  "Food", "Shopping", "Travel", "Bills", "Healthcare",
  "Entertainment", "Salary", "Freelance", "Investment", "Education", "Others",
];

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    amount: { type: Number, required: true, min: 0.01 },
    category: { type: String, enum: CATEGORIES, required: true },
    date: { type: Date, required: true, default: Date.now },
    paymentMethod: {
      type: String,
      enum: ["bank", "cash", "credit_card", "upi"],
      default: "cash",
    },
    description: { type: String, trim: true, default: "" },
    receiptUrl: { type: String, default: "" },
    receiptPublicId: { type: String, default: "" },
    tags: [{ type: String, trim: true }],
    notes: { type: String, default: "" },
    isRecurring: { type: Boolean, default: false },
    recurringFrequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly", null],
      default: null,
    },
  },
  { timestamps: true }
);

transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, category: 1 });
transactionSchema.index(
  { description: "text", notes: "text", tags: "text" },
  { weights: { description: 3, tags: 2, notes: 1 } }
);

module.exports = mongoose.model("Transaction", transactionSchema);
module.exports.CATEGORIES = CATEGORIES;
