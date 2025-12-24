import { drizzle } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";
import * as schema from "@shared/schema";

export const pg = new PGlite("./pgdata");
export const db = drizzle(pg, { schema });
