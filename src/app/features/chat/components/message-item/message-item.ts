import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Message } from '../../models/chat.models';

@Component({
  selector: 'app-message-item',
  standalone: true,
  templateUrl: 'message-item.html',
  imports: [CommonModule, NgOptimizedImage],
  styleUrls: ['message-item.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageItem {
  @Input({ required: true }) message!: Message;
  @Input() isFirstInGroup = false;
}
