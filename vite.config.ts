import pages from "@hono/vite-cloudflare-pages";
import devServer from "@hono/vite-dev-server";
import { getEnv } from "@hono/vite-dev-server/cloudflare-pages";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    pages(),
    devServer({
      entry: "src/index.tsx",
      env: getEnv({
        d1Databases: ["DB"],
        d1Persist: true,
      }),
    }),
  ],
});
