import { db } from "./db";
import {
  products,
  orders,
  orderItems,
  users,
  type Product,
  type InsertProduct,
  type Order,
  type CreateOrder,
  type User,
  type OrderItem
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import fs from "fs";
import path from "path";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: InsertProduct): Promise<Product>;
  deleteProduct(id: number): Promise<void>;

  // Orders
  createOrder(order: CreateOrder): Promise<Order>;
  getOrders(): Promise<(Order & { items: (OrderItem & { product: Product })[] })[]>;

  // Users
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: typeof users.$inferInsert): Promise<User>;
  getUser(id: number): Promise<User | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(desc(products.id));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, product: InsertProduct): Promise<Product> {
    const [updated] = await db
      .update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return updated;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async createOrder(orderData: CreateOrder): Promise<Order> {
    // Calculate total price based on current product prices + delivery fee
    let calculatedTotal = 0;
    const itemsToInsert: { orderId: number; productId: number; quantity: number; priceAtPurchase: number }[] = [];

    // Verify products and calculate total
    for (const item of orderData.items) {
      const product = await this.getProduct(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);

      calculatedTotal += product.price * item.quantity;
      itemsToInsert.push({
        orderId: 0, // Placeholder
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: product.price
      });
    }

    const deliveryFee = 8;
    const finalTotal = calculatedTotal + deliveryFee;

    // Create order
    console.log("Inserting order into database...");
    const [newOrder] = await db.insert(orders).values({
      clientName: orderData.clientName,
      clientSurname: orderData.clientSurname,
      address: orderData.address,
      postalCode: orderData.postalCode,
      city: orderData.city,
      phone: orderData.phone,
      totalPrice: finalTotal,
      status: "pending",
    }).returning();

    console.log("Order created with ID:", newOrder.id);

    // Insert items
    for (const item of itemsToInsert) {
      item.orderId = newOrder.id;
    }

    if (itemsToInsert.length > 0) {
      console.log(`Inserting ${itemsToInsert.length} items for order ${newOrder.id}...`);
      await db.insert(orderItems).values(itemsToInsert);
    }

    // Log to text file
    try {
      const orderLogPath = path.join(process.cwd(), "orders.txt");
      console.log("Logging order to file:", orderLogPath);
      const timestamp = new Date().toISOString();
      const orderSummary = `
=========================================
ORDER DATE: ${timestamp}
ORDER ID: ${newOrder.id}
CLIENT: ${newOrder.clientName} ${newOrder.clientSurname}
PHONE: ${newOrder.phone}
ADDRESS: ${newOrder.address}, ${newOrder.postalCode}, ${newOrder.city}
TOTAL PRICE: ${newOrder.totalPrice} TND
ITEMS:
${orderData.items.map(item => `- Product ID: ${item.productId}, Quantity: ${item.quantity}`).join("\n")}
=========================================
`;
      fs.appendFileSync(orderLogPath, orderSummary);
      console.log("Order successfully written to orders.txt");
    } catch (err) {
      console.error("Failed to log order to file:", err);
    }

    return newOrder;
  }

  async getOrders(): Promise<(Order & { items: (OrderItem & { product: Product })[] })[]> {
    const allOrders = await db.query.orders.findMany({
      orderBy: desc(orders.createdAt),
      with: {
        items: {
          with: {
            product: true
          }
        }
      }
    });
    return allOrders as any;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: typeof users.$inferInsert): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
}

export const storage = new DatabaseStorage();
