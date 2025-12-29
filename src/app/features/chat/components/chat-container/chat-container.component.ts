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
import { MessageListComponent } from '../message-list/message-list.component';
import { MessageInputComponent } from '../message-input/message-input.component';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [CommonModule, MessageListComponent, MessageInputComponent],
  template: `
    <div
      class="chat-container flex flex-col h-full bg-(--bg-root) border-l border-(--bg-surface-3)"
    >
      <!-- Header -->
      <div
        class="chat-header h-12 flex items-center px-4 bg-(--bg-surface-1) border-b border-(--bg-surface-3) shadow-sm"
      >
        <i class="pi pi-hashtag text-(--text-muted) mr-2"></i>
        <h2 class="text-(--text-primary) font-bold text-sm">{{ channelName }}</h2>
        <div class="flex-1"></div>
        <div class="flex items-center space-x-4 text-(--text-muted)">
          <i class="pi pi-bell hover:text-(--text-primary) cursor-pointer"></i>
          <i class="pi pi-users hover:text-(--text-primary) cursor-pointer"></i>
          <div class="relative">
            <input
              type="text"
              placeholder="Search"
              class="bg-(--bg-root) border-none rounded px-2 py-1 text-xs focus:ring-1 focus:ring-(--neon-cyan) outline-none"
            />
          </div>
        </div>
      </div>

      <!-- Message List -->
      <app-message-list
        [messages]="messages()"
        [typingUsers]="typingUsers()"
        class="flex-1 min-h-0"
      ></app-message-list>

      <!-- Message Input -->
      <app-message-input
        (send)="onSendMessage($event)"
        (typing)="onTyping($event)"
      ></app-message-input>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatContainerComponent implements OnInit, OnDestroy {
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
    console.log(m);

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
