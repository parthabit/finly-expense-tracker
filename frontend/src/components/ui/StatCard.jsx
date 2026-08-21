import { motion } from "framer-motion";
import clsx from "clsx";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

export default function StatCard({ label, value, icon: Icon, trend, tone = "primary", delay = 0 }) {
  const toneClasses = {
    primary: "from-primary-500 to-primary-700",
    accent: "from-accent-500 to-accent-600",
    dark: "from-secondary-800 to-secondary-950",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-2xl bg-white dark:bg-secondary-900 shadow-card border border-secondary-100 dark:border-white/5 p-5 relative overflow-hidden group"
    >
      <div
        className={clsx(
          "absolute -top-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br opacity-10 group-hover:scale-125 transition-transform duration-500",
          toneClasses[tone]
        )}
      />
      <div className="flex items-start justify-between">
        <p className="text-sm text-secondary-500 dark:text-secondary-400 font-medium">{label}</p>
        {Icon && (
          <div
            className={clsx(
              "h-9 w-9 rounded-xl flex items-center justify-center bg-gradient-to-br text-white",
              toneClasses[tone]
            )}
          >
            <Icon size={18} />
          </div>
        )}
      </div>
      <p className="mt-3 text-2xl font-display font-bold tracking-tight">
        {formatCurrency(value)}
      </p>
      {trend !== undefined && (
        <div
          className={clsx(
            "mt-2 inline-flex items-center gap-1 text-xs font-medium rounded-full px-2 py-0.5",
            trend >= 0 ? "text-accent-600 bg-accent-50 dark:bg-accent-500/10" : "text-danger bg-red-50 dark:bg-red-500/10"
          )}
        >
          {trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(trend)}% vs last month
        </div>
      )}
    </motion.div>
  );
}
