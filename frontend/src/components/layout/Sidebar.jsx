import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, ArrowLeftRight, PiggyBank, LineChart,
  Target, FileText, Settings, ShieldCheck, Wallet, X,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/app/budgets", label: "Budgets", icon: PiggyBank },
  { to: "/app/analytics", label: "Analytics", icon: LineChart },
  { to: "/app/goals", label: "Goals", icon: Target },
  { to: "/app/reports", label: "Reports", icon: FileText },
];

export default function Sidebar({ user, mobileOpen, onCloseMobile }) {
  const content = (
    <div className="flex h-full flex-col">
      <div className="px-6 py-6 flex items-center gap-2">
        <div className="h-9 w-9 rounded-xl bg-grad-primary flex items-center justify-center shadow-glow">
          <Wallet className="text-white" size={18} />
        </div>
        <span className="font-display font-bold text-lg tracking-tight">Finly</span>
        <button onClick={onCloseMobile} className="ml-auto lg:hidden text-secondary-400">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "text-primary bg-primary-50 dark:bg-primary-500/10"
                  : "text-secondary-500 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-white/5 hover:text-secondary-900 dark:hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1 bottom-1 w-1 rounded-full bg-primary"
                  />
                )}
                <item.icon size={18} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}

        {user?.role === "admin" && (
          <NavLink
            to="/app/admin"
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? "text-primary bg-primary-50 dark:bg-primary-500/10" : "text-secondary-500 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-white/5"
              }`
            }
          >
            <ShieldCheck size={18} />
            Admin
          </NavLink>
        )}
      </nav>

      <div className="p-3">
        <NavLink
          to="/app/settings"
          onClick={onCloseMobile}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? "text-primary bg-primary-50 dark:bg-primary-500/10" : "text-secondary-500 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-white/5"
            }`
          }
        >
          <Settings size={18} />
          Settings
        </NavLink>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 border-r border-secondary-100 dark:border-white/5 bg-white dark:bg-secondary-900 shrink-0">
        {content}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-secondary-950/50" onClick={onCloseMobile} />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="relative w-64 h-full bg-white dark:bg-secondary-900"
          >
            {content}
          </motion.aside>
        </div>
      )}
    </>
  );
}
