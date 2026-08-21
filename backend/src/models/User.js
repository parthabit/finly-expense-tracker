const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    avatar: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    currency: { type: String, default: "INR" },
    language: { type: String, default: "en" },
    timezone: { type: String, default: "Asia/Kolkata" },
    isEmailVerified: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
    notificationPreferences: {
      budgetExceeded: { type: Boolean, default: true },
      billDue: { type: Boolean, default: true },
      goalAchieved: { type: Boolean, default: true },
      monthlyReport: { type: Boolean, default: true },
    },
    wallets: [
      {
        name: { type: String, required: true },
        type: { type: String, enum: ["bank", "cash", "credit_card", "upi"], required: true },
        balance: { type: Number, default: 0 },
      },
    ],
    refreshTokens: [{ type: String }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokens;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
