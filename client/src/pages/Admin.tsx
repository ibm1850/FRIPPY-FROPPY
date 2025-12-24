import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect } from "wouter";
import { api } from "@shared/routes";

const loginSchema = api.auth.login.input;
type LoginData = z.infer<typeof loginSchema>;

export default function Admin() {
  const { mutate, isPending } = useLogin();
  
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginData) => {
    mutate(data);
  };

  // If already logged in, redirect
  if (localStorage.getItem("admin_token")) {
    return <Redirect to="/admin/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card p-8 rounded-2xl border border-border shadow-xl">
        <h1 className="text-3xl font-display font-bold text-center mb-2">Admin Panel</h1>
        <p className="text-center text-muted-foreground mb-8">Sign in to manage your store</p>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input 
              {...form.register("email")}
              type="email"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/10 outline-none"
              placeholder="admin@example.com"
            />
            {form.formState.errors.email && (
              <p className="text-destructive text-xs">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input 
              {...form.register("password")}
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/10 outline-none"
            />
            {form.formState.errors.password && (
              <p className="text-destructive text-xs">{form.formState.errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 flex justify-center gap-2"
          >
            {isPending && <Loader2 className="w-5 h-5 animate-spin" />}
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
