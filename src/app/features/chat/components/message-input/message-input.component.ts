import {
  Component,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="message-input-container p-4 bg-(--bg-surface-1)">
      <div
        class="relative flex items-end bg-(--bg-surface-2) rounded-lg p-2 border border-(--bg-surface-3) focus-within:border-(--neon-cyan) transition-colors"
      >
        <textarea
          #textarea
          [(ngModel)]="messageContent"
          (keydown.enter)="onEnter($event)"
          (ngModelChange)="onTyping()"
          placeholder="Message #channel"
          class="flex-1 bg-transparent border-none outline-none text-(--text-primary) resize-none max-h-40 min-h-11 py-2 px-2"
          rows="1"
        ></textarea>

        <div class="flex items-center space-x-2 px-2 pb-1">
          <button class="text-(--text-muted) hover:text-(--neon-cyan) transition-colors">
            <i class="pi pi-plus-circle text-xl"></i>
          </button>
          <button
            [disabled]="!messageContent().trim()"
            (click)="sendMessage()"
            class="text-(--text-muted) hover:text-(--neon-cyan) disabled:opacity-30 disabled:hover:text-(--text-muted) transition-colors"
          >
            <i class="pi pi-send text-xl"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      textarea {
        scrollbar-width: thin;
        scrollbar-color: var(--bg-surface-3) transparent;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageInputComponent {
  @Output() send = new EventEmitter<string>();
  @Output() typing = new EventEmitter<boolean>();

  messageContent = signal('');
  private typingSubject = new Subject<void>();

  constructor() {
    this.typingSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
      this.typing.emit(true);
      // Auto-stop typing after 3 seconds of inactivity
      setTimeout(() => this.typing.emit(false), 3000);
    });
  }

  onEnter(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    if (!keyboardEvent.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  onTyping() {
    this.typingSubject.next();
  }

  sendMessage() {
    const content = this.messageContent().trim();
    if (content) {
      this.send.emit(content);
      this.messageContent.set('');
      this.typing.emit(false);
    }
  }
}
