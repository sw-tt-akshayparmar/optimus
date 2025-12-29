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
import { MessageItemComponent } from '../message-item/message-item.component';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [CommonModule, MessageItemComponent, ScrollingModule],
  template: `
    <div class="message-list-container flex-1 relative flex flex-col overflow-hidden">
      <div #viewport class="flex-1 h-full w-full" (scroll)="onScroll($event)">
        <div class="flex-1 min-h-2.5"></div>
        <!-- Spacer -->
        @for (message of messages; track message.id) {
          <div class="message-wrapper">
            <app-message-item
              [message]="message"
              [isFirstInGroup]="isFirstInGroup($index)"
            ></app-message-item>
          </div>
        }
        @if (typingUsers.length > 0) {
          <div class="typing-indicator px-12 py-2 text-xs text-(--text-muted) animate-pulse">
            {{ getTypingText() }}
          </div>
        }
      </div>

      <!-- New Messages Toast -->
      @if (showNewMessageToast) {
        <div
          (click)="scrollToBottom()"
          class="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2
          bg-(--neon-blue) text-white rounded-full shadow-lg cursor-pointer hover:bg-(--neon-cyan)
          transition-colors z-10 text-sm font-medium"
        >
          New messages below
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        width: 100%;
      }
      cdk-virtual-scroll-viewport {
        scrollbar-width: thin;
        scrollbar-color: var(--bg-surface-3) transparent;
      }
      .message-wrapper {
        min-height: 20px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageListComponent implements AfterViewChecked, OnChanges {
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
