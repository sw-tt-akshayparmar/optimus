export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  status: 'pending' | 'delivered' | 'failed';
  nonce?: string;
}

export interface MessageGroup {
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: string;
  messages: Message[];
}

export interface TypingIndicator {
  userId: string;
  username: string;
  lastActive: number;
}

export interface PresenceUpdate {
  userId: string;
  status: 'online' | 'offline';
}

export interface MessageAck {
  nonce: string;
  status: 'delivered' | 'failed';
  message?: Message;
}
