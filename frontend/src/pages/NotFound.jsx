import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface dark:bg-secondary-950 text-center px-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="h-16 w-16 rounded-2xl bg-primary-50 dark:bg-primary-500/10 text-primary flex items-center justify-center mx-auto mb-6">
          <Compass size={30} />
        </div>
        <h1 className="font-display font-bold text-5xl">404</h1>
        <p className="mt-3 text-secondary-500 dark:text-secondary-400">This page took a wrong turn somewhere. Let's get you back on track.</p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 bg-primary text-white font-medium px-6 py-3 rounded-xl shadow-glow hover:bg-primary-600 transition">
          Back to home
        </Link>
      </motion.div>
    </div>
  );
}
