import { useState } from "react";
import toast from "react-hot-toast";
import { FileText, Download } from "lucide-react";
import api from "../api/axios";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { formatCurrency } from "../utils/formatCurrency";

const RANGES = [
  { key: "weekly", label: "Weekly", days: 7 },
  { key: "monthly", label: "Monthly", days: 30 },
  { key: "yearly", label: "Yearly", days: 365 },
];

export default function Reports() {
  const [range, setRange] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  const generate = async () => {
    setLoading(true);
    try {
      const days = RANGES.find((r) => r.key === range).days;
      const startDate = new Date(Date.now() - days * 86400000).toISOString();
      const { data } = await api.get("/transactions", { params: { limit: 100, sortBy: "date", sortOrder: "desc", startDate } });

      const totalIncome = data.transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
      const totalExpense = data.transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

      setReport({ transactions: data.transactions, totalIncome, totalExpense, net: totalIncome - totalExpense, count: data.transactions.length });
    } catch {
      toast.error("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!report) return;
    const header = "Date,Type,Category,Amount,Payment Method,Description\n";
    const rows = report.transactions
      .map((t) => [new Date(t.date).toLocaleDateString("en-IN"), t.type, t.category, t.amount, t.paymentMethod, `"${(t.description || "").replace(/"/g, '""')}"`].join(","))
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finly-report-${range}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded");
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display font-bold text-xl">Reports</h2>
        <p className="text-sm text-secondary-400">Generate and export spending reports</p>
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-2 p-1 bg-secondary-50 dark:bg-white/5 rounded-xl">
            {RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${range === r.key ? "bg-white dark:bg-secondary-800 shadow-sm text-primary" : "text-secondary-400"}`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <Button onClick={generate} isLoading={loading}><FileText size={16} /> Generate Report</Button>
          {report && (
            <Button variant="outline" onClick={exportCSV}><Download size={16} /> Export CSV</Button>
          )}
        </div>
      </Card>

      {report && (
        <>
          <div className="grid sm:grid-cols-3 gap-4">
            <Card><p className="text-sm text-secondary-400">Total Income</p><p className="font-display font-bold text-xl text-accent mt-1">{formatCurrency(report.totalIncome)}</p></Card>
            <Card><p className="text-sm text-secondary-400">Total Expense</p><p className="font-display font-bold text-xl mt-1">{formatCurrency(report.totalExpense)}</p></Card>
            <Card><p className="text-sm text-secondary-400">Net</p><p className={`font-display font-bold text-xl mt-1 ${report.net >= 0 ? "text-accent" : "text-danger"}`}>{formatCurrency(report.net)}</p></Card>
          </div>

          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-secondary-400 border-b border-secondary-100 dark:border-white/5">
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">Category</th>
                    <th className="px-5 py-3 font-medium">Description</th>
                    <th className="px-5 py-3 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {report.transactions.map((t) => (
                    <tr key={t._id} className="border-b border-secondary-50 dark:border-white/5">
                      <td className="px-5 py-3 whitespace-nowrap">{new Date(t.date).toLocaleDateString("en-IN")}</td>
                      <td className="px-5 py-3">{t.category}</td>
                      <td className="px-5 py-3 truncate max-w-[200px]">{t.description || "—"}</td>
                      <td className={`px-5 py-3 text-right font-medium ${t.type === "income" ? "text-accent" : ""}`}>{t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
