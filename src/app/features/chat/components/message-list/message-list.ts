import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ViewChild,
  AfterViewChecked,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Message } from '../../models/chat.models';
import { MessageItem } from '../message-item/message-item';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [CommonModule, MessageItem, ScrollingModule],
  templateUrl: 'message-list.html',
  styleUrls: ['message-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageList implements AfterViewChecked, OnChanges {
  @Input({ required: true }) messages: Message[] = [];
  @Input() typingUsers: { userId: string; username: string }[] = [];

  @ViewChild('viewport') private viewport!: CdkVirtualScrollViewport;

  showNewMessageToast = false;
  private isNearBottom = true;
  private GROUP_TIME_THRESHOLD = 5 * 60 * 1000; // 5 minutes

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['messages'] && !changes['messages'].firstChange) {
      if (!this.isNearBottom) {
        this.showNewMessageToast = true;
      } else {
        // Use a small timeout to allow the DOM to update before scrolling
        setTimeout(() => this.scrollToBottom(), 0);
      }
    }
  }

  ngAfterViewChecked(): void {
    // If we want to force scroll on init or something
  }

  trackByMessageId(index: number, message: Message): string {
    return message.id || (message.nonce as string);
  }

  isFirstInGroup(index: number): boolean {
    if (index === 0) return true;

    const current = this.messages[index];
    const previous = this.messages[index - 1];

    const sameSender = current.senderId === previous.senderId;
    const withinTime =
      new Date(current.timestamp).getTime() - new Date(previous.timestamp).getTime() <
      this.GROUP_TIME_THRESHOLD;

    return !sameSender || !withinTime;
  }

  getTypingText(): string {
    if (this.typingUsers.length === 0) return '';
    if (this.typingUsers.length === 1) return `${this.typingUsers[0].username} is typing...`;
    if (this.typingUsers.length < 4)
      return `${this.typingUsers.map((u) => u.username).join(', ')} are typing...`;
    return 'Several people are typing...';
  }

  onScroll(event: Event): void {
    const element = event.target as HTMLElement;
    const threshold = 100;
    this.isNearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < threshold;

    if (this.isNearBottom) {
      this.showNewMessageToast = false;
    }
  }

  scrollToBottom(): void {
    if (this.viewport) {
      this.viewport.scrollToIndex(this.messages.length - 1, 'smooth');
      this.showNewMessageToast = false;
      this.isNearBottom = true;
    }
  }
}
