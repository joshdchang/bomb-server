import { drizzle } from "drizzle-orm/d1";
import * as schema from "../schema";
import { checkAuth, clearCache } from "../utils";
import { HTTPException } from "hono/http-exception";
import { C } from "..";

export async function create(c: C) {
  checkAuth(c);

  const { searchParams } = new URL(c.req.url);
  const netId = searchParams.get("netId");
  const secret = searchParams.get("secret");
  if (!netId || !secret) {
    throw new HTTPException(400, { message: "Missing netId or secret" });
  }

  const db = drizzle(c.env.DB, { schema });
  const res = await db
    .insert(schema.bombs)
    .values({ netId, secret })
    .returning({ id: schema.bombs.id })
    .get();

  await clearCache(c);

  return c.text(res.id.toString());
}
