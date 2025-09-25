# Optimus (Angular + SSR)

Optimus is an Angular 20 application with Server-Side Rendering (SSR) powered by @angular/ssr and an Express server. It
is designed to work with a separate backend service for authentication and real-time features (Socket.IO).

Backend project (pair this frontend with):
https://github.com/vitaminncpp/bun-project

- Start the backend by following its README.
- Configure this frontend to point to the backend API and Socket.IO URLs (see Configuration section below).

## Features

- Angular 20 application with SSR (server rendering via Express)
- Authentication (register/login) wired through a REST API
- Socket.IO client integration
- TailwindCSS + custom theme, Angular Material and PrimeNG UI
- Production-ready Express middlewares: helmet, compression, morgan
- Linting (ESLint) and formatting (Prettier)

## Prerequisites

- Node.js 20+
- npm 10+

## Quick Start

1) Install dependencies

- `npm install`

2) Configure environment (API and Socket URLs)

- Edit src\app\environments.ts and set these values to match your backend:
    - `SERVER_URL`: e.g., https://localhost:5000
    - `SERVER_DOMAIN`: e.g., localhost
    - `SERVER_PORT`: e.g., 5000
    - `SERVER_SOCKETIO_URL`: e.g., wss://localhost:5000
    - `API_BASE_URL`: e.g., https://localhost:5000/api

3) Start the dev server (with SSL by default)

- `npm run start`
- The app will be served with SSL. See the SSL notes below if you need to change the certificate or disable SSL.

Typical local setup:

- Backend: https://localhost:5000
- Frontend dev: https://localhost:4200

## Scripts

- `npm run start`
    - Starts the Angular dev server with SSL (uses configuration from angular.json). Useful for development, HMR, etc.
- `npm run build`
    - Builds the application in server output mode (browser + server bundles for SSR) into dist/optimus.
- `npm run serve:ssr:optimus`
    - Runs the compiled Express server (SSR) from dist/optimus/server/server.mjs.
- `npm run watch`
    - Builds in watch mode using the development configuration.
- `npm run test`
    - Runs unit tests (Karma/Jasmine).
- `npm run lint`
    - Lints .ts and .html files using ESLint.
- `npm run lint:fix`
    - Lints and auto-fixes issues.
- `npm run format`
    - Formats src/**/*.{ts,html,scss,css,md} with Prettier.

## Development

- Start dev server: `npm run start`
- By default, SSL is enabled. Angular.json points to:
    - sslKey: `D:\ssl certificates\server-ec.key`
    - sslCert: `D:\ssl certificates\server-ec.crt`
- Adjust these paths in `angular.json` -> `projects.optimus.architect.serve.options` if your environment differs.
- Alternatively, you can remove the sslKey/sslCert options and run ng serve with `--ssl` to use Angular CLI’s dev
  certificate, or run without SSL if not required.

## Building and Running with SSR (Production-like)

1) Build the application

- `npm run build`

2) Run the SSR server

- `npm run serve:ssr:optimus`
- The Express server (`src/server.ts`) will serve static assets from the browser build and render routes via Angular SSR.
  By default, it listens on PORT=4000 (configurable via env var PORT).

Note: The server enables security and performance middlewares (helmet, compression, morgan). In development mode (
`NODE_ENV !== production`), CSP is relaxed to aid HMR.

## Configuration

All API and Socket endpoints used by the app are derived from `src\app\environments.ts` and the path constants in
`src\app\config\api.config.ts`.

- API base URL
    - `src\app\environments.ts`: `API_BASE_URL` (e.g., https://localhost:5000/api)
    - Requests are built in ApiService by combining `API_BASE_URL` and paths from `api.config.ts`.

- Socket.IO URL
    - `src\app\environments.ts`: `SERVER_SOCKETIO_URL` (e.g., wss://localhost:5000)

- Other server settings
    - The Express SSR server reads `PORT` from the environment (default `4000`). Set PORT before starting the server if
      needed.

If you change your backend `host/port/protocol`, update `environments.ts` accordingly. For different environments (
`dev/prod`), you can introduce separate environment files or a runtime configuration mechanism if required.

## Project Structure (high level)
```textmate
- src/
    - app/
        - services/ (ApiService, UserService, SocketService, etc.)
        - config/ (api.config.ts)
        - routes/ (e.g., register component)
        - environments.ts (API/Socket URLs)
    - server.ts (Express SSR entry)
    - main.ts (browser bootstrap)
    - main.server.ts (SSR entrypoint)
- angular.json (Angular build/serve configuration)
- package.json (scripts, dependencies)
```

## Linting and Formatting

- Lint: `npm run lint`
- Auto-fix: `npm run lint:fix`
- Format: `npm run format`

## Testing

- Unit tests: `npm run test`

## Troubleshooting

- SSL certificate issues in dev
    - If ng serve fails due to SSL paths, update `angular.json` serve.options.sslKey and sslCert, or remove them and use
      ng serve `--ssl` with a locally trusted Angular CLI certificate.
- CORS or network errors
    - Ensure the backend is running, reachable, and CORS is configured if the frontend and backend are on different
      origins.
- Auth token missing errors
    - The app expects an access token in localStorage for authenticated endpoints. Log in or register to populate
      tokens.

## License

This project’s license is TBD. If you intend to open source it, consider adding a LICENSE file (e.g., MIT) and updating
this section.
