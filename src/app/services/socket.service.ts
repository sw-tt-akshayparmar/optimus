import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { isPlatformBrowser } from '@angular/common';
import Constants from '../constants/constants';
import { ErrorResponse, SuccessResponse } from '../models/Response.model';
import storageConstants from '../constants/storage.constants';

interface ClientHello {
  connectionId?: string;
  authorization?: string;
}

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket = inject(Socket);
  private platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.socket.on(Constants.CONNECT, () => {
        this.socket.emit(Constants.CLIENT_HELLO, {
          authorization: localStorage.getItem(storageConstants.AUTHORIZATION_TOKEN) ?? undefined,
        } satisfies ClientHello);
      });
      this.socket.on(
        Constants.SERVER_HELLO,
        (
          res: ErrorResponse<{ connectionId: string }> | SuccessResponse<{ connectionId: string }>,
        ) => {
          if ((res as SuccessResponse<{ connectionId: string }>).isSuccessful === true) {
            const success = res as SuccessResponse<{ connectionId: string }>;
            if (success.data?.connectionId) {
              localStorage.setItem(
                storageConstants.CONNECTION_ID,
                success.data.connectionId,
              );
            }
          } else {
            // Handle error response from server hello
            console.warn('SERVER_HELLO error:', res);
          }
        },
      );
      this.socket.on(Constants.DISCONNECT, () => {
        console.warn('Socket disconnected');
      });
    }
  }
  connect(authorization: string, connectionId?: string) {
    this.socket.emit(Constants.CLIENT_HELLO, {
      authorization,
      connectionId,
    } satisfies ClientHello);
  }
  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  on<T>(event: string) {
    return this.socket.fromEvent<T>(event);
  }
}
