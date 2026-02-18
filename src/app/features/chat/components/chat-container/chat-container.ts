import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { Conversation } from '../../models/chat.models';
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../../../services/user.service';
import { MatBadge } from '@angular/material/badge';

@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatIcon, MatButton, NgOptimizedImage, MatBadge],
  templateUrl: 'chat-container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatContainer implements OnInit, OnDestroy {
  constructor(
    protected readonly router: Router,
    protected readonly route: ActivatedRoute,
    protected readonly chatService: ChatService,
    protected readonly userService: UserService,
  ) {}

  ngOnInit(): void {
    this.chatService.getAlConversations().subscribe({
      next: (res) => {},
    });
  }

  ngOnDestroy(): void {}
  openConv(c: Conversation) {
    c.newMsg = 0;
    this.chatService.conversation.set(c);
    this.chatService.conversationId.set(c.id);
    this.router.navigate([c.id], { relativeTo: this.route });
  }
}
