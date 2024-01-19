import "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import style from "./style.css?inline";

declare module "hono" {
  interface ContextRenderer {
    (content: string | Promise<string>, props?: { title?: string }): Response;
  }
}

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
