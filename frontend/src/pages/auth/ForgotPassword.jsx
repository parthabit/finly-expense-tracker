import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Mail, CheckCircle2 } from "lucide-react";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import api from "../../api/axios";

const schema = z.object({ email: z.string().email("Enter a valid email") });

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", values);
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll email you a link to get back in"
      footer={
        <>
          Remembered it?{" "}
          <Link to="/login" className="text-primary font-medium">Back to login</Link>
        </>
      }
    >
      {sent ? (
        <div className="rounded-2xl bg-accent-50 dark:bg-accent-500/10 p-5 text-center">
          <CheckCircle2 className="mx-auto text-accent mb-2" size={28} />
          <p className="text-sm font-medium">Check your inbox</p>
          <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
            If an account exists for that email, a reset link is on its way.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Email" icon={Mail} placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
          <Button type="submit" className="w-full" isLoading={loading}>
            Send reset link
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
