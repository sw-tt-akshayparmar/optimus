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
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, Subscription } from 'rxjs';
import { Message as ChatMessage } from '../../models/chat.models';
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
  conversation_id!: string;
  s: Subscription[] = [];

  constructor(
    private router: Router,
    private readonly chatService: ChatService,
    private readonly fb: FormBuilder,
    protected readonly userService: UserService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.conversation_id = this.route.snapshot.params['conversationId'];
    this.input = this.fb.control('');
    const s = this.route.paramMap
      .pipe(
        map((params) => params.get('conversationId')),
        filter((id): id is string => !!id),
      )
      .subscribe((convId) => {
        this.getAllConversations(convId);
      });
    this.s.push(s);

    this.chatService.onMessage((sockMsg: SockMessage<ChatMessage>) => {
      this.messages.update((prev) => [...prev, sockMsg.data]);
    });
  }
  getAllConversations(convId: string): void {
    this.conversation_id = convId;
    let s = this.chatService.getAllMessages(convId).subscribe({
      next: (res) => {
        this.messages.set(res.data.records);
      },
    });
    this.s.push(s);
  }

  ngOnDestroy(): void {
    this.chatService.offMessage();
    this.s.forEach((_s) => _s.unsubscribe());
    this.s = [];
  }

  sendMessage(): void {
    if (this.conversation_id && this.input.value) {
      this.chatService.sendMessage(this.conversation_id, this.input.value);
    }
    this.input.reset();
  }
}
