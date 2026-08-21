import { useEffect, useState } from "react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";
import api from "../api/axios";
import Card from "../components/ui/Card";
import { formatCurrency } from "../utils/formatCurrency";
import { CATEGORY_META } from "../data/categories";

export default function Analytics() {
  const [categoryData, setCategoryData] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [cashFlow, setCashFlow] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [cat, mon, cf, top] = await Promise.all([
          api.get("/analytics/category-breakdown"),
          api.get("/analytics/monthly-spending"),
          api.get("/analytics/cash-flow"),
          api.get("/analytics/top-categories"),
        ]);
        setCategoryData(cat.data.categoryBreakdown);
        setMonthly(mon.data.monthlySpending);
        setCashFlow(cf.data.cashFlow);
        setTopCategories(top.data.topCategories);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="grid lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-80 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-xl">Analytics</h2>
        <p className="text-sm text-secondary-400">Deep dive into your spending patterns</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-display font-semibold mb-4">Category Breakdown (This Month)</h3>
          {categoryData.length === 0 ? (
            <p className="text-sm text-secondary-400 py-12 text-center">No expenses recorded this month yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={categoryData} dataKey="total" nameKey="category" innerRadius={60} outerRadius={95} paddingAngle={2}>
                  {categoryData.map((entry) => (
                    <Cell key={entry.category} fill={(CATEGORY_META[entry.category] || CATEGORY_META.Others).color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <h3 className="font-display font-semibold mb-4">Income vs Expense (12 Months)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
              <Bar dataKey="income" fill="#10B981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-display font-semibold mb-4">Cash Flow (6 Months)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={cashFlow}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
              <Line type="monotone" dataKey="inflow" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="outflow" stroke="#EF4444" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-display font-semibold mb-4">Top Categories (This Month)</h3>
          {topCategories.length === 0 ? (
            <p className="text-sm text-secondary-400 py-12 text-center">No expenses recorded this month yet.</p>
          ) : (
            <div className="space-y-4">
              {topCategories.map((c, i) => {
                const meta = CATEGORY_META[c.category] || CATEGORY_META.Others;
                const Icon = meta.icon;
                const max = topCategories[0].total;
                return (
                  <div key={c.category} className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${meta.color}20`, color: meta.color }}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{c.category}</span>
                        <span className="text-secondary-400">{formatCurrency(c.total)}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary-100 dark:bg-white/10 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(c.total / max) * 100}%`, backgroundColor: meta.color }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
