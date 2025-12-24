import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-products";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Home() {
  const { data: products, isLoading } = useProducts();
  const featuredProducts = products?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.1] text-balance">
              Vintage Vibes.<br />
              <span className="text-muted-foreground">Modern Style.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Curated fashion that speaks to your soul. Timeless pieces for the contemporary wardrobe.
            </p>
            <div className="pt-4">
              <Link href="/shop" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary/90 hover:gap-4 transition-all duration-300 vintage-shadow">
                Shop Collection <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Hero Image - Vintage Fashion */}
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden vintage-shadow relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80" 
                alt="Fashion Model" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-primary/10 rounded-[2rem] -z-0" />
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="px-4 py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-display font-bold">Featured Drops</h2>
              <p className="text-muted-foreground mt-2">Hand-picked selections just for you</p>
            </div>
            <Link href="/shop" className="hidden md:flex items-center gap-2 font-medium hover:underline decoration-primary">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center md:hidden">
            <Link href="/shop" className="inline-flex items-center gap-2 font-medium hover:underline">
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-display font-bold text-2xl">Frippy Froppy.</h3>
            <p className="text-primary-foreground/60 text-sm mt-2">© 2024 All rights reserved.</p>
          </div>
          <div className="flex gap-6 text-sm text-primary-foreground/80">
            <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
            <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
