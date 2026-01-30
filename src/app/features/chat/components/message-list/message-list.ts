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
import { Message } from '../../models/chat.models';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [CommonModule, ScrollingModule],
  templateUrl: 'message-list.html',
  styleUrls: ['message-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageList implements AfterViewChecked, OnChanges {
  @Input({ required: true }) messages: Message[] = [];
  @Input() typingUsers: { userId: string; username: string }[] = [];

  @ViewChild('viewport') private viewport!: CdkVirtualScrollViewport;

  ngOnChanges(changes: SimpleChanges): void {}

  ngAfterViewChecked(): void {}
}
