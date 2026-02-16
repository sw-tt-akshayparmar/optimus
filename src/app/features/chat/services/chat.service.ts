import { Injectable } from '@angular/core';
import { SocketService } from '../../../socket/socket.service';
import { Events } from '../../../socket/events.enum';
import { ApiService } from '../../../services/api.service';
import APIConfig from '../../../config/api.config';
import { Observable } from 'rxjs';
import { Message as SockMessage } from '../../../socket/message.model';
import { SuccessResponse } from '../../../models/Response.model';
import { RecordModel } from '../../../models/record.model';
import { Conversation, Message as ChatMessage, Request } from '../models/chat.models';
import { v4 } from 'uuid';
import { UserService } from '../../../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private readonly socketService: SocketService,
    private readonly apiService: ApiService,
    private readonly userService: UserService,
  ) {
    this.socketService.emit(Events.CHAT_JOIN, {} as any);
  }

  sendMessage(conversationId: string | string[], content: string): void {
    const sockMsg: SockMessage<ChatMessage> = {
      clientId: '',
      messageId: v4(),
      success: true,
      event: Events.CHAT_UP,
      message: 'Chat Message',
      room: conversationId,
      data: {
        conversation_id: conversationId,
        sender: this.userService.getUserData().id,
        content,
      } as ChatMessage,
    };
    this.socketService.emit(Events.CHAT_UP, sockMsg);
  }

  sendRequest(userId: string) {
    return this.apiService.post(APIConfig.CHAT_REQUEST, null, null, { receiver: userId });
  }
  onMessage(callback: (data: SockMessage<ChatMessage>) => void) {
    return this.socketService.on<SockMessage<ChatMessage>>(Events.CHAT_DOWN, callback);
  }

  offMessage() {
    this.socketService.off(Events.CHAT_DOWN);
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
  getAllMessages(convId: string) {
    return this.apiService.get<RecordModel<ChatMessage>>(APIConfig.CHAT, [convId]);
  }
}
