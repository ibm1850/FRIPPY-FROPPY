import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-products";
import { Loader2, Search } from "lucide-react";
import { useState } from "react";

export default function Shop() {
  const { data: products, isLoading } = useProducts();
  const [search, setSearch] = useState("");

  const filteredProducts = products?.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-display font-bold">Shop Collection</h1>
            <p className="text-muted-foreground mt-2">Discover our latest arrivals</p>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
            <input
              type="text"
              placeholder="Search vintage pieces..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-2xl border-none glass-card focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50 font-medium"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 text-muted-foreground">
            <p className="text-lg">No products found.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
