import { text, integer, sqliteTable, real } from "drizzle-orm/sqlite-core";

export const bombs = sqliteTable("bombs", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  netId: text("netId").notNull(),
  time: integer("time", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  phase: integer("defused", { mode: "number" }).default(0).notNull(),
  explosions: integer("explosions", { mode: "number" }).default(0).notNull(),
  score: real("score").default(0).notNull(),
});

export type Bomb = typeof bombs.$inferSelect;
export type InsertBomb = typeof bombs.$inferInsert;

export const defuses = sqliteTable("defuses", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  bombId: integer("bombId", { mode: "number" }).notNull(),
  time: integer("time", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  phase: integer("phase", { mode: "number" }).notNull(),
  response: text("response").notNull(),
});

export type Defuse = typeof defuses.$inferSelect;
export type InsertDefuse = typeof defuses.$inferInsert;

export const explosions = sqliteTable("explosions", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  bombId: integer("bombId", { mode: "number" }).notNull(),
  time: integer("time", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  phase: integer("phase", { mode: "number" }).notNull(),
  response: text("response").notNull(),
});

export type Explosion = typeof explosions.$inferSelect;
export type InsertExplosion = typeof explosions.$inferInsert;
