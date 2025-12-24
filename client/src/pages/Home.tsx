import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-products";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Home() {
  const { data: products, isLoading } = useProducts();
  const featuredProducts = products?.slice(0, 3) || [];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="font-display text-6xl md:text-8xl font-bold leading-[1.05] tracking-tight">
              Discover high-quality<br />
              <span className="text-primary italic">preloved</span> clothing
            </h1>
            <p className="text-xl text-muted-foreground max-w-md leading-relaxed font-light">
              that looks and feels brand new. Sustainable fashion, better prices, zero compromise on style.
            </p>
            <div className="pt-6">
              <Link href="/shop" className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-10 py-5 rounded-full font-bold text-lg hover:bg-primary/90 hover:gap-6 transition-all duration-500 shadow-xl shadow-primary/20">
                Explore Collection <ArrowRight className="w-5 h-5" />
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
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative z-10 border-8 border-white/50 backdrop-blur-sm">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80"
                alt="Fashion Model"
                className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000"
              />
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-secondary/50 rounded-full blur-3xl -z-0" />
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-0" />
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

    </Layout>
  );
}
