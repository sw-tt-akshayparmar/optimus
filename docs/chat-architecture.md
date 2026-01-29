### Architecture Overview

The chat system is built using a unidirectional data flow pattern, leveraging Angular Signals for state management and RxJS for socket event streams.

#### 1. Socket Event Contract

| Event | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `join:room` | Client -> Server | `{ roomId: string }` | Join a specific chat room |
| `leave:room` | Client -> Server | `{ roomId: string }` | Leave a specific chat room |
| `message:send` | Client -> Server | `{ roomId: string, content: string, nonce: string }` | Send a new message |
| `message:receive` | Server -> Client | `Message` | Received a new message |
| `message:ack` | Server -> Client | `{ nonce: string, status: 'delivered' \| 'failed', message?: Message }` | Acknowledgment of a sent message |
| `typing:start` | Client <-> Server | `{ roomId: string, userId: string, username: string }` | User started typing |
| `typing:stop` | Client <-> Server | `{ roomId: string, userId: string }` | User stopped typing |
| `presence:update` | Server -> Client | `{ userId: string, status: 'online' \| 'offline' }` | Presence update |

#### 2. Models

```typescript
export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  status: 'pending' | 'delivered' | 'failed';
  nonce?: string; // For optimistic UI matching
}

export interface TypingIndicator {
  userId: string;
  username: string;
  lastActive: number;
}
```

#### 3. Component Interaction Diagram

```mermaid
graph TD
    ChatContainer[ChatContainer] -->|Signals| MessageList[MessageList]
    ChatContainer -->|Signals| MessageInput[MessageInput]
    MessageList -->|For| MessageItem[MessageItem]
    MessageInput -->|Events| ChatContainer
    ChatContainer <--> ChatService((ChatService))
```

#### 4. Message Flow (Optimistic UI)

```mermaid
sequenceDiagram
    participant UI as MessageInput
    participant CC as ChatContainer
    participant CSS as ChatService
    participant S as Server

    UI->>CC: Send Content
    CC->>CC: Create Pending Message (Optimistic)
    CC->>CSS: Emit 'message:send'
    CSS->>S: Socket.IO Emit
    S-->>CSS: Socket.IO Ack / 'message:ack'
    CSS-->>CC: Update Message Status
```

#### 5. Socket Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Disconnected
    Disconnected --> Connecting: Connect Request
    Connecting --> Connected: Auth Success
    Connecting --> Disconnected: Auth Fail / Error
    Connected --> Disconnected: Network Drop / Logout
    Disconnected --> Connecting: Exponential Backoff Retry
```
