import {
  UtensilsCrossed, ShoppingBag, Plane, Receipt, HeartPulse,
  Clapperboard, Wallet, Briefcase, TrendingUp, GraduationCap, MoreHorizontal,
} from "lucide-react";

export const CATEGORIES = [
  "Food", "Shopping", "Travel", "Bills", "Healthcare",
  "Entertainment", "Salary", "Freelance", "Investment", "Education", "Others",
];

export const CATEGORY_META = {
  Food: { icon: UtensilsCrossed, color: "#F59E0B" },
  Shopping: { icon: ShoppingBag, color: "#8B5CF6" },
  Travel: { icon: Plane, color: "#3B82F6" },
  Bills: { icon: Receipt, color: "#EF4444" },
  Healthcare: { icon: HeartPulse, color: "#EC4899" },
  Entertainment: { icon: Clapperboard, color: "#F97316" },
  Salary: { icon: Wallet, color: "#10B981" },
  Freelance: { icon: Briefcase, color: "#06B6D4" },
  Investment: { icon: TrendingUp, color: "#2563EB" },
  Education: { icon: GraduationCap, color: "#6366F1" },
  Others: { icon: MoreHorizontal, color: "#64748B" },
};
