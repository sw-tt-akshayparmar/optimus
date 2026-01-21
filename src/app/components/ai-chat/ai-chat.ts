import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface Message {
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
  styleUrl: './ai-chat.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AIComponent {
  messages = signal<Message[]>([{ text: 'Hello! How can I help you today?', sender: 'ai' }]);
  chatForm!: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.chatForm = this.fb.group({
      message: ['', Validators.required],
    });
  }

  sendMessage() {
    if (this.chatForm.valid && this.chatForm.value.message) {
      const userMessage: Message = {
        text: this.chatForm.value.message,
        sender: 'user',
      };
      this.messages.update((messages) => [...messages, userMessage]);

      // Simulate AI response
      setTimeout(() => {
        const aiMessage: Message = {
          text: 'This is a simulated AI response.',
          sender: 'ai',
        };
        this.messages.update((messages) => [...messages, aiMessage]);
      }, 1000);

      this.chatForm.reset();
    }
  }
}
