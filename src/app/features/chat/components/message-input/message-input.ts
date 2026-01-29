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
  templateUrl: 'message-input.html',
  styleUrls: ['message-input.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageInput {
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
