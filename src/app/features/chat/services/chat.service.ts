import { Injectable, signal } from '@angular/core';
import { SocketService } from '../../../socket/socket.service';
import { Events } from '../../../socket/events.enum';
import { ApiService } from '../../../services/api.service';
import APIConfig from '../../../config/api.config';
import { Observable, tap } from 'rxjs';
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
  conversations = signal<Conversation[]>([]);
  conversation = signal<Conversation>({} as any);
  conversationId = signal<string>('');
  messages = signal<ChatMessage[]>([]);
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
        created_at: new Date(),
      } as ChatMessage,
    };
    this.socketService.emit(Events.CHAT_UP, sockMsg);
  }

  sendRequest(userId: string) {
    return this.apiService.post(APIConfig.CHAT_REQUEST, null, null, { receiver: userId });
  }
  onMessage(callback: (data: SockMessage<ChatMessage>) => void) {
    return this.socketService.on<SockMessage<ChatMessage>>(Events.CHAT_DOWN, (sockMsg) => {
      if (this.conversationId() === sockMsg.data.conversation_id) {
        this.messages.update((prev) => [...prev, sockMsg.data]);
      } else {
        this.conversations.update((cs) => {
          const c = cs.find((_c) => _c.id === sockMsg.data.conversation_id)!;
          const num = Number(c.newMsg) || 0;
          c.newMsg = num + 1;
          return [...cs];
        });
      }
      this.conversations.update((cs) => {
        const c = cs.find((_c) => _c.id === sockMsg.data.conversation_id)!;
        c.messages = [sockMsg.data];
        return [...cs];
      });
      callback(sockMsg);
    });
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
    return this.apiService.get<Conversation[]>(APIConfig.CHAT).pipe(
      tap((res) => {
        res.data.forEach((c: Conversation) => {
          c.title = c.participations?.find((p) => {
            return p.user_id !== this.userService.getUserData().id;
          })?.user.name;
        });
        this.conversations.set(res.data);
      }),
    );
  }
  getAllMessages(convId: string) {
    return this.apiService.get<RecordModel<ChatMessage>>(APIConfig.CHAT, [convId]).pipe(
      tap((res) => {
        this.messages.set(res.data.records.reverse());
      }),
    );
  }
}
