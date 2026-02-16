import { Injectable } from '@angular/core';
import { SocketService } from '../../../socket/socket.service';
import { Events } from '../../../socket/events.enum';
import { ApiService } from '../../../services/api.service';
import APIConfig from '../../../config/api.config';
import { Observable } from 'rxjs';
import { Message } from '../../../socket/message.model';
import { SuccessResponse } from '../../../models/Response.model';
import { RecordModel } from '../../../models/record.model';
import { Conversation, Request } from '../models/chat.models';
import { type } from 'node:os';

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

  getAlRequests(
    type: 'all' | 'sent' | 'received' = 'received',
  ): Observable<SuccessResponse<RecordModel<Request>>> {
    return this.apiService.get(APIConfig.CHAT_REQUEST, null, { type });
  }

  processRequest(request: Request, process: 'accept' | 'reject' | 'cancel') {
    return this.apiService.put(APIConfig.CHAT_REQUEST, null, [request.id], { process });
  }

  getAlConversations() {
    return this.apiService.get<Conversation[]>(APIConfig.CHAT);
  }
}
