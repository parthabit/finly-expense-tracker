import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import FloatingActionButton from "./FloatingActionButton";
import { useAuth } from "../../context/AuthContext";

const PAGE_TITLES = {
  "/app": "Dashboard",
  "/app/transactions": "Transactions",
  "/app/budgets": "Budget Planner",
  "/app/analytics": "Analytics",
  "/app/goals": "Savings Goals",
  "/app/reports": "Reports",
  "/app/profile": "Profile",
  "/app/settings": "Settings",
  "/app/admin": "Admin Dashboard",
};

export default function DashboardLayout() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || "Finly";

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar user={user} mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setMobileOpen(true)} title={title} />
        <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <FloatingActionButton />
    </div>
  );
}
