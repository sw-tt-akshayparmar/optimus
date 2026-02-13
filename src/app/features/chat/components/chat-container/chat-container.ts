import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatFabButton } from '@angular/material/button';

@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatIcon, MatFabButton, MatButton],
  templateUrl: 'chat-container.html',
  styleUrls: ['chat-container.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatContainer implements OnInit, OnDestroy {
  constructor(
    protected readonly router: Router,
    protected readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
