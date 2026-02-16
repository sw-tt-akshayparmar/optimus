import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { Conversation } from '../../models/chat.models';
import { ChatService } from '../../services/chat.service';

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
  ) {}

  ngOnInit(): void {
    this.chatService.getAlConversations().subscribe({
      next: (res) => {
        this.conversations.set(res.data);
      },
    });
  }

  ngOnDestroy(): void {}
  openConv(c: Conversation) {
    this.router.navigate(['chat', c.id]);
  }
}
