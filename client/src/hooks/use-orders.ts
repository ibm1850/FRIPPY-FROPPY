import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import type { CreateOrder } from "@shared/schema";
import { useCart } from "./use-cart";
import { useLocation } from "wouter";

export function useOrders() {
  return useQuery({
    queryKey: [api.orders.list.path],
    queryFn: async () => {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(api.orders.list.path, {
        headers: { "Authorization": token ? `Bearer ${token}` : "" },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      return api.orders.list.responses[200].parse(await res.json());
    },
    enabled: !!localStorage.getItem('admin_token'),
  });
}

export function useCreateOrder() {
  const { toast } = useToast();
  const { clearCart } = useCart();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (data: CreateOrder) => {
      const res = await fetch(api.orders.create.path, {
        method: api.orders.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create order");
      }
      return api.orders.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      clearCart();
      toast({ title: "Order placed successfully!" });
      setLocation("/");
    },
    onError: (err) => {
      toast({ 
        title: "Order failed", 
        description: err.message, 
        variant: "destructive" 
      });
    },
  });
}
