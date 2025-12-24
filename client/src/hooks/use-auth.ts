import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { z } from "zod";

type LoginData = z.infer<typeof api.auth.login.input>;

export function useLogin() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Invalid credentials");
      return api.auth.login.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      localStorage.setItem('admin_token', data.token);
      toast({ title: "Welcome back, Admin" });
      setLocation("/admin/dashboard");
    },
    onError: () => {
      toast({ title: "Login failed", variant: "destructive" });
    },
  });
}
