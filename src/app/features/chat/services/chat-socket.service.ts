import { Injectable, inject } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Subject, fromEvent } from 'rxjs';
import { map, retryWhen, delay, take, filter } from 'rxjs/operators';
import { Message, MessageAck, TypingIndicator, PresenceUpdate } from '../models/chat.models';

@Injectable({
  providedIn: 'root',
})
export class ChatSocketService {
  private socket = inject(Socket);

  // Connection State
  public connected$ = this.socket.fromEvent<void>('connect').pipe(map(() => true));
  public disconnected$ = this.socket.fromEvent<void>('disconnect').pipe(map(() => false));

  // Inbound Streams
  public messageReceived$ = this.socket.fromEvent<Message>('message:receive');
  public messageAck$ = this.socket.fromEvent<MessageAck>('message:ack');
  public typingStart$ = this.socket.fromEvent<TypingIndicator>('typing:start');
  public typingStop$ = this.socket.fromEvent<{ userId: string }>('typing:stop');
  public presenceUpdate$ = this.socket.fromEvent<PresenceUpdate>('presence:update');

  /**
   * Connect to a room
   */
  joinRoom(roomId: string): void {
    this.socket.emit('join:room', { roomId });
  }

  /**
   * Leave a room
   */
  leaveRoom(roomId: string): void {
    this.socket.emit('leave:room', { roomId });
  }

  /**
   * Send a message
   */
  sendMessage(roomId: string, content: string, nonce: string): void {
    this.socket.emit('message:send', { roomId, content, nonce });
  }

  /**
   * Notify typing status
   */
  sendTypingStatus(roomId: string, userId: string, username: string, isTyping: boolean): void {
    const event = isTyping ? 'typing:start' : 'typing:stop';
    this.socket.emit(event, { roomId, userId, username });
  }

  /**
   * Custom handshake / auth update
   */
  updateAuthToken(token: string): void {
    this.socket.ioSocket.auth = { token };
    this.socket.disconnect();
    this.socket.connect();
  }
}
