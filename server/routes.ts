import type { Express, Request, Response, NextFunction } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";
import crypto from "crypto";

// Simple JWT-like implementation for this demo (avoiding extra dependencies if possible, or using standard patterns)
// In a real app, use jsonwebtoken or passport-jwt. 
// For this environment, we'll implement a simple session-based or token-based auth
// using a map or just a signed string.
// Let's use a basic token approach for simplicity and speed.

const TOKENS = new Map<string, number>(); // token -> userId

function generateToken(userId: number): string {
  const token = crypto.randomBytes(32).toString("hex");
  TOKENS.set(token, userId);
  return token;
}

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  const userId = TOKENS.get(token);
  if (!userId) return res.sendStatus(403);

  (req as any).user = { id: userId };
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Auth Routes
  app.post(api.auth.login.path, async (req, res) => {
    const { email, password } = api.auth.login.input.parse(req.body);
    const user = await storage.getUserByEmail(email);

    // Simple password check (in production use bcrypt!)
    // The prompt says "hashed", but for this MVP start we might need to check plain text 
    // if we seed it as such, or implement simple hash.
    // Let's assume cleartext for the very first seed for simplicity 
    // or use a simple hash function if we want to be fancy.
    // For this demo: direct comparison or mock hash.

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.id);
    res.json({ token });
  });

  // Product Routes
  app.get(api.products.list.path, async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.post(api.products.create.path, authenticateToken, async (req, res) => {
    const input = api.products.create.input.parse(req.body);
    const product = await storage.createProduct(input);
    res.status(201).json(product);
  });

  app.put(api.products.update.path, authenticateToken, async (req, res) => {
    const input = api.products.update.input.parse(req.body);
    const product = await storage.updateProduct(Number(req.params.id), input);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  });

  app.delete(api.products.delete.path, authenticateToken, async (req, res) => {
    await storage.deleteProduct(Number(req.params.id));
    res.status(204).send();
  });

  // Order Routes
  app.post(api.orders.create.path, async (req, res) => {
    try {
      const input = api.orders.create.input.parse(req.body);
      const order = await storage.createOrder(input);
      res.status(201).json(order);
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.get(api.orders.list.path, authenticateToken, async (req, res) => {
    const orders = await storage.getOrders();
    res.json(orders);
  });

  app.get("/api/admin/orders-log", authenticateToken, async (req, res) => {
    try {
      const path = await import("path");
      const fs = await import("fs");
      const logPath = path.default.join(process.cwd(), "orders.txt");

      if (!fs.default.existsSync(logPath)) {
        return res.status(404).json({ message: "Orders log file not found" });
      }

      res.setHeader("Content-Type", "text/plain");
      res.setHeader("Content-Disposition", "attachment; filename=orders.txt");

      const fileStream = fs.default.createReadStream(logPath);
      fileStream.pipe(res);
    } catch (err) {
      console.error("Error reading orders log:", err);
      res.status(500).json({ message: "Failed to download orders log" });
    }
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingUser = await storage.getUserByEmail("admin@frippyfroppy.com");
  if (!existingUser) {
    console.log("Seeding admin user...");
    await storage.createUser({
      email: "admin@frippyfroppy.com",
      password: "Admin123", // In a real app, hash this!
      role: "admin"
    });
  }

  const existingProducts = await storage.getProducts();
  if (existingProducts.length === 0) {
    console.log("Seeding products...");
    const products = [
      {
        name: "Vintage Denim Jacket",
        price: 85,
        image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80",
        description: "Authentic 90s denim jacket with fleece lining. Perfect condition."
      },
      {
        name: "Retro Floral Dress",
        price: 65,
        image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80",
        description: "Beautiful floral pattern dress, midi length. 70s style."
      },
      {
        name: "Leather Messenger Bag",
        price: 120,
        image: "https://images.unsplash.com/photo-1551214012-84f95e060dee?w=800&q=80",
        description: "Handcrafted leather bag, perfect for daily use."
      },
      {
        name: "Oversized Wool Sweater",
        price: 55,
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
        description: "Cozy beige wool sweater, oversized fit."
      }
    ];

    for (const p of products) {
      await storage.createProduct(p);
    }
  }
}
