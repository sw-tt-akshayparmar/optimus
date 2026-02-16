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
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Message } from '../../models/chat.models';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: 'conversation.html',
  styleUrls: ['conversation.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Conversation implements OnInit, OnDestroy {
  messages = signal<Message[]>([]);
  input!: FormControl;
  conversation_id!: string;
  constructor(
    private router: Router,
    private readonly chatService: ChatService,
    private readonly fb: FormBuilder,
    protected readonly userService: UserService,
  ) {}

  ngOnInit(): void {
    this.input = this.fb.control('');
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => {
          return event instanceof NavigationEnd;
        }),
      )
      .subscribe({
        next: (event) => {
          const convId = event.url.split('/')[2];
          if (convId) {
            this.conversation_id = convId;
            this.chatService.getAllMessages(convId).subscribe({
              next: (res) => {
                this.messages.set(res.data.records);
              },
            });
          } else {
            this.conversation_id = '';
          }
        },
      });
    this.chatService.onMessage().subscribe({
      next: (sockMsg) => {
        this.messages.update((prev) => [...prev, sockMsg.data]);
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
