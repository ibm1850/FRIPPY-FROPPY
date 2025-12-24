import { Layout } from "@/components/Layout";
import { useCart } from "@/hooks/use-cart";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Cart() {
  const { items, removeItem, updateQuantity, total } = useCart();

  const subtotal = total();
  const deliveryFee = 8;
  const finalTotal = subtotal > 0 ? subtotal + deliveryFee : 0;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-display font-bold mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-[2rem] border-white/40">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <Link href="/shop" className="inline-flex items-center gap-2 text-primary font-bold hover:scale-105 transition-transform">
              Start Shopping <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-6 p-6 glass-card rounded-3xl border-white/20">
                  <div className="w-24 h-24 bg-secondary/30 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-muted-foreground text-sm">{item.price.toFixed(2)} TND</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3 bg-secondary/50 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-white rounded-md transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-white rounded-md transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="md:col-span-1">
              <div className="bg-card p-6 rounded-2xl border border-border sticky top-24">
                <h2 className="font-display font-semibold text-xl mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{subtotal.toFixed(2)} TND</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery</span>
                    <span>{deliveryFee.toFixed(2)} TND</span>
                  </div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{finalTotal.toFixed(2)} TND</span>
                  </div>
                </div>

                <Link href="/checkout" className="w-full flex justify-center items-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                  Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
