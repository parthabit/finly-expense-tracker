import clsx from "clsx";
import { motion } from "framer-motion";

export default function ProgressBar({ percent = 0, overspent = false, className }) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div className={clsx("h-2 w-full rounded-full bg-secondary-100 dark:bg-white/10 overflow-hidden", className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={clsx(
          "h-full rounded-full",
          overspent ? "bg-danger" : percent > 80 ? "bg-warning" : "bg-accent"
        )}
      />
    </div>
  );
}
