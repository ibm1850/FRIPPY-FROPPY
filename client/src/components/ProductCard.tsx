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
      className="group relative bg-card rounded-2xl overflow-hidden vintage-shadow-hover border border-border transition-all duration-300"
    >
      <div className="aspect-[3/4] overflow-hidden bg-secondary/30 relative">
        <img
          src={product.image || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>
      
      <div className="p-5 flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <h3 className="font-display font-semibold text-lg leading-tight">{product.name}</h3>
          <span className="font-mono font-medium text-primary text-sm whitespace-nowrap bg-secondary px-2 py-1 rounded-md">
            {product.price.toFixed(2)} TND
          </span>
        </div>
        
        <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
        
        <button
          onClick={handleAdd}
          className="mt-2 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-medium text-sm hover:bg-primary/90 active:scale-[0.98] transition-all"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
