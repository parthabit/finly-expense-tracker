import { useEffect, useState } from "react";
import {
  Wallet, TrendingUp, PiggyBank, Landmark, Sparkles, ArrowRight,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import StatCard from "../components/ui/StatCard";
import Card from "../components/ui/Card";
import { CardSkeleton } from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import { formatCurrency } from "../utils/formatCurrency";
import { CATEGORY_META } from "../data/categories";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [dash, monthlyRes, insightsRes] = await Promise.all([
          api.get("/analytics/dashboard"),
          api.get("/analytics/monthly-spending"),
          api.get("/insights"),
        ]);
        setSummary(dash.data.summary);
        setRecent(dash.data.recentTransactions);
        setMonthly(monthlyRes.data.monthlySpending);
        setInsights(insightsRes.data.insights);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const pctChange = (curr, prev) => {
    if (!prev) return 0;
    return Math.round(((curr - prev) / prev) * 100);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
        <CardSkeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Balance" value={summary.totalBalance} icon={Wallet} tone="primary" delay={0} />
        <StatCard
          label="Monthly Income"
          value={summary.monthlyIncome}
          icon={TrendingUp}
          tone="accent"
          trend={pctChange(summary.monthlyIncome, summary.lastMonthIncome)}
          delay={0.05}
        />
        <StatCard
          label="Monthly Expense"
          value={summary.monthlyExpense}
          icon={Landmark}
          tone="dark"
          trend={pctChange(summary.monthlyExpense, summary.lastMonthExpense) * -1}
          delay={0.1}
        />
        <StatCard label="Savings" value={summary.savings} icon={PiggyBank} tone="accent" delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold">Cash Flow — Last 12 Months</h3>
              <p className="text-xs text-secondary-400">Income vs expense trend</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthly}>
              <defs>
                <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} />
              <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }} />
              <Area type="monotone" dataKey="income" stroke="#10B981" fill="url(#income)" strokeWidth={2} />
              <Area type="monotone" dataKey="expense" stroke="#2563EB" fill="url(#expense)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* AI Insights */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-primary" />
            <h3 className="font-display font-semibold">AI Insights</h3>
          </div>
          <div className="space-y-3">
            {insights.map((insight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`rounded-xl p-3 text-sm border ${
                  insight.type === "positive" ? "bg-accent-50 dark:bg-accent-500/10 border-accent-100 dark:border-accent-500/20 text-accent-600" :
                  insight.type === "warning" ? "bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20 text-amber-700 dark:text-amber-400" :
                  "bg-primary-50 dark:bg-primary-500/10 border-primary-100 dark:border-primary-500/20 text-primary"
                }`}
              >
                {insight.message}
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold">Recent Transactions</h3>
          <Link to="/app/transactions" className="text-sm text-primary font-medium inline-flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {recent.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title="No transactions yet"
            description="Add your first income or expense to see it here."
          />
        ) : (
          <div className="divide-y divide-secondary-100 dark:divide-white/5">
            {recent.map((tx) => {
              const meta = CATEGORY_META[tx.category] || CATEGORY_META.Others;
              const Icon = meta.icon;
              return (
                <div key={tx._id} className="flex items-center gap-3 py-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${meta.color}20`, color: meta.color }}>
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{tx.description || tx.category}</p>
                    <p className="text-xs text-secondary-400">{new Date(tx.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {tx.category}</p>
                  </div>
                  <p className={`text-sm font-semibold ${tx.type === "income" ? "text-accent" : "text-secondary-900 dark:text-white"}`}>
                    {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
