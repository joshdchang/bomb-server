import { C } from "..";
import { checkAuth } from "../utils";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../schema";

// scores.json route
export async function score(c: C) {
  checkAuth(c);

  const db = drizzle(c.env.DB, { schema });
  const bombs = await db.query.bombs.findMany({
    orderBy: (bombs, { desc, asc }) => [desc(bombs.score), asc(bombs.time)],
  });

  return c.json(bombs);
};

// defusals.json route
export async function defusal(c: C) {
  checkAuth(c);

  const db = drizzle(c.env.DB, { schema });
  const defusals = await db.query.defusals.findMany({
    orderBy: (defusals, { desc }) => desc(defusals.time),
  });

  return c.json(defusals);
}

// explosions.json route
export async function explosion(c: C) {
  checkAuth(c);

  const db = drizzle(c.env.DB, { schema });
  const explosions = await db.query.explosions.findMany({
    orderBy: (explosions, { desc }) => desc(explosions.time),
  });

  return c.json(explosions);
}