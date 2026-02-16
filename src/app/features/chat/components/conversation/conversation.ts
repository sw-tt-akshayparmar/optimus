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
import { filter } from 'rxjs';
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
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => {
          return event instanceof NavigationEnd;
        }),
      )
      .subscribe({
        next: (event) => {
          const route = event.url.split('/').at(-1);
          if (route && !['all', 'new'].includes(route)) {
            this.getAllConversations(route);
          }
        },
      });
    this.chatService.onMessage().subscribe({
      next: (sockMsg: SockMessage<ChatMessage>) => {
        this.messages.update((prev) => [...prev, sockMsg.data]);
      },
    });
  }
  getAllConversations(convId: string): void {
    this.conversation_id = convId;
    console.log('getAllConversations ', this.conversation_id);
    this.chatService.getAllMessages(convId).subscribe({
      next: (res) => {
        this.messages.set(res.data.records);
      },
    });
  }
  ngOnDestroy(): void {}

  sendMessage(): void {
    if (this.conversation_id && this.input.value) {
      this.chatService.sendMessage(this.conversation_id, this.input.value);
    }
    this.input.reset();
  }
}
