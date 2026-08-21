import { useState } from "react";
import { Menu, Search, Bell, Sun, Moon, LogOut, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Topbar({ onMenuClick, title }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    { id: 1, text: "Your Food budget is 82% used this month", tone: "warning" },
    { id: 2, text: "Electricity bill due in 3 days", tone: "info" },
    { id: 3, text: "Goa Trip goal reached 37% funding", tone: "success" },
  ];

  return (
    <header className="sticky top-0 z-30 glass border-b border-secondary-100 dark:border-white/5">
      <div className="flex items-center gap-3 px-4 lg:px-8 h-16">
        <button onClick={onMenuClick} className="lg:hidden text-secondary-500">
          <Menu size={22} />
        </button>

        <h1 className="font-display font-semibold text-lg hidden sm:block">{title}</h1>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-2 bg-secondary-50 dark:bg-white/5 rounded-xl px-3 py-2 w-64">
            <Search size={16} className="text-secondary-400" />
            <input
              placeholder="Search transactions..."
              className="bg-transparent text-sm outline-none w-full placeholder:text-secondary-400"
            />
          </div>

          <button
            onClick={toggleTheme}
            className="h-9 w-9 rounded-xl flex items-center justify-center text-secondary-500 hover:bg-secondary-100 dark:hover:bg-white/10 transition"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="relative">
            <button
              onClick={() => setNotifOpen((o) => !o)}
              className="h-9 w-9 rounded-xl flex items-center justify-center text-secondary-500 hover:bg-secondary-100 dark:hover:bg-white/10 transition relative"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent" />
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-secondary-900 shadow-2xl border border-secondary-100 dark:border-white/10 p-2"
                >
                  <p className="text-xs font-semibold text-secondary-400 px-3 py-2">NOTIFICATIONS</p>
                  {notifications.map((n) => (
                    <div key={n.id} className="px-3 py-2.5 rounded-xl hover:bg-secondary-50 dark:hover:bg-white/5 text-sm">
                      {n.text}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <button onClick={() => setProfileOpen((o) => !o)} className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-grad-primary flex items-center justify-center text-white text-sm font-semibold overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  user?.name?.[0]?.toUpperCase() || "U"
                )}
              </div>
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-secondary-900 shadow-2xl border border-secondary-100 dark:border-white/10 p-2"
                >
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold truncate">{user?.name}</p>
                    <p className="text-xs text-secondary-400 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => { setProfileOpen(false); navigate("/app/profile"); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-secondary-50 dark:hover:bg-white/5"
                  >
                    <UserIcon size={16} /> Profile
                  </button>
                  <button
                    onClick={async () => { await logout(); navigate("/login"); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-danger hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
