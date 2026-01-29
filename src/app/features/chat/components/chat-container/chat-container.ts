import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatSocketService } from '../../services/chat-socket.service';
import { Message, TypingIndicator } from '../../models/chat.models';
import { MessageList } from '../message-list/message-list';
import { MessageInput } from '../message-input/message-input';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [CommonModule, MessageList, MessageInput],
  templateUrl: 'chat-container.html',
  styleUrls: ['chat-container.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatContainer implements OnInit, OnDestroy {
  @Input({ required: true }) roomId!: string;
  @Input() channelName = 'general';

  private chatService = inject(ChatSocketService);

  // Local State (Signals)
  messages = signal<Message[]>([]);
  typingUsers = signal<{ userId: string; username: string; lastActive: number }[]>([]);
  private subs = new Subscription();

  // Mock User (In a real app, this would come from an AuthService)
  private currentUser = {
    id: 'user-' + Math.floor(Math.random() * 1000),
    name: 'JunieDev',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg',
  };

  constructor() {
    // Auto-expire typing status
    this.subs.add(
      interval(1000).subscribe(() => {
        const now = Date.now();
        const active = this.typingUsers().filter((u) => now - u.lastActive < 5000);
        if (active.length !== this.typingUsers().length) {
          this.typingUsers.set(active);
        }
      }),
    );
  }

  ngOnInit(): void {
    this.chatService.joinRoom(this.roomId);
    this.setupListeners();
  }

  ngOnDestroy(): void {
    this.chatService.leaveRoom(this.roomId);
    this.subs.unsubscribe();
  }

  private setupListeners(): void {
    // Listen for new messages
    this.subs.add(
      this.chatService.messageReceived$.subscribe((msg) => {
        if (msg.roomId === this.roomId) {
          // Check if this is a message we sent optimistically
          const current = this.messages();
          const index = current.findIndex((m) => m.nonce === msg.nonce);

          if (index !== -1) {
            const updated = [...current];
            updated[index] = { ...msg, status: 'delivered' };
            this.messages.set(updated);
          } else {
            this.messages.update((prev) => [...prev, { ...msg, status: 'delivered' }]);
          }
        }
      }),
    );

    // Listen for acknowledgments
    this.subs.add(
      this.chatService.messageAck$.subscribe((ack) => {
        this.messages.update((prev) =>
          prev.map((m) =>
            m.nonce === ack.nonce ? { ...m, status: ack.status, id: ack.message?.id || m.id } : m,
          ),
        );
      }),
    );

    // Typing Indicators
    this.subs.add(
      this.chatService.typingStart$.subscribe((t) => {
        if (t.userId === this.currentUser.id) return;
        this.typingUsers.update((prev) => {
          const filtered = prev.filter((u) => u.userId !== t.userId);
          return [...filtered, { ...t, lastActive: Date.now() }];
        });
      }),
    );

    this.subs.add(
      this.chatService.typingStop$.subscribe((t) => {
        this.typingUsers.update((prev) => prev.filter((u) => u.userId !== t.userId));
      }),
    );
  }

  onSendMessage(content: string): void {
    const nonce = Math.random().toString(36).substring(7);
    const optimisticMsg: Message = {
      id: '', // Will be set by server
      roomId: this.roomId,
      senderId: this.currentUser.id,
      senderName: this.currentUser.name,
      senderAvatar: this.currentUser.avatar,
      content,
      timestamp: new Date().toISOString(),
      status: 'pending',
      nonce,
    };
    const m = [...this.messages(), optimisticMsg];
    // Update UI instantly
    this.messages.set(m);

    // Emit to socket
    this.chatService.sendMessage(this.roomId, content, nonce);
  }

  onTyping(isTyping: boolean): void {
    this.chatService.sendTypingStatus(
      this.roomId,
      this.currentUser.id,
      this.currentUser.name,
      isTyping,
    );
  }
}
