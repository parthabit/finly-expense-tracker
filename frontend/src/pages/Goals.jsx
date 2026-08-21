import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Plus, Target, Trash2, CheckCircle2 } from "lucide-react";
import api from "../api/axios";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import ProgressBar from "../components/ui/ProgressBar";
import EmptyState from "../components/ui/EmptyState";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { formatCurrency } from "../utils/formatCurrency";

const ICONS = ["🎯", "🏖️", "💻", "🚗", "🏠", "🎓", "💍", "🛟"];

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { register, handleSubmit, reset } = useForm({ defaultValues: { icon: "🎯" } });

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/goals");
      setGoals(data.goals);
    } catch {
      toast.error("Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGoals(); }, []);

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await api.post("/goals", {
        title: values.title,
        targetAmount: Number(values.targetAmount),
        currentAmount: Number(values.currentAmount) || 0,
        icon: values.icon,
      });
      toast.success("Goal created");
      setModalOpen(false);
      reset();
      fetchGoals();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create goal");
    } finally {
      setSubmitting(false);
    }
  };

  const addFunds = async (goal, amount) => {
    try {
      await api.put(`/goals/${goal._id}`, { currentAmount: goal.currentAmount + amount });
      fetchGoals();
    } catch {
      toast.error("Failed to update goal");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/goals/${deleteTarget._id}`);
      toast.success("Goal deleted");
      setDeleteTarget(null);
      fetchGoals();
    } catch {
      toast.error("Failed to delete goal");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display font-bold text-xl">Savings Goals</h2>
          <p className="text-sm text-secondary-400">Give every rupee a destination</p>
        </div>
        <Button onClick={() => setModalOpen(true)}><Plus size={16} /> New Goal</Button>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-3 gap-5">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}</div>
      ) : goals.length === 0 ? (
        <Card>
          <EmptyState icon={Target} title="No goals yet" description="Create a savings goal to start tracking progress toward it." action={<Button onClick={() => setModalOpen(true)}><Plus size={16} /> Create Goal</Button>} />
        </Card>
      ) : (
        <div className="grid md:grid-cols-3 gap-5">
          {goals.map((goal) => {
            const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            return (
              <Card key={goal._id}>
                <div className="flex items-start justify-between">
                  <div className="text-3xl">{goal.icon}</div>
                  <button onClick={() => setDeleteTarget(goal)} className="p-1.5 rounded-lg text-secondary-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-danger transition">
                    <Trash2 size={15} />
                  </button>
                </div>
                <h3 className="font-display font-semibold mt-2">{goal.title}</h3>
                {goal.isAchieved && (
                  <span className="inline-flex items-center gap-1 text-xs text-accent bg-accent-50 dark:bg-accent-500/10 px-2 py-1 rounded-full mt-1">
                    <CheckCircle2 size={12} /> Goal achieved
                  </span>
                )}
                <p className="text-sm text-secondary-400 mt-2">{formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}</p>
                <ProgressBar percent={percent} className="mt-2" />
                <p className="text-xs text-secondary-400 mt-1">{percent}% funded</p>
                {!goal.isAchieved && (
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => addFunds(goal, 1000)}>+ ₹1,000</Button>
                    <Button size="sm" variant="outline" onClick={() => addFunds(goal, 5000)}>+ ₹5,000</Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Savings Goal">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Goal title" placeholder="e.g. Emergency Fund" {...register("title", { required: true })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Target amount (₹)" type="number" {...register("targetAmount", { required: true })} />
            <Input label="Starting amount (₹)" type="number" {...register("currentAmount")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Icon</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((icon) => (
                <label key={icon} className="cursor-pointer">
                  <input type="radio" value={icon} {...register("icon")} className="hidden peer" />
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-secondary-200 dark:border-white/10 text-lg peer-checked:border-primary peer-checked:bg-primary-50 dark:peer-checked:bg-primary-500/10">
                    {icon}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={submitting}>Create Goal</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete goal?"
        description="This will permanently remove this savings goal and its progress."
        confirmLabel="Delete"
      />
    </div>
  );
}
