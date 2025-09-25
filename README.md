## Backend

This frontend pairs with the backend service here:
https://github.com/vitaminncpp/bun-project

- Start the backend following its README.
- Configure the frontend to point to the backend API:
    - Option 1: Use an environment variable at runtime (e.g., API base URL via SSR/server config or environment file).
    - Option 2: Set a build-time environment file (Angular environments) with your API base URL.

Typical local setup:

- Backend runs on https://localhost:5000
- Frontend dev server runs on https://localhost:4200

## Getting Started

Prerequisites:

- Node.js 20+
- npm 10+

### Install:

`bash npm install`

### Start dev server:

`bash npm run start`

### Build production:

`bash npm run build`

### Preview/serve dist (SSR or static, depending on your setup):

`bash npm run serve`

### Lint:

`bash npm run lint`

### Format:

`bash npm run format`
