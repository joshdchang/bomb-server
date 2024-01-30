import "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import style from "./style.css?inline";

// some typing stuff
declare module "hono" {
  interface ContextRenderer {
    (content: string | Promise<string>, props?: { title?: string }): Response;
  }
}

// boilerplate html renderer for jsx pages with tailwind
export const renderer = jsxRenderer(
  ({ children, title }) => {
    return (
      <html lang="en">
        <head>
          <style dangerouslySetInnerHTML={{ __html: style }} />
          <title>{title}</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="The scoreboard for the Yale CPSC 323 Bomb Lab problem set." />
          <link rel="icon" href="/static/favicon.svg" type="image/svg+xml" />
        </head>
        <body lang="en" class="bg-slate-800 font-mono">
          {children}
        </body>
      </html>
    );
  },
  {
    docType: true,
  }
);
