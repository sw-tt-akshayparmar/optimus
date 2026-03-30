# AGENTS.md

## Purpose
This file guides LLMs and coding agents working in `optimus`. Use it to understand the project layout, current implementation style, and repository-specific constraints before making changes.

## Project Overview
- `optimus` is an Angular 21 standalone application with Angular SSR and an Express server entrypoint.
- The frontend depends on a separate backend for authentication, REST APIs, chat, and Socket.IO events.
- Main user-facing areas currently in the repo:
  - auth: login and registration
  - chat: conversations, requests, reactions, socket-driven updates
  - workspace: projects and terminal UI
  - AI chat
  - chess-related UI/data and emulator utilities

## Tech Stack
- Angular 21 with standalone components
- Angular Router
- Angular SSR via `@angular/ssr`
- Express 5 SSR host in `src/server.ts`
- RxJS and Angular Signals
- Angular Material
- Tailwind CSS v4
- Prime Icons
- Socket.IO client via `ngx-socket-io`
- Dexie for browser-side persistence

## Repository Layout
- `src/main.ts`: browser bootstrap
- `src/main.server.ts`: server bootstrap
- `src/server.ts`: Express SSR server
- `src/app/app.config.ts`: root providers, zoneless mode, hydration, socket setup
- `src/app/app.routes.ts`: application routes
- `src/app/routes/`: route-level standalone components
- `src/app/components/`: reusable UI components
- `src/app/features/chat/`: chat-specific models, services, and components
- `src/app/services/`: cross-cutting frontend services
- `src/app/socket/`: socket events, payload models, socket service
- `src/app/crypto/`: key bootstrap/storage services
- `src/app/models/`: app-wide models
- `src/app/config/api.config.ts`: API path definitions
- `src/app/environments.ts`: frontend backend endpoint configuration
- `src/assets/`: theme and content styling assets
- `public/`: static assets copied as-is
- `docs/`: architecture notes, plans, and quality reports

## Current Architecture Patterns

### Angular application shape
- Prefer standalone components; this is the dominant pattern in the repo.
- Routing is centralized in `src/app/app.routes.ts`.
- Global app setup belongs in `src/app/app.config.ts`.
- Zoneless change detection is enabled. Do not assume Zone.js-driven behavior.
- Hydration is enabled. Changes must remain SSR-safe and hydration-safe.

### State management
- Use Angular Signals for local/shared reactive state when it is already the pattern, especially in chat flows.
- Use RxJS for async streams, HTTP flows, and socket event composition.
- Do not introduce a heavier global state library unless explicitly requested.

### Data and models
- Models frequently use class-based `from(...)` factory methods and `getCopy()` helpers.
- Follow the existing model style when editing nearby code; do not mix multiple model patterns in the same feature without a reason.
- Preserve backend API naming when mapping transport models. Current chat payloads use snake_case fields from the backend.

### Services
- Feature orchestration belongs in services.
- `ApiService` centralizes REST calls.
- `SocketService` centralizes websocket connection/auth/event emission.
- `UserService` owns auth/session persistence and bootstrap flows.

## Coding Standards To Follow

### TypeScript and Angular
- Use strict, explicit typing where practical. Avoid widening everything to `any`.
- Keep imports grouped and readable; follow existing Angular-first import ordering in touched files.
- Prefer `readonly` for injected dependencies and immutable references when applicable.
- Keep route components thin when logic can live in services.
- Avoid adding NgModules unless there is a hard requirement.

### Templates
- Follow the existing Angular control flow style using `@if` where already used.
- Keep templates declarative; move data shaping and side effects into TypeScript/services.
- Inside forms, explicitly set button `type` when the action is not a submit.

### Styling
- Global styles are assembled from `src/styles.scss`.
- Reuse existing CSS variables and theme tokens such as `--bg-root`, `--bg-surface-1`, `--text-primary`.
- Prefer maintaining the current visual system over introducing a second parallel styling approach.

### Naming
- Components: `*.component.ts` for route/shared components, though some feature components omit the `.component` suffix in filenames. Match the local convention of the feature you are editing.
- Services: `*.service.ts`
- Models: `*.model.ts` or feature-specific `*.models.ts`
- Enums/constants/config: keep them centralized in existing folders.

## Project-Specific Implementation Guidance

### SSR and browser-only APIs
- This repo is SSR-enabled. Any use of `window`, `document`, `localStorage`, sockets, or DOM APIs must be guarded for browser-only execution.
- Existing code uses `isPlatformBrowser(...)` checks. Continue that pattern for browser-only logic.
- Do not move browser-only side effects into constructors that may run during SSR unless they are guarded.

### Authentication
- Auth state currently relies on browser storage and `UserService`.
- `ApiService` automatically attaches bearer tokens unless an endpoint is marked `noAuth`.
- When adding authenticated features, route requests through `ApiService` instead of duplicating header logic.
- If changing auth flows, consider SSR implications first.

### Sockets and real-time features
- Socket setup is global in `app.config.ts` and behavior lives in `SocketService`.
- Real-time chat features should reuse `Events` definitions and typed socket payload models.
- Avoid scattering raw socket event names through components.

### Chat feature
- Chat state currently mixes signals, HTTP bootstrap, and socket updates.
- Keep chat-specific logic under `src/app/features/chat/` unless the concern is clearly cross-cutting.
- Preserve optimistic and event-driven behavior when modifying chat flows.

### Crypto/key bootstrap
- Login completion currently initializes user keys through `UserKeyBootstrapService`.
- Do not bypass key bootstrap when altering login or registration flows.

### API integration
- API paths belong in `src/app/config/api.config.ts`.
- Avoid hardcoding REST endpoints in components or feature services.
- Keep query/path construction inside `ApiService` usage patterns.

## Tooling and Commands
- Package manager in the repo is effectively `pnpm` because `pnpm-lock.yaml` exists, but `package.json` scripts are standard Node/Angular CLI scripts.
- Common commands:
  - `npm run start`
  - `npm run build`
  - `npm run serve:ssr`
  - `npm run lint`
  - `npm run lint:fix`
  - `npm run test`
- `ng serve` is configured for local SSL in `angular.json` using machine-specific certificate paths. Do not assume those paths exist on another machine.

## Source-Of-Truth Rules
- Prefer actual source code over README claims when they conflict.
- Important current inconsistencies:
  - `README.md` still mentions Angular 20 in places, but `package.json` is Angular 21.
  - `package.json` contains a `prettier` section with `singleQuote: true`, but `prettier.config.js` sets `singleQuote: false`.
- For edits, follow the formatting already present in the touched file and keep diffs consistent. Do not perform broad style churn just to resolve repo-wide inconsistencies.

## Quality Bar For Changes
- Keep changes scoped to the request.
- Preserve SSR compatibility.
- Preserve standalone-component architecture.
- Prefer extending an existing service/model/component over duplicating logic.
- If you touch auth, socket, or chat flows, verify failure paths and browser-only guards.
- If you change routing or app-level providers, consider both browser bootstrap and SSR behavior.

## Things To Avoid
- Do not hardcode new backend hosts, ports, or secrets.
- Do not introduce direct HTTP calls in components when `ApiService` is the existing abstraction.
- Do not duplicate socket connection/authentication logic outside `SocketService`.
- Do not refactor unrelated files just to normalize naming or formatting.
- Do not assume browser APIs are available during SSR.

## Recommended Workflow For Agents
1. Read the relevant route/component/service/model files in the feature you are touching.
2. Check whether the change impacts SSR, auth, socket flows, or browser storage.
3. Reuse existing abstractions before adding new ones.
4. Keep transport contracts aligned with backend payload shapes.
5. Run the smallest relevant validation available, typically lint or targeted build/test.

## Files Worth Reading First
- `src/app/app.config.ts`
- `src/app/app.routes.ts`
- `src/server.ts`
- `src/app/services/api.service.ts`
- `src/app/services/user.service.ts`
- `src/app/socket/socket.service.ts`
- `src/app/features/chat/services/chat.service.ts`
- `src/app/environments.ts`
- `docs/chat-architecture.md`
- `docs/CODE_QUALITY_REPORT.md`

## Known Constraints and Risks
- Backend endpoints are currently configured in `src/app/environments.ts` with machine-specific values.
- Dev SSL configuration in `angular.json` is machine-specific.
- The repo has some naming/style inconsistency from earlier iterations; preserve local consistency instead of forcing repo-wide rewrites.
- There may be active uncommitted user changes. Avoid overwriting unrelated modifications.


You are an expert in TypeScript, Angular, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It'subs the default.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection


# Coding Guidelines

## Technology Constraints

- Language: TypeScript only
- Framework: Angular 21
- Styling: TailwindCSS (no inline CSS)
- Charts: Vega ONLY
- Diagrams: Mermaid ONLY

## Protocols

- Realtime messaging: Socket.IO v4
- Serialization: Protobuf (proto3)

## Standards

- HTTP APIs: OpenAPI 3.1
- Error handling: RFC 7807
- Auth: OAuth2 + JWT (RS256)

## Runtime and Project

- Node v24.12
- pnpm latest version

## Validation Rules

- If a diagram is needed → Mermaid syntax required
- If plotting data → Vega JSON required
- If defining APIs → OpenAPI 3.1 YAML required


# Coding Guidelines

## Technology Constraints

- Language: TypeScript only
- Framework: Angular 21
- Styling: TailwindCSS (no inline CSS)
- Charts: Vega ONLY
- Diagrams: Mermaid ONLY

## Protocols

- Realtime messaging: Socket.IO v4
- Serialization: Protobuf (proto3)

## Standards

- HTTP APIs: OpenAPI 3.1
- Error handling: RFC 7807
- Auth: OAuth2 + JWT (RS256)

## Runtime and Project

- Node v24.12
- pnpm latest version

## Validation Rules

- If a diagram is needed → Mermaid syntax required
- If plotting data → Vega JSON required
- If defining APIs → OpenAPI 3.1 YAML required


# Coding Guidelines

## Technology Constraints

- Language: TypeScript only
- Framework: Angular 21
- Styling: TailwindCSS (no inline CSS)
- Charts: Vega ONLY
- Diagrams: Mermaid ONLY

## Protocols

- Realtime messaging: Socket.IO v4
- Serialization: Protobuf (proto3)

## Standards

- HTTP APIs: OpenAPI 3.1
- Error handling: RFC 7807
- Auth: OAuth2 + JWT (RS256)

## Runtime and Project

- Node v24.12
- pnpm latest version

## Validation Rules

- If a diagram is needed → Mermaid syntax required
- If plotting data → Vega JSON required
- If defining APIs → OpenAPI 3.1 YAML required