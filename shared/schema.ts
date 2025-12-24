import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: real("price").notNull(),
  image: text("image").notNull(),
  description: text("description").notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  clientName: text("client_name").notNull(),
  clientSurname: text("client_surname").notNull(),
  address: text("address").notNull(),
  postalCode: text("postal_code").notNull(),
  city: text("city").notNull(),
  phone: text("phone").notNull(),
  totalPrice: real("total_price").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  // Snapshotting price at time of order is good practice
  priceAtPurchase: real("price_at_purchase").notNull(), 
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("admin"),
});

export const orderRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true, status: true });
// Extended order schema to include items from frontend
export const createOrderSchema = insertOrderSchema.extend({
  items: z.array(z.object({
    productId: z.number(),
    quantity: z.number().min(1)
  }))
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type User = typeof users.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type CreateOrder = z.infer<typeof createOrderSchema>;
