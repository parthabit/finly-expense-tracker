import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Users, Receipt, IndianRupee, ShieldCheck, ShieldOff, Trash2 } from "lucide-react";
import api from "../api/axios";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { formatCurrency } from "../utils/formatCurrency";

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [overview, usersRes] = await Promise.all([api.get("/admin/overview"), api.get("/admin/users")]);
      setStats(overview.data.stats);
      setCategories(overview.data.mostUsedCategories);
      setUsers(usersRes.data.users);
    } catch {
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const toggleSuspend = async (user) => {
    try {
      await api.patch(`/admin/users/${user._id}/suspend`);
      toast.success(user.isSuspended ? "User unsuspended" : "User suspended");
      fetchData();
    } catch {
      toast.error("Failed to update user");
    }
  };

  const deleteUser = async () => {
    try {
      await api.delete(`/admin/users/${deleteTarget._id}`);
      toast.success("User deleted");
      setDeleteTarget(null);
      fetchData();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  if (loading) {
    return <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-xl">Admin Dashboard</h2>
        <p className="text-sm text-secondary-400">System-wide overview and user management</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 text-primary flex items-center justify-center"><Users size={18} /></div>
            <div><p className="text-xs text-secondary-400">Total Users</p><p className="font-display font-bold text-xl">{stats.totalUsers}</p></div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-accent-50 dark:bg-accent-500/10 text-accent flex items-center justify-center"><Receipt size={18} /></div>
            <div><p className="text-xs text-secondary-400">Total Transactions</p><p className="font-display font-bold text-xl">{stats.totalTransactions}</p></div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-secondary-100 dark:bg-white/10 text-secondary-700 dark:text-white flex items-center justify-center"><IndianRupee size={18} /></div>
            <div><p className="text-xs text-secondary-400">Revenue (Demo)</p><p className="font-display font-bold text-xl">{formatCurrency(stats.revenue)}</p></div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="font-display font-semibold mb-4">Most Used Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <span key={c.category} className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-500/10 text-primary">
              {c.category} · {c.count}
            </span>
          ))}
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <h3 className="font-display font-semibold px-5 pt-5 mb-2">Manage Users</h3>
        {users.length === 0 ? (
          <EmptyState icon={Users} title="No users found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-secondary-400 border-b border-secondary-100 dark:border-white/5">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-secondary-50 dark:border-white/5">
                    <td className="px-5 py-3">{u.name}</td>
                    <td className="px-5 py-3 text-secondary-500">{u.email}</td>
                    <td className="px-5 py-3 capitalize">{u.role}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.isSuspended ? "bg-red-50 dark:bg-red-500/10 text-danger" : "bg-accent-50 dark:bg-accent-500/10 text-accent"}`}>
                        {u.isSuspended ? "Suspended" : "Active"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => toggleSuspend(u)} className="p-1.5 rounded-lg text-secondary-400 hover:bg-secondary-100 dark:hover:bg-white/10 transition" title={u.isSuspended ? "Unsuspend" : "Suspend"}>
                          {u.isSuspended ? <ShieldCheck size={15} /> : <ShieldOff size={15} />}
                        </button>
                        <button onClick={() => setDeleteTarget(u)} className="p-1.5 rounded-lg text-secondary-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-danger transition">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={deleteUser}
        title="Delete this user?"
        description="This permanently removes the user and all of their transactions."
        confirmLabel="Delete"
      />
    </div>
  );
}
