import { Component, ElementRef, OnDestroy, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RTCService } from '../../services/rtc.service';
import { User } from '../../models/User.model';

interface ChatMessage {
  userName: string;
  message: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.route.html',
})
export class ChatRoute implements OnInit, OnDestroy {
  @ViewChild('messagesEndRef') private messagesEndRef?: ElementRef<HTMLDivElement>;

  // Reactive state using Angular signals
  messages = signal<ChatMessage[]>([]);
  input = '';

  private myself = this.ensureUser();
  currentUser = signal<User>(this.myself);

  private subscriptions: Array<() => void> = [];

  constructor(private rtc: RTCService) {}

  ngOnInit(): void {
    // Subscribe to receive messages
    const sub1 = this.rtc.onReceive().subscribe(({ user, message }) => {
      this.messages.update((prev) => [...prev, { userName: user, message }]);
      this.scrollToBottom();
    });

    // Subscribe to user registrations (join notifications)
    const sub2 = this.rtc.onRegister().subscribe((userName) => {
      this.messages.update((prev) => [...prev, { userName, message: 'has Joined' }]);
      this.scrollToBottom();
    });

    this.subscriptions.push(
      () => sub1.unsubscribe(),
      () => sub2.unsubscribe(),
    );

    // Register current user
    this.rtc.register(this.currentUser().name);
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    for (const unsub of this.subscriptions) {
      try {
        unsub();
      } catch {}
    }
  }

  handleSend(e: Event) {
    e.preventDefault();
    const text = this.input.trim();
    if (!text) return;

    this.rtc.send(this.currentUser().name, text);
    this.input = '';
  }

  private scrollToBottom() {
    // Defer to allow DOM to render
    queueMicrotask(() => this.messagesEndRef?.nativeElement.scrollIntoView({ behavior: 'smooth' }));
  }

  private ensureUser(): User {
    try {
      const key = 'user-data';
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.name) {
          return User.from({
            id: parsed.id ?? this.randomId(),
            username: parsed.username ?? parsed.name,
            name: parsed.name,
          });
        }
      }
    } catch {}

    const guestName = `Guest-${Math.floor(Math.random() * 900 + 100)}`;
    const user = User.from({
      id: this.randomId(),
      username: guestName.toLowerCase(),
      name: guestName,
    });
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(
          'user-data',
          JSON.stringify({ id: user.id, username: user.username, name: user.name }),
        );
      }
    } catch {}
    return user;
  }

  private randomId() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}
