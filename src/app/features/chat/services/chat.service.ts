import { Injectable } from '@angular/core';
import { SocketService } from '../../../socket/socket.service';
import { Events } from '../../../socket/events.enum';
import { ApiService } from '../../../services/api.service';
import APIConfig from '../../../config/api.config';
import { tap } from 'rxjs';
import { Message } from '../../../socket/message.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private readonly socketService: SocketService,
    private readonly apiService: ApiService,
  ) {
    this.socketService.emit(Events.CHAT_JOIN, {} as any);
    this.socketService.on(Events.CHAT_DOWN).subscribe({
      next: (data) => {
        console.log(data);
      },
    });
  }

  sendMessage(room: string | string[], content: string, nonce: string): void {}

  sendTypingStatus(room: string | [], userId: string, username: string, isTyping: boolean): void {}

  sendRequest(userId: string) {
    return this.apiService.post(APIConfig.CHAT_REQUEST, null, null, { receiver: userId });
  }
  onMessage() {
    return this.socketService.on<Message>(Events.CHAT_DOWN);
  }
}
