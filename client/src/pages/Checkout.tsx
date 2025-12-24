import { Navbar } from "@/components/Navbar";
import { useCart } from "@/hooks/use-cart";
import { useCreateOrder } from "@/hooks/use-orders";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertOrderSchema } from "@shared/schema";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Link } from "wouter";

// Only client fields needed for form, total/items handled by hook
const checkoutFormSchema = insertOrderSchema.pick({
  clientName: true,
  clientSurname: true,
  address: true,
  city: true,
  postalCode: true,
  phone: true,
});

type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

export default function Checkout() {
  const { items, total } = useCart();
  const { mutate, isPending } = useCreateOrder();
  
  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
  });

  const onSubmit = (data: CheckoutFormData) => {
    const orderData = {
      ...data,
      totalPrice: total() + 8, // Add delivery fee
      items: items.map(i => ({ productId: i.id, quantity: i.quantity }))
    };
    mutate(orderData);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Link href="/shop" className="text-primary underline">Go shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-display font-bold mb-8">Checkout</h1>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">First Name</label>
              <input 
                {...form.register("clientName")}
                className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:ring-2 focus:ring-primary/10 outline-none"
                placeholder="John"
              />
              {form.formState.errors.clientName && (
                <p className="text-destructive text-xs">{form.formState.errors.clientName.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Last Name</label>
              <input 
                {...form.register("clientSurname")}
                className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:ring-2 focus:ring-primary/10 outline-none"
                placeholder="Doe"
              />
              {form.formState.errors.clientSurname && (
                <p className="text-destructive text-xs">{form.formState.errors.clientSurname.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Address</label>
            <input 
              {...form.register("address")}
              className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:ring-2 focus:ring-primary/10 outline-none"
              placeholder="123 Street Name"
            />
            {form.formState.errors.address && (
              <p className="text-destructive text-xs">{form.formState.errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <input 
                {...form.register("city")}
                className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:ring-2 focus:ring-primary/10 outline-none"
                placeholder="Tunis"
              />
              {form.formState.errors.city && (
                <p className="text-destructive text-xs">{form.formState.errors.city.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Postal Code</label>
              <input 
                {...form.register("postalCode")}
                className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:ring-2 focus:ring-primary/10 outline-none"
                placeholder="1000"
              />
              {form.formState.errors.postalCode && (
                <p className="text-destructive text-xs">{form.formState.errors.postalCode.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <input 
              {...form.register("phone")}
              className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:ring-2 focus:ring-primary/10 outline-none"
              placeholder="+216 00 000 000"
            />
            {form.formState.errors.phone && (
              <p className="text-destructive text-xs">{form.formState.errors.phone.message}</p>
            )}
          </div>

          <div className="pt-6 border-t border-border">
            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Total to Pay</span>
              <span>{(total() + 8).toFixed(2)} TND</span>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isPending ? "Processing..." : "Confirm Order"}
            </button>
            <p className="text-center text-xs text-muted-foreground mt-4">Payment on delivery</p>
          </div>
        </form>
      </main>
    </div>
  );
}
