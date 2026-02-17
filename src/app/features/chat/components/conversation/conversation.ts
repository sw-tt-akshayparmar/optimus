import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  signal,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, Subscription } from 'rxjs';
import { Message as ChatMessage, Conversation as ConvModel } from '../../models/chat.models';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import { Message as SockMessage } from '../../../../socket/message.model';

@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: 'conversation.html',
  styleUrls: ['conversation.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Conversation implements OnInit, OnDestroy {
  messages = signal<ChatMessage[]>([]);
  input!: FormControl;
  conversation!: ConvModel;
  subs: Subscription[] = [];

  constructor(
    private router: Router,
    private readonly chatService: ChatService,
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
        this.conversation = this.chatService.conversations.find((c) => convId === c.id)!;
        this.getAllMessages(convId);
      });
    this.subs.push(s);

    this.chatService.onMessage((sockMsg: SockMessage<ChatMessage>) => {
      this.messages.update((prev) => [...prev, sockMsg.data]);
    });
  }
  getAllMessages(convId: string): void {
    let s = this.chatService.getAllMessages(convId).subscribe({
      next: (res) => {
        this.messages.set(res.data.records);
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
    if (this.input.value) {
      this.chatService.sendMessage(this.conversation.id, this.input.value);
    }
    this.input.reset();
  }
  getSenderName(userId: string) {
    return (
      this.conversation?.participations?.find((p) => p.user_id === userId)?.user.name || userId
    );
  }
  getDateFormat(timestamp: Date | string) {
    return new Date(timestamp).toLocaleTimeString();
  }
}
