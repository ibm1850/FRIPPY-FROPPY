CREATE TABLE "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"price_at_purchase" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_name" text NOT NULL,
	"client_surname" text NOT NULL,
	"address" text NOT NULL,
	"postal_code" text NOT NULL,
	"city" text NOT NULL,
	"phone" text NOT NULL,
	"total_price" real NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"price" real NOT NULL,
	"image" text NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'admin' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
