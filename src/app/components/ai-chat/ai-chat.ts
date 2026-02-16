import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  ViewChild,
  ElementRef,
  AfterViewInit,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SocketService } from '../../socket/socket.service';
import { Events } from '../../socket/events.enum';
import { Message } from '../../socket/message.model';
import markdown from 'markdown-it';
import { v4 } from 'uuid';

export interface AIChatMessage {
  prompt: string;
  conversationId: string;
  response?: string;
}

export interface UIChatMessage {
  text: string;
  sender: 'user' | 'ai';
}

@Component({
  selector: 'app-ai-chat',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './ai-chat.html',
  styleUrl: './ai-chat.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AIComponent implements OnInit, AfterViewInit {
  @ViewChild('chatContainer') private readonly chatContainer!: ElementRef;
  @ViewChild('vega', { static: true }) vega!: ElementRef;
  messages = signal<UIChatMessage[]>([{ text: 'Hello! How can I help you today?', sender: 'ai' }]);
  chatForm!: FormGroup;
  conversationId: string = v4();
  md = markdown();
  constructor(
    private readonly fb: FormBuilder,
    private readonly socketService: SocketService,
    @Inject(PLATFORM_ID) private readonly platformId: Object,
  ) {}
  ngOnInit(): void {
    this.chatForm = this.fb.group({
      message: ['', Validators.required],
    });
    this.socketService.on<Message<AIChatMessage>>(Events.SIO_RES).subscribe({
      next: (message) => {
        if (message.success) {
          const aiMessage: UIChatMessage = {
            text: message.data.response || '',
            sender: 'ai',
          };
          console.log(this.md.render(aiMessage.text));
          this.messages.update((messages) => [...messages, aiMessage]);
          this.scrollToBottom();
        }
      },
    });
  }
  async ngAfterViewInit() {}

  sendMessage() {
    if (this.chatForm.valid && this.chatForm.value.message) {
      const userMessage: UIChatMessage = {
        text: this.chatForm.value.message,
        sender: 'user',
      };
      this.socketService.emit(Events.SIO_REQ, {
        clientId: '',
        success: true,
        message: ' AI Prompt Sent',
        data: {
          prompt: this.chatForm.value.message,
          conversationId: this.conversationId,
        },
        messageId: v4(),
        event: Events.SIO_REQ,
        room: '',
      });
      this.messages.update((messages) => [...messages, userMessage]);
      this.chatForm.reset();
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    try {
      setTimeout(() => {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      });
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}
