import { Layout } from "@/components/Layout";
import { useCart } from "@/hooks/use-cart";
import { useCreateOrder } from "@/hooks/use-orders";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertOrderSchema } from "@shared/schema";
import { z } from "zod";
import { Loader2, ArrowLeft } from "lucide-react";
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
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-32 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-6">Your cart is empty</h1>
          <Link href="/shop" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform">
            Go Shopping <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-display font-bold mb-8">Checkout</h1>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/70 ml-2">First Name</label>
              <input
                {...form.register("clientName")}
                className="w-full px-6 py-4 rounded-2xl border-none glass-card focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium"
                placeholder="John"
              />
              {form.formState.errors?.clientName && (
                <p className="text-destructive text-xs ml-2">{form.formState.errors.clientName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/70 ml-2">Last Name</label>
              <input
                {...form.register("clientSurname")}
                className="w-full px-6 py-4 rounded-2xl border-none glass-card focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium"
                placeholder="Doe"
              />
              {form.formState.errors?.clientSurname && (
                <p className="text-destructive text-xs ml-2">{form.formState.errors.clientSurname.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground/70 ml-2">Shipping Address</label>
            <input
              {...form.register("address")}
              className="w-full px-6 py-4 rounded-2xl border-none glass-card focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium"
              placeholder="123 Street Name"
            />
            {form.formState.errors?.address && (
              <p className="text-destructive text-xs ml-2">{form.formState.errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/70 ml-2">City</label>
              <input
                {...form.register("city")}
                className="w-full px-6 py-4 rounded-2xl border-none glass-card focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium"
                placeholder="Tunis"
              />
              {form.formState.errors?.city && (
                <p className="text-destructive text-xs ml-2">{form.formState.errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/70 ml-2">Postal Code</label>
              <input
                {...form.register("postalCode")}
                className="w-full px-6 py-4 rounded-2xl border-none glass-card focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium"
                placeholder="1000"
              />
              {form.formState.errors?.postalCode && (
                <p className="text-destructive text-xs ml-2">{form.formState.errors.postalCode.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground/70 ml-2">Phone Number</label>
            <input
              {...form.register("phone")}
              className="w-full px-6 py-4 rounded-2xl border-none glass-card focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium"
              placeholder="+216 22 333 444"
            />
            {form.formState.errors?.phone && (
              <p className="text-destructive text-xs ml-2">{form.formState.errors.phone.message}</p>
            )}
          </div>

          <div className="pt-6 border-t border-border/50">
            <div className="flex justify-between font-bold text-2xl mb-8">
              <span className="text-foreground/60">Total to Pay</span>
              <span className="text-primary">{(total() + 8).toFixed(2)} TND</span>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary text-primary-foreground py-5 rounded-[2rem] font-bold text-lg hover:brightness-110 shadow-xl shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3"
            >
              {isPending && <Loader2 className="w-5 h-5 animate-spin" />}
              {isPending ? "Processing..." : "Confirm Order"}
            </button>
            <p className="text-center text-xs text-muted-foreground mt-6 font-medium">Payment on delivery</p>
          </div>
        </form>
      </div>
    </Layout>
  );
}
