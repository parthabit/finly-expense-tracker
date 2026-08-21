import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface dark:bg-secondary-950">
        <div className="h-10 w-10 rounded-full border-4 border-primary-100 border-t-primary animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/app" replace />;

  return <Outlet />;
}
