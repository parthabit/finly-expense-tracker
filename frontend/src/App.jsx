import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";

import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Analytics from "./pages/Analytics";
import Goals from "./pages/Goals";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{ style: { borderRadius: "12px", fontSize: "14px" } }} />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/app" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="budgets" element={<Budgets />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="goals" element={<Goals />} />
                <Route path="reports" element={<Reports />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute adminOnly />}>
              <Route path="/app/admin" element={<DashboardLayout />}>
                <Route index element={<Admin />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
