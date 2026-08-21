import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Search, Plus, Pencil, Trash2, Receipt, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import api from "../api/axios";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import TransactionForm from "../components/TransactionForm";
import { formatCurrency } from "../utils/formatCurrency";
import { CATEGORIES, CATEGORY_META } from "../data/categories";

export default function Transactions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/transactions", {
        params: { page, limit: 10, search: search || undefined, category: category || undefined, type: type || undefined, sortBy, sortOrder },
      });
      setTransactions(data.transactions);
      setPagination(data.pagination);
    } catch (err) {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, [page, search, category, type, sortBy, sortOrder]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  useEffect(() => {
    const addType = searchParams.get("add");
    if (addType === "expense" || addType === "income") {
      setEditing({ type: addType });
      setModalOpen(true);
      searchParams.delete("add");
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSort = (field) => {
    if (sortBy === field) setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    else { setSortBy(field); setSortOrder("desc"); }
  };

  const handleSave = async (formData) => {
    setSubmitting(true);
    try {
      if (editing?._id) {
        await api.put(`/transactions/${editing._id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Transaction updated");
      } else {
        await api.post("/transactions", formData, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Transaction added");
      }
      setModalOpen(false);
      setEditing(null);
      fetchTransactions();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save transaction");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/transactions/${deleteTarget._id}`);
      toast.success("Transaction deleted");
      setDeleteTarget(null);
      fetchTransactions();
    } catch (err) {
      toast.error("Failed to delete transaction");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display font-bold text-xl">Transactions</h2>
          <p className="text-sm text-secondary-400">{pagination.total} total transactions</p>
        </div>
        <Button onClick={() => { setEditing(null); setModalOpen(true); }}>
          <Plus size={16} /> Add Transaction
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-secondary-50 dark:bg-white/5 rounded-xl px-3 py-2.5 flex-1 min-w-[200px]">
            <Search size={16} className="text-secondary-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search description, notes, tags, amount..."
              className="bg-transparent text-sm outline-none w-full placeholder:text-secondary-400"
            />
          </div>
          <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className="rounded-xl border border-secondary-200 dark:border-white/10 dark:bg-secondary-900 px-3 py-2.5 text-sm outline-none">
            <option value="">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="rounded-xl border border-secondary-200 dark:border-white/10 dark:bg-secondary-900 px-3 py-2.5 text-sm outline-none">
            <option value="">All categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}
          </div>
        ) : transactions.length === 0 ? (
          <EmptyState icon={Receipt} title="No transactions found" description="Try adjusting your filters, or add a new transaction." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-secondary-400 border-b border-secondary-100 dark:border-white/5">
                    <th className="px-5 py-3 font-medium">
                      <button onClick={() => toggleSort("date")} className="flex items-center gap-1">Date <ArrowUpDown size={12} /></button>
                    </th>
                    <th className="px-5 py-3 font-medium">Category</th>
                    <th className="px-5 py-3 font-medium">Description</th>
                    <th className="px-5 py-3 font-medium">Method</th>
                    <th className="px-5 py-3 font-medium text-right">
                      <button onClick={() => toggleSort("amount")} className="flex items-center gap-1 ml-auto">Amount <ArrowUpDown size={12} /></button>
                    </th>
                    <th className="px-5 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => {
                    const meta = CATEGORY_META[tx.category] || CATEGORY_META.Others;
                    const Icon = meta.icon;
                    return (
                      <tr key={tx._id} className="border-b border-secondary-50 dark:border-white/5 hover:bg-secondary-50/50 dark:hover:bg-white/5 transition">
                        <td className="px-5 py-3 whitespace-nowrap">{new Date(tx.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                        <td className="px-5 py-3">
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: `${meta.color}18`, color: meta.color }}>
                            <Icon size={12} /> {tx.category}
                          </span>
                        </td>
                        <td className="px-5 py-3 max-w-[200px] truncate">{tx.description || "—"}</td>
                        <td className="px-5 py-3 capitalize text-secondary-500">{tx.paymentMethod.replace("_", " ")}</td>
                        <td className={`px-5 py-3 text-right font-semibold whitespace-nowrap ${tx.type === "income" ? "text-accent" : ""}`}>
                          {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex justify-end gap-1">
                            <button onClick={() => { setEditing(tx); setModalOpen(true); }} className="p-1.5 rounded-lg text-secondary-400 hover:bg-secondary-100 dark:hover:bg-white/10 hover:text-primary transition">
                              <Pencil size={15} />
                            </button>
                            <button onClick={() => setDeleteTarget(tx)} className="p-1.5 rounded-lg text-secondary-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-danger transition">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-5 py-4 border-t border-secondary-100 dark:border-white/5">
              <p className="text-xs text-secondary-400">Page {pagination.page} of {pagination.totalPages}</p>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="p-2 rounded-lg border border-secondary-200 dark:border-white/10 disabled:opacity-40">
                  <ChevronLeft size={16} />
                </button>
                <button disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)} className="p-2 rounded-lg border border-secondary-200 dark:border-white/10 disabled:opacity-40">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} title={editing?._id ? "Edit Transaction" : "Add Transaction"}>
        <TransactionForm
          defaultValues={editing?._id ? { ...editing, date: new Date(editing.date).toISOString().slice(0, 10), tags: (editing.tags || []).join(", ") } : editing || undefined}
          onSubmit={handleSave}
          onCancel={() => { setModalOpen(false); setEditing(null); }}
          submitting={submitting}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete transaction?"
        description="This action can't be undone. The transaction and any attached receipt will be permanently removed."
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  );
}
