import { Link, useLocation } from "wouter";
import { ShoppingBag, Menu, X, User } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const items = useCart((state) => state.items);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const [location] = useLocation();

  const isAdmin = location.startsWith("/admin");

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="font-display text-2xl font-bold tracking-tight text-foreground hover-elevate transition-all">
            FRIPPY FROPPY<span className="text-accent-foreground text-3xl leading-none">!</span>
          </Link>
          {/* Version: 1.0.2 */}

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium hover:text-primary/70 transition-colors">Home</Link>
            <Link href="/shop" className="text-sm font-medium hover:text-primary/70 transition-colors">Shop</Link>
            
            {isAdmin ? (
              <Link href="/admin/dashboard" className="text-sm font-medium text-primary">Dashboard</Link>
            ) : (
              <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors">
                <User className="w-5 h-5" />
              </Link>
            )}

            <Link href="/cart" className="relative group p-2">
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 -mr-1 -mt-1 w-5 h-5 bg-primary text-primary-foreground text-xs flex items-center justify-center rounded-full font-bold shadow-md">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden p-2 text-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border"
          >
            <div className="px-4 py-6 space-y-4">
              <Link href="/" onClick={() => setIsOpen(false)} className="block text-lg font-medium">Home</Link>
              <Link href="/shop" onClick={() => setIsOpen(false)} className="block text-lg font-medium">Shop</Link>
              <Link href="/cart" onClick={() => setIsOpen(false)} className="flex items-center text-lg font-medium">
                Cart ({itemCount})
              </Link>
              <Link href="/admin" onClick={() => setIsOpen(false)} className="block text-sm text-muted-foreground">Admin Login</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
