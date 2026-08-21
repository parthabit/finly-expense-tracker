require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");
const Goal = require("../models/Goal");

const CATEGORIES_EXPENSE = ["Food", "Shopping", "Travel", "Bills", "Healthcare", "Entertainment", "Education", "Others"];
const CATEGORIES_INCOME = ["Salary", "Freelance", "Investment"];
const PAYMENT_METHODS = ["bank", "cash", "credit_card", "upi"];

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[rand(0, arr.length - 1)];

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected. Seeding...");

  await Promise.all([
    Transaction.deleteMany({}),
    Budget.deleteMany({}),
    Goal.deleteMany({}),
    User.deleteMany({ email: { $in: ["demo@expensetracker.app", "admin@expensetracker.app"] } }),
  ]);

  const demoUser = await User.create({
    name: "Aarav Sharma",
    email: "demo@expensetracker.app",
    password: "Demo@12345",
    isEmailVerified: true,
    wallets: [
      { name: "HDFC Bank", type: "bank", balance: 84250 },
      { name: "Cash Wallet", type: "cash", balance: 3200 },
      { name: "Amex Credit Card", type: "credit_card", balance: -12500 },
      { name: "UPI (PhonePe)", type: "upi", balance: 5400 },
    ],
  });

  const adminUser = await User.create({
    name: "Admin",
    email: "admin@expensetracker.app",
    password: "Admin@12345",
    role: "admin",
    isEmailVerified: true,
  });

  // 6 months of realistic transactions
  const now = new Date();
  const transactions = [];

  for (let m = 5; m >= 0; m--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - m, 1);

    transactions.push({
      user: demoUser._id,
      type: "income",
      amount: rand(65000, 72000),
      category: "Salary",
      date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 1),
      paymentMethod: "bank",
      description: "Monthly salary",
      isRecurring: true,
      recurringFrequency: "monthly",
    });

    if (Math.random() > 0.4) {
      transactions.push({
        user: demoUser._id,
        type: "income",
        amount: rand(8000, 20000),
        category: "Freelance",
        date: new Date(monthDate.getFullYear(), monthDate.getMonth(), rand(5, 20)),
        paymentMethod: "upi",
        description: "Freelance project payment",
      });
    }

    const expenseCount = rand(14, 22);
    for (let i = 0; i < expenseCount; i++) {
      const category = pick(CATEGORIES_EXPENSE);
      const amountRanges = {
        Food: [150, 1800], Shopping: [500, 6000], Travel: [200, 4500],
        Bills: [800, 5000], Healthcare: [300, 3500], Entertainment: [200, 2500],
        Education: [500, 8000], Others: [100, 2000],
      };
      const [min, max] = amountRanges[category];
      transactions.push({
        user: demoUser._id,
        type: "expense",
        amount: rand(min, max),
        category,
        date: new Date(monthDate.getFullYear(), monthDate.getMonth(), rand(1, 28)),
        paymentMethod: pick(PAYMENT_METHODS),
        description: `${category} expense`,
        tags: Math.random() > 0.6 ? ["monthly"] : [],
        isRecurring: category === "Bills",
        recurringFrequency: category === "Bills" ? "monthly" : null,
      });
    }
  }

  await Transaction.insertMany(transactions);

  await Budget.create({
    user: demoUser._id,
    month: now.getMonth(),
    year: now.getFullYear(),
    totalBudget: 45000,
    categoryBudgets: [
      { category: "Food", limit: 8000 },
      { category: "Shopping", limit: 6000 },
      { category: "Travel", limit: 5000 },
      { category: "Bills", limit: 10000 },
      { category: "Entertainment", limit: 3000 },
    ],
  });

  await Goal.create([
    { user: demoUser._id, title: "Emergency Fund", targetAmount: 200000, currentAmount: 96000, icon: "🛟" },
    { user: demoUser._id, title: "Goa Trip", targetAmount: 60000, currentAmount: 22000, icon: "🏖️" },
    { user: demoUser._id, title: "New Laptop", targetAmount: 90000, currentAmount: 90000, icon: "💻", isAchieved: true },
  ]);

  console.log("Seed complete:");
  console.log("  Demo user  -> demo@expensetracker.app / Demo@12345");
  console.log("  Admin user -> admin@expensetracker.app / Admin@12345");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
