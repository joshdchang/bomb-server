import { Context, Hono } from "hono";
import { renderer } from "./renderer";
import { scoreboard } from "./routes/scoreboard";
import { submit } from "./routes/submit";
import { create } from "./routes/create";
import { deleteBomb } from "./routes/delete";
import { reset } from "./routes/reset";
import { defusal, explosion, score } from "./routes/results";

// reusable types that allow environment variables to be strongly typed
type Bindings = {
  DB: D1Database;
  ADMIN_PASSWORD: string;
};
export type C = Context<{ Bindings: Bindings }>;

// create the hono server
const app = new Hono<{ Bindings: Bindings }>();

// register the renderer for html boilerplate and tailwind
app.get("*", renderer);

// register the routes
app.get("/", scoreboard);
app.post("/submit", submit);
app.all("/ping", (c) => c.text("pong"));
app.post("/create", create);
app.delete("/delete", deleteBomb);
app.delete("/reset", reset);
app.get("/scores.json", score);
app.get("/defusals.json", defusal);
app.get("/explosions.json", explosion);

export default app;
