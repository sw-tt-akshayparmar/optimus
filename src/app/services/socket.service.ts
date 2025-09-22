import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { isPlatformBrowser } from '@angular/common';
import Constants from '../constants/constants';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket = inject(Socket);
  private platformId = inject(PLATFORM_ID);

  constructor(private userService: UserService) {
    if (isPlatformBrowser(this.platformId)) {
      this.socket.on(Constants.CONNECT, () => {
        this.socket.emit(Constants.CLIENT_HELLO, 'Hello from Client');
      });
      this.socket.on(Constants.SERVER_HELLO, ({ connectionId }: { connectionId: string }) => {
        this.userService.setConnectionId(connectionId);
      });

      this.socket.on(Constants.DISCONNECT, () => {
        console.log('Socket disconnected');
      });
    }
  }

  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  on<T>(event: string) {
    return this.socket.fromEvent<T>(event);
  }
}
