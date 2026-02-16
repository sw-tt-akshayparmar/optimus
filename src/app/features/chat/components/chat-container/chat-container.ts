import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { Conversation } from '../../models/chat.models';
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatIcon, MatButton, NgOptimizedImage],
  templateUrl: 'chat-container.html',
  styleUrls: ['chat-container.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatContainer implements OnInit, OnDestroy {
  protected conversations = signal<Conversation[]>([]);
  constructor(
    protected readonly router: Router,
    protected readonly route: ActivatedRoute,
    private readonly chatService: ChatService,
    private readonly userService: UserService,
  ) {}

  ngOnInit(): void {
    this.chatService.getAlConversations().subscribe({
      next: (res) => {
        res.data.forEach((c: Conversation) => {
          c.title = c.participations?.find((p) => {
            return p.user_id !== this.userService.getUserData().id;
          })?.user.name;
        });
        this.conversations.set(res.data);
      },
    });
  }

  ngOnDestroy(): void {}
  openConv(c: Conversation) {
    this.router.navigate([c.id], { relativeTo: this.route });
  }
}
