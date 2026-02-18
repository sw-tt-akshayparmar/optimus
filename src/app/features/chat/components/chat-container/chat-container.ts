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
  getTimeSinceLast(c: Conversation) {
    const created = new Date(c?.messages?.[0]?.created_at!).getTime();
    const now = Date.now();
    const diff = now - created || 0;

    const sec = Math.floor(diff / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);
    const month = Math.floor(day / 30);
    const year = Math.floor(day / 365);

    if (year > 0) return `${year}y`;
    if (month > 0) return `${month}m`;
    if (day > 0) return `${day}d`;
    if (hr > 0) return `${hr}h`;
    if (min > 0) return `${min}min`;
    return `${sec}s`;
  }
}
