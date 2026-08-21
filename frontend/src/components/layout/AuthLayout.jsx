import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Wallet } from "lucide-react";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-surface dark:bg-secondary-950">
      <div className="hidden lg:flex flex-col justify-between bg-grad-dark text-white p-12 relative overflow-hidden">
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute top-1/3 -left-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <Link to="/" className="flex items-center gap-2 relative">
          <div className="h-9 w-9 rounded-xl bg-grad-primary flex items-center justify-center shadow-glow">
            <Wallet size={18} />
          </div>
          <span className="font-display font-bold text-lg">Finly</span>
        </Link>
        <div className="relative">
          <blockquote className="font-display text-2xl leading-snug max-w-md">
            "Finly finally made me look forward to checking my bank balance."
          </blockquote>
          <p className="mt-4 text-white/60 text-sm">— A very satisfied demo user</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <Link to="/" className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <div className="h-9 w-9 rounded-xl bg-grad-primary flex items-center justify-center shadow-glow">
              <Wallet className="text-white" size={18} />
            </div>
            <span className="font-display font-bold text-lg">Finly</span>
          </Link>
          <h1 className="font-display font-bold text-2xl">{title}</h1>
          {subtitle && <p className="text-secondary-500 dark:text-secondary-400 text-sm mt-1.5">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-secondary-500 dark:text-secondary-400">{footer}</div>}
        </motion.div>
      </div>
    </div>
  );
}
