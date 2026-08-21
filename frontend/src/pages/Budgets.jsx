import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Plus, PiggyBank, AlertTriangle, Trash2 } from "lucide-react";
import api from "../api/axios";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import ProgressBar from "../components/ui/ProgressBar";
import EmptyState from "../components/ui/EmptyState";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { formatCurrency } from "../utils/formatCurrency";
import { CATEGORIES, CATEGORY_META } from "../data/categories";

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const now = new Date();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { totalBudget: "", categories: {} },
  });

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/budgets");
      setBudgets(data.budgets);
    } catch {
      toast.error("Failed to load budgets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBudgets(); }, []);

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const categoryBudgets = Object.entries(values.categories || {})
        .filter(([, limit]) => limit && Number(limit) > 0)
        .map(([category, limit]) => ({ category, limit: Number(limit) }));

      await api.post("/budgets", {
        month: now.getMonth(),
        year: now.getFullYear(),
        totalBudget: Number(values.totalBudget),
        categoryBudgets,
      });
      toast.success("Budget created");
      setModalOpen(false);
      reset();
      fetchBudgets();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create budget");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/budgets/${deleteTarget._id}`);
      toast.success("Budget deleted");
      setDeleteTarget(null);
      fetchBudgets();
    } catch {
      toast.error("Failed to delete budget");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display font-bold text-xl">Budget Planner</h2>
          <p className="text-sm text-secondary-400">Plan monthly spending and track it live</p>
        </div>
        <Button onClick={() => setModalOpen(true)}><Plus size={16} /> New Budget</Button>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-5">
          {[...Array(2)].map((_, i) => <div key={i} className="skeleton h-64 rounded-2xl" />)}
        </div>
      ) : budgets.length === 0 ? (
        <Card>
          <EmptyState
            icon={PiggyBank}
            title="No budgets yet"
            description="Create your first monthly budget to start tracking spend against a plan."
            action={<Button onClick={() => setModalOpen(true)}><Plus size={16} /> Create Budget</Button>}
          />
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {budgets.map((budget) => (
            <Card key={budget._id}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display font-semibold">{MONTH_NAMES[budget.month]} {budget.year}</h3>
                  <p className="text-xs text-secondary-400 mt-0.5">
                    {formatCurrency(budget.totalSpent)} of {formatCurrency(budget.totalBudget)} spent
                  </p>
                </div>
                <button onClick={() => setDeleteTarget(budget)} className="p-1.5 rounded-lg text-secondary-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-danger transition">
                  <Trash2 size={15} />
                </button>
              </div>

              {budget.isOverspent && (
                <div className="mt-3 flex items-center gap-2 text-xs text-danger bg-red-50 dark:bg-red-500/10 px-3 py-2 rounded-xl">
                  <AlertTriangle size={14} /> Overspent by {formatCurrency(Math.abs(budget.remaining))}
                </div>
              )}

              <div className="mt-4">
                <ProgressBar percent={budget.percentUsed} overspent={budget.isOverspent} />
                <p className="text-xs text-secondary-400 mt-1.5">{budget.percentUsed}% used · {formatCurrency(Math.max(budget.remaining, 0))} remaining</p>
              </div>

              {budget.categoryBudgets.length > 0 && (
                <div className="mt-5 space-y-3">
                  {budget.categoryBudgets.map((cb) => {
                    const meta = CATEGORY_META[cb.category] || CATEGORY_META.Others;
                    return (
                      <div key={cb.category}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium" style={{ color: meta.color }}>{cb.category}</span>
                          <span className="text-secondary-400">{formatCurrency(cb.spent)} / {formatCurrency(cb.limit)}</span>
                        </div>
                        <ProgressBar percent={cb.percentUsed} overspent={cb.isOverspent} className="h-1.5" />
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={`Budget for ${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input label="Total monthly budget (₹)" type="number" placeholder="e.g. 45000" {...register("totalBudget", { required: true })} />
          <div>
            <p className="text-sm font-medium mb-2">Category limits (optional)</p>
            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
              {CATEGORIES.filter((c) => !["Salary", "Freelance", "Investment"].includes(c)).map((c) => (
                <Input key={c} label={c} type="number" placeholder="₹" {...register(`categories.${c}`)} />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={submitting}>Create Budget</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete budget?"
        description="This will remove the budget plan for this month. Your transactions are not affected."
        confirmLabel="Delete"
      />
    </div>
  );
}
