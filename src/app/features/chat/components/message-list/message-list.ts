import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ViewChild,
  AfterViewChecked,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ChatService } from '../../services/chat.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [CommonModule, ScrollingModule],
  templateUrl: 'message-list.html',
  styleUrls: ['message-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageList implements AfterViewChecked, OnChanges {
  @ViewChild('viewport') private viewport!: CdkVirtualScrollViewport;
  constructor(
    private chatService: ChatService,
    private router: Router,
  ) {}

  ngOnInit() {
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
            this.chatService.getAllMessages(convId);
          }
        },
      });
  }
  ngOnChanges(changes: SimpleChanges): void {}

  ngAfterViewChecked(): void {}
}
