# AGENTS.md

## 1. Purpose

This document defines how to safely modify and extend the `optimus` codebase.

It is optimized for:

- AI agents
- Automated refactoring tools
- Contributors unfamiliar with the project

Primary goal:
Preserve architecture, avoid regressions, and ensure SSR-safe, maintainable changes.

## 2. System Overview

- Framework: Angular 21 (standalone-only)
- Rendering: SSR (Angular SSR + Express)
- Backend: External (auth, REST, chat, sockets)
- State: Signals + RxJS (hybrid)
- Realtime: Socket.IO (centralized)

## 3. Core Architectural Constraints (Do Not Violate)

### 3.1 Standalone Architecture

- All components are standalone.
- Do NOT introduce `NgModules`.

### 3.2 SSR Safety (Critical)

Any usage of:

- `window`
- `document`
- `localStorage`
- sockets
- browser-only APIs

MUST be guarded with:

```ts
isPlatformBrowser(...)
```

Violating this will break SSR.

### 3.3 Centralized Abstractions

| Concern | Must Use |
| --- | --- |
| HTTP | `ApiService` |
| Auth/session | `UserService` |
| Sockets | `SocketService` |

Never bypass these layers.

### 3.4 State Management

Use:

- Signals -> UI/local/shared state
- RxJS -> async flows (HTTP, sockets)

Do NOT introduce:

- NgRx / Redux (unless explicitly required)

### 3.5 Backend Contract Integrity

- API paths -> `api.config.ts`
- Payload format -> preserve backend structure (`snake_case` where used)
- Do not reshape contracts arbitrarily

## 4. Project Structure

```text
src/
  main.ts
  main.server.ts
  server.ts

  app/
    app.config.ts        # global providers, sockets, hydration
    app.routes.ts        # routing
    routes/              # route-level components
    components/          # shared UI
    features/chat/       # chat domain
    services/            # global services
    socket/              # socket layer
    crypto/              # key bootstrap
    models/              # shared models
    config/              # API config
```

## 5. Coding Standards

### 5.1 TypeScript

- Strict typing required
- Avoid `any` -> use `unknown` if needed
- Prefer inference when obvious

### 5.2 Angular

Required:

- `ChangeDetectionStrategy.OnPush`
- `input()` / `output()`
- signals + `computed()`

Avoid:

- `ngClass` -> use class bindings
- `ngStyle` -> use style bindings
- decorators like `@HostBinding`

### 5.3 Templates

Use:

- `@if`
- `@for`
- `@switch`
- Keep logic out of templates
- Use `async` pipe for observables

### 5.4 Styling

- TailwindCSS only
- Reuse existing design tokens:
  - `--bg-root`
  - `--bg-surface-1`
  - `--text-primary`

## 6. Feature-Specific Rules

### 6.1 Chat System (High Complexity)

Combines:

- Signals
- HTTP bootstrap
- Socket updates

Rules:

- Keep logic inside `features/chat`
- Preserve event-driven updates
- Do not break optimistic UI flows

### 6.2 Authentication

- Managed by `UserService`
- Token injection handled automatically
- Do not manually attach headers

### 6.3 Sockets

- All events defined centrally
- Use typed payloads
- Do not emit/listen directly in components

### 6.4 Crypto / Key Bootstrap

- Login must trigger key initialization
- Never bypass `UserKeyBootstrapService`

## 7. SSR + Hydration Constraints

This app uses:

- SSR rendering
- Client hydration
- Zoneless change detection

Implications:

- Avoid side effects in constructors
- Avoid browser APIs during SSR
- Ensure state consistency between server/client

## 8. Tooling

- Runtime: Node v24+
- Package manager: `pnpm` (preferred)
- Commands:
  - `npm run start`
  - `npm run build`
  - `npm run serve:ssr`
  - `npm run lint`

Note:

- SSL config is machine-specific
- Backend endpoints are environment-dependent

## 9. Source of Truth Rules

When conflicts exist:

- Code > README
- Local file style > global config

Known inconsistencies:

- Angular version mismatch (20 vs 21)
- Prettier config conflict

## 10. What NOT To Do

- Do not hardcode backend URLs
- Do not use HTTP directly in components
- Do not duplicate socket/auth logic
- Do not introduce new state libraries
- Do not refactor unrelated files
- Do not assume browser environment in SSR

## 11. Change Quality Checklist

Before finalizing changes:

- SSR-safe?
- Uses existing services?
- Matches local coding style?
- No contract break with backend?
- No duplicated logic?
- Scoped to task?

## 12. Recommended Workflow

1. Read relevant feature files
2. Identify service boundaries
3. Check SSR impact
4. Reuse existing abstractions
5. Implement minimal change
6. Validate via lint/build

## 13. Priority Files To Read First

- `app.config.ts`
- `app.routes.ts`
- `server.ts`
- `api.service.ts`
- `user.service.ts`
- `socket.service.ts`
- `chat.service.ts`
- `environments.ts`

## 14. Guiding Principle

Extend the system - do not reshape it.

If unsure:

- Follow existing patterns in the same feature
- Prefer consistency over theoretical improvement
