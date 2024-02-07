import { checkAuth } from "../utils";
import { C } from "..";
import { HTTPException } from "hono/http-exception";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../schema";
import { and, eq } from "drizzle-orm";

// deletes a bomb
export async function deleteBomb(c: C) {
  checkAuth(c);

  const { searchParams } = new URL(c.req.url);
  const netId = searchParams.get("netId");
  const bombId = searchParams.get("bombId");
  if (!netId || !bombId) {
    throw new HTTPException(400, { message: "Missing parameters" });
  }

  const db = drizzle(c.env.DB, { schema });
  const res = await db
    .delete(schema.bombs)
    .where(
      and(eq(schema.bombs.id, parseInt(bombId)), eq(schema.bombs.netId, netId))
    )
    .returning({ id: schema.bombs.id })
    .get();

  if (!res) {
    throw new HTTPException(400, { message: "Invalid bombId or netId" });
  }

  return c.text(res.id.toString());
}
