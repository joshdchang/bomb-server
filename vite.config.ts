import pages from "@hono/vite-cloudflare-pages";
import devServer from "@hono/vite-dev-server";
import { getEnv } from "@hono/vite-dev-server/cloudflare-pages";
import { defineConfig } from "vite";
import "dotenv/config";

export default defineConfig({
  plugins: [
    pages(),
    devServer({
      entry: "src/index.ts",
      env: getEnv({
        d1Databases: ["DB"],
        d1Persist: true,
        bindings: {
          ADMIN_PASSWORD: process.env.ADMIN_PASSWORD!,
        },
      }),
    }),
  ],
});
