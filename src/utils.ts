import { HTTPException } from "hono/http-exception";
import { C } from ".";

// checks the Authorization header for the correct admin password
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
