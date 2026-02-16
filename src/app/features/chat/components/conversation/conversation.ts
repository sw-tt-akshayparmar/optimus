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
import { MessageList } from '../message-list/message-list';

@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [CommonModule, MessageList],
  templateUrl: 'conversation.html',
  styleUrls: ['conversation.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Conversation implements OnInit, OnDestroy {
  private chatService = inject(ChatService);

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
