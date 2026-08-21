import { useState } from "react";
import toast from "react-hot-toast";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const PREF_LABELS = {
  budgetExceeded: "Budget exceeded alerts",
  billDue: "Bill due reminders",
  goalAchieved: "Goal achieved celebrations",
  monthlyReport: "Monthly report ready",
};

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { user, refreshUser } = useAuth();
  const [prefs, setPrefs] = useState(user?.notificationPreferences || {});
  const [saving, setSaving] = useState(false);

  const togglePref = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  const savePrefs = async () => {
    setSaving(true);
    try {
      await api.put("/profile", { notificationPreferences: prefs });
      await refreshUser();
      toast.success("Preferences saved");
    } catch {
      toast.error("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="font-display font-bold text-xl">Settings</h2>
        <p className="text-sm text-secondary-400">Customize how Finly looks and notifies you</p>
      </div>

      <Card>
        <h3 className="font-display font-semibold mb-4">Appearance</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: "light", label: "Light", icon: Sun },
            { key: "dark", label: "Dark", icon: Moon },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTheme(t.key)}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition ${theme === t.key ? "border-primary bg-primary-50 dark:bg-primary-500/10 text-primary" : "border-secondary-200 dark:border-white/10 text-secondary-400"}`}
            >
              <t.icon size={20} />
              <span className="text-xs font-medium">{t.label}</span>
            </button>
          ))}
          <button
            onClick={() => setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")}
            className="flex flex-col items-center gap-2 rounded-xl border border-secondary-200 dark:border-white/10 text-secondary-400 p-4"
          >
            <Monitor size={20} />
            <span className="text-xs font-medium">System</span>
          </button>
        </div>
      </Card>

      <Card>
        <h3 className="font-display font-semibold mb-4">Notification Preferences</h3>
        <div className="space-y-3">
          {Object.entries(PREF_LABELS).map(([key, label]) => (
            <label key={key} className="flex items-center justify-between">
              <span className="text-sm">{label}</span>
              <input type="checkbox" checked={!!prefs[key]} onChange={() => togglePref(key)} className="h-5 w-9 rounded-full accent-primary" />
            </label>
          ))}
        </div>
        <Button className="mt-5" onClick={savePrefs} isLoading={saving}>Save Preferences</Button>
      </Card>
    </div>
  );
}
