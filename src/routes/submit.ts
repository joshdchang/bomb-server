import { HTTPException } from "hono/http-exception";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../schema";
import { eq } from "drizzle-orm";
import { C } from "..";
import { clearScoreboardCache } from "../utils";

export async function submit(c: C) {
  const { searchParams } = new URL(c.req.url);
  const netId = searchParams.get("netId");
  const result = searchParams.get("result");
  const secret = searchParams.get("secret");

  if (!netId || !result || !secret) {
    throw new HTTPException(400, { message: "Missing parameters" });
  }

  const db = drizzle(c.env.DB, { schema });

  const pieces = result.split(":");

  if (pieces.length < 4) {
    throw new HTTPException(400, { message: "Invalid result" });
  }
  if (pieces.length > 4) {
    pieces[3] = pieces.slice(3).join(":");
  }

  const [bombIdStr, action, phaseStr, response] = pieces;
  const bombId = parseInt(bombIdStr);
  const phase = parseInt(phaseStr);

  const current = await db.query.bombs.findFirst({
    where: (bombs, { eq }) => eq(bombs.id, bombId),
  });

  if (!current) {
    throw new HTTPException(400, { message: "Invalid bombId" });
  }
  if (current.netId !== netId) {
    throw new HTTPException(400, { message: "Invalid netId" });
  }
  if (current.secret !== secret) {
    throw new HTTPException(400, { message: "Invalid secret" });
  }

  if (action === "defused") {
    if (!response) {
      throw new HTTPException(400, { message: "Missing response" });
    }

    console.log(current.phase, phase);
    if (phase !== current.phase + 1 || phase > 10) {
      throw new HTTPException(400, { message: "Invalid phase" });
    }

    await db
      .update(schema.bombs)
      .set({
        phase,
        time: new Date(),
        score: phase * 10 + current.explosions * -0.5,
      })
      .where(eq(schema.bombs.id, bombId));

    await db.insert(schema.defusals).values({
      bombId,
      response,
      phase,
    });

    await clearScoreboardCache(c);

    return c.text("OK");
  } else if (action === "exploded") {
    await db
      .update(schema.bombs)
      .set({
        explosions: current.explosions + 1,
        score: current.phase * 10 + (current.explosions + 1) * -0.5,
        time: new Date(),
      })
      .where(eq(schema.bombs.id, bombId));

    await db.insert(schema.explosions).values({
      bombId,
      phase,
      response,
    });

    await clearScoreboardCache(c);

    return c.text("OK");
  } else {
    throw new HTTPException(400, { message: "Invalid action" });
  }
}
