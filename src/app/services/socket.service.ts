import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { isPlatformBrowser } from '@angular/common';
import Constants from '../constants/constants';
import { UserService } from './user.service';
import { ErrorResponse, SuccessResponse } from '../models/Response.model';

interface ClientHello {
  connectionId?: string;
  authorization?: string;
}

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket = inject(Socket);
  private platformId = inject(PLATFORM_ID);

  constructor(private userService: UserService) {
    this.userService.on('login', (token: string) => {
      this.socket.emit(Constants.CLIENT_HELLO, token);
    });
    if (isPlatformBrowser(this.platformId)) {
      this.socket.on(Constants.CONNECT, () => {
        this.socket.emit(Constants.CLIENT_HELLO, {
          authorization: this.userService.getAccessToken() ?? undefined,
        } satisfies ClientHello);
      });
      this.socket.on(
        Constants.SERVER_HELLO,
        (
          res: ErrorResponse<{ connectionId: string }> | SuccessResponse<{ connectionId: string }>,
        ) => {
          this.userService.setConnectionId(res.data!.connectionId);
        },
      );

      this.socket.on(Constants.DISCONNECT, () => {});
    }
  }

  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  on<T>(event: string) {
    return this.socket.fromEvent<T>(event);
  }
}
