import type { Product } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((state) => state.addItem);
  const { toast } = useToast();

  const handleAdd = () => {
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.name} is now in your cart.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative rounded-3xl overflow-hidden bg-card border border-border hover:shadow-2xl transition-all duration-500"
    >
      <div className="aspect-[3/4] overflow-hidden bg-secondary/10 relative">
        <img
          src={product.image || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <div className="p-6 flex flex-col gap-3 bg-card">
        <div className="flex justify-between items-start">
          <h3 className="font-display font-bold text-xl tracking-tight text-foreground">{product.name}</h3>
          <span className="font-sans font-bold text-primary bg-primary/10 px-3 py-1 rounded-full text-sm whitespace-nowrap">
            {product.price.toFixed(2)} TND
          </span>
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{product.description}</p>

        <button
          onClick={handleAdd}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
