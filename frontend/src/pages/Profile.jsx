import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Camera } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ConfirmDialog from "../components/ui/ConfirmDialog";

export default function Profile() {
  const { user, refreshUser, logout } = useAuth();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const profileForm = useForm({ defaultValues: { name: user?.name, currency: user?.currency || "INR", timezone: user?.timezone || "Asia/Kolkata" } });
  const passwordForm = useForm();

  const onSaveProfile = async (values) => {
    setSavingProfile(true);
    try {
      await api.put("/profile", values);
      await refreshUser();
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const onChangePassword = async (values) => {
    setSavingPassword(true);
    try {
      await api.put("/profile/change-password", values);
      toast.success("Password changed. Please log in again.");
      passwordForm.reset();
      await logout();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  const onAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      await api.post("/profile/avatar", formData, { headers: { "Content-Type": "multipart/form-data" } });
      await refreshUser();
      toast.success("Avatar updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const onDeleteAccount = async () => {
    try {
      await api.delete("/profile");
      toast.success("Account deleted");
      window.location.href = "/";
    } catch {
      toast.error("Failed to delete account");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="font-display font-bold text-xl">Profile</h2>
        <p className="text-sm text-secondary-400">Manage your personal information and security</p>
      </div>

      <Card>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full bg-grad-primary flex items-center justify-center text-white text-xl font-semibold overflow-hidden">
              {user?.avatar ? <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" /> : user?.name?.[0]?.toUpperCase()}
            </div>
            <label className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-white dark:bg-secondary-800 shadow-md flex items-center justify-center cursor-pointer border border-secondary-100 dark:border-white/10">
              <Camera size={13} />
              <input type="file" accept="image/*" className="hidden" onChange={onAvatarChange} disabled={uploadingAvatar} />
            </label>
          </div>
          <div>
            <p className="font-semibold">{user?.name}</p>
            <p className="text-sm text-secondary-400">{user?.email}</p>
            {!user?.isEmailVerified && (
              <span className="inline-block mt-1 text-xs text-warning bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-full">Email not verified</span>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="font-display font-semibold mb-4">Edit Profile</h3>
        <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-4">
          <Input label="Full name" {...profileForm.register("name", { required: true })} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Currency</label>
              <select {...profileForm.register("currency")} className="w-full rounded-xl border border-secondary-200 dark:border-white/10 dark:bg-secondary-900 px-3.5 py-2.5 text-sm outline-none focus:border-primary">
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            <Input label="Timezone" {...profileForm.register("timezone")} />
          </div>
          <Button type="submit" isLoading={savingProfile}>Save Changes</Button>
        </form>
      </Card>

      <Card>
        <h3 className="font-display font-semibold mb-4">Change Password</h3>
        <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
          <Input label="Current password" type="password" {...passwordForm.register("currentPassword", { required: true })} />
          <Input label="New password" type="password" {...passwordForm.register("newPassword", { required: true, minLength: 8 })} />
          <Button type="submit" isLoading={savingPassword}>Change Password</Button>
        </form>
      </Card>

      <Card className="border-red-100 dark:border-red-500/20">
        <h3 className="font-display font-semibold text-danger mb-2">Danger Zone</h3>
        <p className="text-sm text-secondary-400 mb-4">Permanently delete your account and all associated data. This cannot be undone.</p>
        <Button variant="danger" onClick={() => setDeleteOpen(true)}>Delete Account</Button>
      </Card>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={onDeleteAccount}
        title="Delete your account?"
        description="This permanently deletes your account, transactions, budgets, and goals. There is no way to undo this."
        confirmLabel="Delete forever"
      />
    </div>
  );
}
