import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { isPlatformBrowser } from '@angular/common';
import Constants from '../constants/constants';
import { ErrorResponse, SuccessResponse } from '../models/Response.model';
import storageConstants from '../constants/storage.constants';
import { ToastService } from './toast.service';

interface ClientHello {
  connectionId?: string;
  authorization?: string;
}

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket = inject(Socket);
  private platformId = inject(PLATFORM_ID);

  constructor(private toastService: ToastService) {
    if (isPlatformBrowser(this.platformId)) {
      this.socket.on(Constants.CONNECT, () => {
        this.socket.emit(Constants.CLIENT_HELLO, {} satisfies ClientHello);
      });
      this.socket.on(
        Constants.SERVER_HELLO,
        (
          res: ErrorResponse<{ connectionId: string }> | SuccessResponse<{ connectionId: string }>,
        ) => {
          localStorage.setItem(storageConstants.CONNECTION_ID, res.data!.connectionId);
          const auth = localStorage.getItem(storageConstants.AUTHORIZATION_TOKEN);
          if (auth) {
            this.socket.emit(Constants.AUTH, {
              connectionId: res.data!.connectionId,
              authorization: auth,
            });
          }
        },
      );
      this.socket.on(
        Constants.SERVER_AUTH_SUCCESS,
        (res: SuccessResponse<{ connectionId: string }>) => {
          this.toastService.success('Socket Auth Successful', '');
        },
      );
      this.socket.on(
        Constants.SERVER_AUTH_FAILED,
        (res: ErrorResponse<{ connectionId: string }>) => {
          this.toastService.success('Socket Auth Failure', '');
        },
      );
      this.socket.on(Constants.DISCONNECT, () => {});
    }
  }
  auth(authorization: string, connectionId?: string) {
    if (isPlatformBrowser(this.platformId)) {
      this.socket.emit(Constants.AUTH, {
        authorization,
        connectionId,
      } satisfies ClientHello);
    }
  }
  emit(event: string, data: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.socket.emit(event, data);
    }
  }

  on<T>(event: string) {
    return this.socket.fromEvent<T>(event);
  }
}
