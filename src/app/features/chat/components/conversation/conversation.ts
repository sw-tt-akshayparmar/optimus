import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat.service';
import { Message } from '../../models/chat.models';

@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'conversation.html',
  styleUrls: ['conversation.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Conversation implements OnInit, OnDestroy {
  private chatService = inject(ChatService);

  messages = signal<Message[]>([]);

  constructor() {}

  ngOnInit(): void {
    this.setupListeners();
    this.chatService.onMessage().subscribe({
      next: (data) => {
        console.log(data);
        // this.messages.update((prev) => [...prev, data]);
      },
    });
  }

  ngOnDestroy(): void {}

  private setupListeners(): void {}

  onSendMessage(content: string): void {
    // this.chatService.sendMessage();
  }

  onTyping(isTyping: boolean): void {}
}
