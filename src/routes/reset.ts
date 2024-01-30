import { sql } from "drizzle-orm";
import { C } from "..";
import { checkAuth, clearScoreboardCache } from "../utils";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../schema";

// resets the database by dropping all tables and recreating them (also functions as a way to create the tables if they don't exist yet)
export async function reset(c: C) {
  checkAuth(c);

  const db = drizzle(c.env.DB, { schema });

  await db.run(sql`DROP TABLE IF EXISTS bombs;`);
  await db.run(sql`DROP TABLE IF EXISTS defusals;`);
  await db.run(sql`DROP TABLE IF EXISTS explosions;`);

  await db.run(sql`
    CREATE TABLE bombs (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      netId TEXT NOT NULL,
      time INTEGER NOT NULL,
      defused INTEGER DEFAULT 0 NOT NULL,
      explosions INTEGER DEFAULT 0 NOT NULL,
      score REAL DEFAULT 0 NOT NULL,
      secret TEXT NOT NULL
    );
  `);
  await db.run(sql`
    CREATE TABLE defusals (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      bombId INTEGER NOT NULL,
      time INTEGER NOT NULL,
      phase INTEGER NOT NULL,
      response TEXT NOT NULL
    );
  `);
  await db.run(sql`
    CREATE TABLE explosions (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      bombId INTEGER NOT NULL,
      time INTEGER NOT NULL,
      phase INTEGER NOT NULL,
      response TEXT NOT NULL
    );
  `);

  await clearScoreboardCache(c);

  return c.text("OK");
}
