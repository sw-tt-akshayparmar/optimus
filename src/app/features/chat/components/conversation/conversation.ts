import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { filter, map, Subscription } from 'rxjs';
import { Message as ChatMessage, Reaction } from '../../models/chat.models';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import { Message as SockMessage } from '../../../../socket/message.model';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ScrollingModule, MatIconButton, MatIcon],
  templateUrl: 'conversation.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Conversation implements OnInit, OnDestroy {
  input!: FormControl;
  subs: Subscription[] = [];
  @ViewChild('viewport') private readonly viewport!: ElementRef;
  protected readonly reactions = ['👍', '😂', '😝', '😍', '❤️', '😡', '😤', '😎', '😮', '🙏', '👎'];

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
    this.chatService.onReaction((sockMsg: SockMessage<ChatMessage>) => {});
  }
  getAllMessages(convId: string): void {
    let s = this.chatService.getAllMessages(convId).subscribe({
      next: (res) => {
        this.scrollToBottom();
      },
    });
    this.subs.push(s);
  }

  ngOnDestroy(): void {
    this.chatService.offMessage();
    this.chatService.offReaction();
    this.subs.forEach((_s) => _s.unsubscribe());
    this.subs = [];
  }
  sendMessage(): void {
    if (!this.input.value) return;
    this.chatService.sendMessage(this.chatService.conversationId(), this.input.value);
    this.input.reset();
    this.scrollToBottom();
  }

  getDateFormat(timestamp: Date) {
    return new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(timestamp));
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      this.viewport.nativeElement.scrollTop = this.viewport.nativeElement.scrollHeight;
    });
  }
  addReaction(i: string, message: ChatMessage): void {
    i.trim();
    this.chatService.addReaction(i, message);
  }

  renderReactions(message: ChatMessage) {
    if (!message.reactions || message.reactions.length === 0) {
      return [];
    }
    const obj: Record<string, number> = {};
    let c = 0;
    message.reactions.forEach((r) => {
      c++;
      if (obj[r.reaction]) {
        obj[r.reaction]++;
      } else {
        obj[r.reaction] = 1;
      }
    });
    const r = Object.entries(obj);
    r.sort((a, b) => {
      return a[1] - b[1];
    });
    return r;
  }
}
