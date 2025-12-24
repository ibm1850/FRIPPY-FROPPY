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
    <nav className="sticky top-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group transition-all duration-300">
            <span className="font-display text-3xl font-bold tracking-tighter text-foreground group-hover:scale-105 transition-transform">
              Frippy<span className="text-primary italic">Froppy</span><span className="text-primary text-4xl leading-none">.</span>
            </span>
          </Link>
          {/* Version: 1.0.5 */}

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10">
            <Link href="/" className={`text-sm font-semibold tracking-wide transition-colors ${location === '/' ? 'text-primary' : 'text-foreground/60 hover:text-primary'}`}>
              Home
            </Link>
            <Link href="/shop" className={`text-sm font-semibold tracking-wide transition-colors ${location === '/shop' ? 'text-primary' : 'text-foreground/60 hover:text-primary'}`}>
              Shop
            </Link>

            {isAdmin ? (
              <Link href="/admin/dashboard" className="text-sm font-bold text-primary px-4 py-2 bg-primary/10 rounded-full">Dashboard</Link>
            ) : (
              <Link href="/admin" className="text-foreground/40 hover:text-primary transition-all duration-300 hover:scale-110">
                <User className="w-5 h-5" />
              </Link>
            )}

            <Link href="/cart" className="relative group p-2 bg-secondary/30 rounded-full hover:bg-secondary/50 transition-all">
              <ShoppingBag className="w-5 h-5 text-secondary-foreground group-hover:scale-110 transition-transform" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] flex items-center justify-center rounded-full font-bold shadow-lg border-2 border-background">
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
