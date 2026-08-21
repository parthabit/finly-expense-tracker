import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { User, Mail, Lock } from "lucide-react";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

const schema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
});

export default function Signup() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      await registerUser(values.name, values.email, values.password);
      toast.success("Account created! Check the Profile page to verify your email.");
      navigate("/app");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start tracking your money in minutes"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium">Log in</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Full name" icon={User} placeholder="Aarav Sharma" error={errors.name?.message} {...register("name")} />
        <Input label="Email" icon={Mail} placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
        <Input label="Password" icon={Lock} type="password" placeholder="At least 8 characters" error={errors.password?.message} {...register("password")} />
        <Button type="submit" className="w-full" isLoading={loading}>
          Create account
        </Button>
        <p className="text-xs text-secondary-400 text-center">
          By signing up, you agree to our Terms and Privacy Policy.
        </p>
      </form>
    </AuthLayout>
  );
}
