import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { CATEGORIES } from "../data/categories";

const schema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().positive("Enter an amount greater than 0"),
  category: z.enum(CATEGORIES),
  date: z.string().min(1, "Date is required"),
  paymentMethod: z.enum(["bank", "cash", "credit_card", "upi"]),
  description: z.string().max(200).optional(),
  notes: z.string().max(1000).optional(),
  tags: z.string().optional(),
  isRecurring: z.boolean().optional(),
});

export default function TransactionForm({ defaultValues, onSubmit, onCancel, submitting }) {
  const [receipt, setReceipt] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "expense",
      paymentMethod: "cash",
      date: new Date().toISOString().slice(0, 10),
      ...defaultValues,
    },
  });

  const type = watch("type");

  const submit = (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, val]) => {
      if (key === "tags") {
        formData.append("tags", JSON.stringify(val ? val.split(",").map((t) => t.trim()).filter(Boolean) : []));
      } else if (val !== undefined && val !== "") {
        formData.append(key, val);
      }
    });
    if (receipt) formData.append("receipt", receipt);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-2 p-1 bg-secondary-50 dark:bg-white/5 rounded-xl">
        {["expense", "income"].map((t) => (
          <label key={t} className={`text-center py-2 rounded-lg text-sm font-medium cursor-pointer transition ${type === t ? "bg-white dark:bg-secondary-800 shadow-sm" : "text-secondary-400"}`}>
            <input type="radio" value={t} {...register("type")} className="hidden" />
            {t === "expense" ? "Expense" : "Income"}
          </label>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Amount (₹)" type="number" step="0.01" error={errors.amount?.message} {...register("amount")} />
        <div>
          <label className="block text-sm font-medium mb-1.5">Category</label>
          <select {...register("category")} className="w-full rounded-xl border border-secondary-200 dark:border-white/10 dark:bg-secondary-900 px-3.5 py-2.5 text-sm outline-none focus:border-primary">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <p className="text-xs text-danger mt-1.5">{errors.category.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Date" type="date" error={errors.date?.message} {...register("date")} />
        <div>
          <label className="block text-sm font-medium mb-1.5">Payment Method</label>
          <select {...register("paymentMethod")} className="w-full rounded-xl border border-secondary-200 dark:border-white/10 dark:bg-secondary-900 px-3.5 py-2.5 text-sm outline-none focus:border-primary">
            <option value="bank">Bank</option>
            <option value="cash">Cash</option>
            <option value="credit_card">Credit Card</option>
            <option value="upi">UPI</option>
          </select>
        </div>
      </div>

      <Input label="Description" placeholder="e.g. Grocery run" {...register("description")} />
      <Input label="Tags (comma separated)" placeholder="e.g. weekend, family" {...register("tags")} />

      <div>
        <label className="block text-sm font-medium mb-1.5">Notes</label>
        <textarea
          {...register("notes")}
          rows={2}
          className="w-full rounded-xl border border-secondary-200 dark:border-white/10 dark:bg-secondary-900 px-3.5 py-2.5 text-sm outline-none focus:border-primary resize-none"
          placeholder="Optional notes..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Receipt (optional)</label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setReceipt(e.target.files?.[0] || null)}
          className="w-full text-sm text-secondary-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:bg-primary-50 dark:file:bg-primary-500/10 file:text-primary file:text-sm file:font-medium"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register("isRecurring")} className="rounded accent-primary" />
        This is a recurring transaction
      </label>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={submitting}>Save transaction</Button>
      </div>
    </form>
  );
}
