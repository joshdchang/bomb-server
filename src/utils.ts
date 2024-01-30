import { HTTPException } from "hono/http-exception";
import { C } from ".";

export function checkAuth(c: C) {
  const authorizationHeader = c.req.header("Authorization");
  if (!authorizationHeader) {
    throw new HTTPException(400, { message: "Missing authorization header" });
  }
  const [authType, password] = authorizationHeader.split(" ");
  if (authType !== "Bearer" || password !== c.env.ADMIN_PASSWORD) {
    throw new HTTPException(400, { message: "Invalid password" });
  }
}

export async function clearCache(c: C) {
  if (!c.env.CACHE_PURGE_TOKEN || !c.env.CACHE_DOMAIN || !c.env.CACHE_ZONE) {
    return;
  }
  try {
    await fetch(
      `https://api.cloudflare.com/client/v4/zones/${c.env.CACHE_ZONE}/purge_cache`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${c.env.CACHE_PURGE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files: [`https://${c.env.CACHE_DOMAIN}/`],
        }),
      }
    );
    console.log("Cleared cache");
  } catch (e) {
    console.log(e);
  }
}
