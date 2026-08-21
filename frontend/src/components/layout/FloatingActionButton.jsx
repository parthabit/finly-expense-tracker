import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowDownCircle, ArrowUpCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FloatingActionButton() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    { label: "Add Expense", icon: ArrowDownCircle, color: "bg-danger", to: "/app/transactions?add=expense" },
    { label: "Add Income", icon: ArrowUpCircle, color: "bg-accent", to: "/app/transactions?add=income" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open &&
          actions.map((a, i) => (
            <motion.button
              key={a.label}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => { setOpen(false); navigate(a.to); }}
              className={`flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full text-white text-sm font-medium shadow-lg ${a.color}`}
            >
              <a.icon size={16} /> {a.label}
            </motion.button>
          ))}
      </AnimatePresence>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileTap={{ scale: 0.92 }}
        className="h-14 w-14 rounded-full bg-grad-primary text-white shadow-glow flex items-center justify-center"
        aria-label="Quick actions"
      >
        <motion.span animate={{ rotate: open ? 45 : 0 }}>
          {open ? <X size={22} /> : <Plus size={22} />}
        </motion.span>
      </motion.button>
    </div>
  );
}
