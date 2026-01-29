You are a senior frontend engineer and UI systems architect specializing in Angular 21, real-time systems, and
large-scale chat applications.
Your task is to design and implement a Discord-like chat component using Angular 21 + ngx-socket-io + Socket.IO,
strictly following the constraints and requirements below.

1. CORE OBJECTIVE
   Create a modular, scalable, production-ready chat component that replicates Discord chat room behavior, including
   real-time messaging, typing indicators, message grouping, read states, and robust socket lifecycle handling.
   This is not a demo. Treat this as a real application used by thousands of concurrent users.

2. TECHNOLOGY CONSTRAINTS (MANDATORY)

Framework: Angular 21 (standalone components only)

Real-time: ngx-socket-io (Socket.IO client)

State Handling: Signals + RxJS where appropriate

Change Detection: OnPush

Language: TypeScript (strict mode)

Styling:
❌ DO NOT create new color themes
❌ DO NOT introduce new color palettes
❌ DO NOT override global design tokens
✅ Reuse existing SCSS variables, CSS variables, Tailwind utilities, or global styles already present in the application
✅ If a required style is missing, derive it from existing variables instead of inventing new ones

3. FUNCTIONAL REQUIREMENTS (DISCORD-LEVEL)
   3.1 Messaging

Real-time message send/receive via Socket.IO

Optimistic UI updates (message appears instantly)

Server acknowledgment handling (pending → delivered → failed)

Support:

Plain text messages

Multi-line messages

Message timestamps

Message grouping:

Consecutive messages by same user within time window are visually grouped

Avatar and username shown once per group

3.2 Chat Rooms / Channels

Support multiple rooms (roomId / channelId)

Join/leave rooms via socket events

Automatically unsubscribe from previous room on switch

Maintain per-room message history (in-memory)

3.3 Typing Indicators

Emit typing:start and typing:stop

Throttle typing events

Show “User is typing…” indicator

Auto-expire typing state if no updates received

3.4 Presence & Read State

Online / offline indicator (derived from socket presence)

Track last-read message per user (client-side)

Emit read receipts only when required (avoid noisy events)

3.5 Scroll Behavior

Auto-scroll to bottom only if user is already near bottom

Preserve scroll position when loading older messages

“New messages” indicator when user is scrolled up

4. SOCKET ARCHITECTURE REQUIREMENTS
   You MUST:

Centralize socket logic in a ChatSocketService

Handle:

connect

disconnect

reconnect

auth refresh

Support custom handshake / authentication tokens

Gracefully handle:

network drops

duplicate events

reconnect replay

Never bind socket listeners directly inside components

5. COMPONENT ARCHITECTURE
   Design the following standalone Angular components:

ChatContainer

Owns room state

Subscribes to socket streams

Passes data downward only

MessageList

Virtualized rendering (large message lists)

Grouping logic

Scroll management

MessageItem

Pure presentational

OnPush

No socket logic

MessageInput

Handles typing

Emits send events

Keyboard shortcuts (Enter / Shift+Enter)

All components must be loosely coupled and testable.

6. STATE MANAGEMENT RULES

Use Angular Signals for UI-local state

Use RxJS streams for socket event flows

Avoid global state libraries unless absolutely required

No mutable shared objects across components

7. PERFORMANCE & SCALABILITY
   You MUST optimize for:

Thousands of messages per room

High-frequency socket events

Minimal re-renders

Memory cleanup on component destroy

Zero socket listener leaks

8. ERROR HANDLING

Show non-blocking UI errors (e.g., failed send)

Retry logic with exponential backoff

Graceful degradation when socket is unavailable

No uncaught promise rejections

9. DELIVERABLES REQUIRED FROM YOU
   Produce:

High-level architecture explanation

Component interaction flow

Socket event contract (event names + payloads)

Angular component code (TypeScript + template snippets)

ChatSocketService implementation

State flow explanation

Edge cases handled

Mermaid diagrams

Component interaction

Socket lifecycle

Message flow

All diagrams MUST be valid Mermaid syntax.

10. ABSOLUTE PROHIBITIONS

❌ No inline socket usage in components

❌ No new color definitions

❌ No hard-coded styles

❌ No global mutable state

❌ No DOM manipulation outside Angular

11. EXPECTATION LEVEL
    Assume:

This code will be reviewed by senior architects

This will be extended to support voice, reactions, threads later

Clean abstractions matter more than shortcuts

Deliver clean, production-ready output.

If you want, I can next:

Tailor this prompt to your existing socket handshake design

Convert it into a LangChain system prompt

Add server-side socket contract assumptions (NestJS-friendly)

