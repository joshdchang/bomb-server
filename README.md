# Yale CPSC 323 Bomb Lab Server

By [Josh Chang](https://github.com/joshdchang)

January 2024

## Description

This is the server for the Bomb Lab project for CPSC 323 at Yale University. It stores bomb defusals and explosions and displays the scores on a public scoreboard. It also has an API for the bomb to report its results and for administrative functions.

## Architecture

This server is written in TypeScript using a web framework called [Hono](https://hono.dev/). It is designed to be run on [Cloudflare Workers](https://workers.cloudflare.com/), a serverless platform that runs code on the edge of Cloudflare's network. This allows the server to be run in a distributed manner, with scaling handled by Cloudflare. The server uses a sqlite database called [Cloudflare D1](https://developers.cloudflare.com/d1/) for storage, and a library called [DrizzleORM](https://orm.drizzle.team/) for interfacing with the database in TypeScript and managing the schema. For graphical pages, such as the scoreboard, the server uses Hono's built-in templating engine, which is a wrapper around JSX. For styling the pages, the server uses [Tailwind CSS](https://tailwindcss.com/).

## Directory Structure

- `src/`: TypeScript source code
  - `index.ts`: main entry point with routing
  - `routes/`: route handlers (see comments in the files for more information)
  - `render.tsx`: common rendering function for graphical pages
  - `schema.ts`: drizzle database schema
  - `styles.css`: global styles (just includes Tailwind)
- `public/`: static files (right now just has the favicon)
- `.env` (not in source control): environment variables for development - see `.env.example` for an example
- `.gitignore`: files to ignore in git
- `drizzle.config.ts`: drizzle configuration
- `package.json`: dependencies and scripts
- `pnpm-lock.yaml`: pnpm lock file (don't edit)
- `postcss.config.js`: postcss configuration (for tailwind, no need to edit)
- `README.md`: this file
- `tailwind.config.js`: Tailwind configuration
- `tsconfig.json`: TypeScript configuration (for TypeScript, no need to edit)
- `vite.config.ts`: vite configuration (vite is the bundler used by hono)

## Local Development

Pre-requisites: [Node.js](https://nodejs.org/en), [pnpm](https://pnpm.io/)

```bash
pnpm install
pnpm dev
curl -X DELETE -H "Authorization: Bearer <ADMIN_PASSWORD>" http://localhost:5173/reset
```

## Deployment

This server is deployed on Cloudflare Workers. The code is written in JavaScript and is run on the V8 engine. The server is deployed using the `wrangler` CLI tool.

## API

Below are the endpoints for the server. For the endpoints that require authentication, the server uses a universal admin password that is set in an environment variable in Cloudflare and can be changed easily (not in the source code). The server uses the `Authorization` header for authentication with the value `Bearer <password>`.

### GET /
this will get the main public scoreboard

### GET /?netId=true
this will get the scoreboard with the NetID column enabled

### GET /scores.json
_(requires auth)_

this will get a machine readable copy of the scores in the JSON format; all administrative functions on the server require a universal admin password which is set in an environment variable in Cloudflare and can be changed easily (not in the source code)

### GET /defusals.json
_(requires auth)_

JSON containing an array of all bomb defuses

### GET /explosions.json
_(requires auth)_

JSON containing an array of all bomb explosions

### (ANY METHOD) /ping

returns "pong"; this is called by the bomb on startup to verify it can connect to the server, otherwise it will quit

### POST /submit?netId=(NETID)&result=(BOMB_RESULT_STRING)&secret=(BOMB_SECRET)

this is the endpoint called by the bomb to report results; it takes in a secret unique string that is compiled with each bomb, which the server verifies that it  the netId by the server, this prevents students who reverse-engineer the server API from spoofing requests as other students 

### POST /create?netId=(NETID)&secret=(BOMB_SECRET)
_(requires auth)_

this is the endpoint called by the new generation script that adds an entry for the bomb with the given NetID and unique secret into the database

### DELETE /delete?netId=(NETID)&bombId=(BOMB_ID)
_(requires auth)_

delete a specific bomb

### DELETE /reset
_(requires auth)_

completely clears the database

