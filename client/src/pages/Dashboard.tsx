import { Navbar } from "@/components/Navbar";
import { useProducts, useCreateProduct, useDeleteProduct } from "@/hooks/use-products";
import { useOrders } from "@/hooks/use-orders";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema } from "@shared/schema";
import type { InsertProduct } from "@shared/schema";
import { useState } from "react";
import { Loader2, Trash2, Plus, Package, ShoppingBag, DollarSign } from "lucide-react";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";

// Ensure numbers are coerced
const formSchema = insertProductSchema.extend({
  price: z.coerce.number().min(0.1, "Price required"),
});

export default function Dashboard() {
  const [, setLocation] = useLocation();
  
  // Auth Check
  if (!localStorage.getItem("admin_token")) {
    setLocation("/admin");
    return null;
  }

  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();

  const form = useForm<InsertProduct>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      image: "",
    }
  });

  const onSubmit = (data: InsertProduct) => {
    createProduct.mutate(data, {
      onSuccess: () => form.reset()
    });
  };

  const revenue = orders?.reduce((acc, order) => acc + order.totalPrice, 0) || 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold">Dashboard</h1>
          <button 
            onClick={() => {
              localStorage.removeItem("admin_token");
              setLocation("/");
            }}
            className="text-sm font-medium text-destructive hover:underline"
          >
            Sign Out
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{revenue.toFixed(2)} TND</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <ShoppingBag className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{orders?.length || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <Package className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Products</p>
                <p className="text-2xl font-bold">{products?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="products" className="space-y-8">
          <TabsList className="bg-secondary/50 p-1 rounded-xl">
            <TabsTrigger value="products" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Products</TabsTrigger>
            <TabsTrigger value="orders" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-8">
            {/* Add Product Form */}
            <div className="bg-card p-6 rounded-2xl border border-border">
              <h2 className="text-xl font-bold mb-4">Add New Product</h2>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <input 
                    {...form.register("name")}
                    placeholder="Product Name"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      {...form.register("price")}
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                    />
                    <input 
                      {...form.register("image")}
                      placeholder="Image URL"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <textarea 
                    {...form.register("description")}
                    placeholder="Description"
                    className="w-full h-[88px] px-4 py-2 rounded-lg border border-border bg-background resize-none"
                  />
                  <button 
                    type="submit" 
                    disabled={createProduct.isPending}
                    className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 flex items-center justify-center gap-2"
                  >
                    {createProduct.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Add Product
                  </button>
                </div>
              </form>
            </div>

            {/* Products List */}
            {productsLoading ? (
              <Loader2 className="w-8 h-8 animate-spin mx-auto" />
            ) : (
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-secondary/30 text-left text-sm font-medium text-muted-foreground">
                    <tr>
                      <th className="p-4">Image</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products?.map((product) => (
                      <tr key={product.id} className="border-t border-border/50 hover:bg-secondary/10">
                        <td className="p-4">
                          <img src={product.image} alt="" className="w-10 h-10 rounded-md object-cover bg-secondary" />
                        </td>
                        <td className="p-4 font-medium">{product.name}</td>
                        <td className="p-4">{product.price.toFixed(2)} TND</td>
                        <td className="p-4">
                          <button 
                            onClick={() => deleteProduct.mutate(product.id)}
                            disabled={deleteProduct.isPending}
                            className="text-destructive hover:bg-destructive/10 p-2 rounded-md transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders">
            {ordersLoading ? (
              <Loader2 className="w-8 h-8 animate-spin mx-auto" />
            ) : (
              <div className="space-y-4">
                {orders?.map((order) => (
                  <div key={order.id} className="bg-card p-6 rounded-2xl border border-border">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg">Order #{order.id}</h3>
                        <p className="text-muted-foreground text-sm">
                          {new Date(order.createdAt!).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 text-sm">
                      <div>
                        <p className="font-semibold mb-2">Customer Details</p>
                        <p>{order.clientName} {order.clientSurname}</p>
                        <p>{order.phone}</p>
                        <p className="text-muted-foreground mt-1">
                          {order.address}, {order.postalCode} {order.city}
                        </p>
                      </div>
                      
                      <div>
                        <p className="font-semibold mb-2">Order Items</p>
                        <ul className="space-y-1 text-muted-foreground">
                          {order.items?.map((item: any, i: number) => (
                            <li key={i} className="flex justify-between">
                              <span>Product #{item.productId} (x{item.quantity})</span>
                              <span>{item.priceAtPurchase.toFixed(2)} TND</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 pt-2 border-t border-border flex justify-between font-bold">
                          <span>Total</span>
                          <span>{order.totalPrice.toFixed(2)} TND</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
