import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, signal } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { filter, map, Subscription } from 'rxjs';
import { Message as ChatMessage } from '../../models/chat.models';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import { Message as SockMessage } from '../../../../socket/message.model';

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ScrollingModule],
  templateUrl: 'conversation.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Conversation implements OnInit, OnDestroy {
  input!: FormControl;
  subs: Subscription[] = [];

  constructor(
    protected readonly chatService: ChatService,
    private readonly fb: FormBuilder,
    protected readonly userService: UserService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.input = this.fb.control('');
    const s = this.route.paramMap
      .pipe(
        map((params) => params.get('conversationId')),
        filter((id): id is string => !!id),
      )
      .subscribe((convId) => {
        this.chatService.conversationId.set(convId);
        this.getAllMessages(convId);
      });
    this.subs.push(s);

    this.chatService.onMessage((sockMsg: SockMessage<ChatMessage>) => {
      this.scrollToBottom();
    });
  }
  getAllMessages(convId: string): void {
    let s = this.chatService.getAllMessages(convId).subscribe({
      next: (res) => {
        requestAnimationFrame(this.scrollToBottom);
      },
    });
    this.subs.push(s);
  }

  ngOnDestroy(): void {
    this.chatService.offMessage();
    this.subs.forEach((_s) => _s.unsubscribe());
    this.subs = [];
  }
  sendMessage(): void {
    if (!this.input.value) return;
    this.chatService.sendMessage(this.chatService.conversationId(), this.input.value);
    this.input.reset();
    requestAnimationFrame(this.scrollToBottom);
  }

  getDateFormat(timestamp: Date) {
    return new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(timestamp));
  }

  private scrollToBottom(): void {
    const viewport = document.getElementById('viewport')!;
    viewport.scrollTo({
      top: viewport.scrollHeight,
      behavior: 'smooth',
    });
  }
}
