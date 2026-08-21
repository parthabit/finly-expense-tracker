import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Mail, Lock } from "lucide-react";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      toast.success("Welcome back!");
      navigate(location.state?.from || "/app");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    document.getElementById("email").value = "demo@expensetracker.app";
    document.getElementById("password").value = "Demo@12345";
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to your Finly account"
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary font-medium">Sign up</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="email"
          label="Email"
          icon={Mail}
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <div>
          <Input
            id="password"
            label="Password"
            icon={Lock}
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />
          <div className="flex justify-end mt-1.5">
            <Link to="/forgot-password" className="text-xs text-primary font-medium">Forgot password?</Link>
          </div>
        </div>
        <Button type="submit" className="w-full" isLoading={loading}>
          Log in
        </Button>
        <button
          type="button"
          onClick={fillDemo}
          className="w-full text-xs text-secondary-400 hover:text-primary transition"
        >
          Use demo credentials
        </button>
      </form>
    </AuthLayout>
  );
}
