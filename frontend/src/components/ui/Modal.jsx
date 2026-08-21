import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, maxWidth = "max-w-lg" }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-secondary-950/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className={`relative w-full ${maxWidth} rounded-2xl bg-white dark:bg-secondary-900 shadow-2xl border border-secondary-100 dark:border-white/10 max-h-[90vh] overflow-y-auto`}
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-100 dark:border-white/10 sticky top-0 bg-white dark:bg-secondary-900 z-10">
              <h3 className="font-display font-semibold text-lg">{title}</h3>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-secondary-400 hover:bg-secondary-100 dark:hover:bg-white/10 transition"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
