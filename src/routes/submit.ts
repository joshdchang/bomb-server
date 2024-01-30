import { HTTPException } from "hono/http-exception";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../schema";
import { eq } from "drizzle-orm";
import { C } from "..";
import { clearScoreboardCache } from "../utils";

// This is the submit route. It is used to submit the results of a defusal or explosion. Called by the bomb executables.
export async function submit(c: C) {
  const { searchParams } = new URL(c.req.url);
  const netId = searchParams.get("netId");
  const result = searchParams.get("result");
  const secret = searchParams.get("secret");

  // validate the parameters
  if (!netId || !result || !secret) {
    throw new HTTPException(400, { message: "Missing parameters" });
  }

  // the format of the result is "bombId:action:phase:response"
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
  
  // get the bomb from the database
  const db = drizzle(c.env.DB, { schema });
  const current = await db.query.bombs.findFirst({
    where: (bombs, { eq }) => eq(bombs.id, bombId),
  });

  // validate the bomb
  if (!current) {
    throw new HTTPException(400, { message: "Invalid bombId" });
  }
  if (current.netId !== netId) {
    throw new HTTPException(400, { message: "Invalid netId" });
  }
  if (current.secret !== secret) {
    throw new HTTPException(400, { message: "Invalid secret" });
  }

  // bomb claims to be defused at phase
  if (action === "defused") {

    // validate the phase and response
    if (!response) {
      throw new HTTPException(400, { message: "Missing response" });
    }
    if (phase !== current.phase + 1 || phase > 10) {
      throw new HTTPException(400, { message: "Invalid phase" });
    }

    // update the bomb and insert the defusal log
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
  } 
  // bomb claims to have exploded
  else if (action === "exploded") {

    // update the bomb and insert the explosion log
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
