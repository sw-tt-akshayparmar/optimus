import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { isPlatformBrowser } from '@angular/common';
import Constants from '../constants/constants';
import storageConstants from '../constants/storage.constants';
import { ToastService } from './toast.service';

interface ClientHello {
  socketId?: string;
  authorization?: string;
}
@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket = inject(Socket);
  private platformId = inject(PLATFORM_ID);

  private initialized = false;

  constructor(private toastService: ToastService) {
    this.init();
  }

  init() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.initialized) return;

    this.initialized = true;

    this.registerListeners();
    this.socket.connect();
  }

  private registerListeners() {
    this.socket.removeAllListeners();

    this.socket.on(Constants.CONNECT, () => {
      const id = this.socket.ioSocket.id!;
      localStorage.setItem(storageConstants.SOCKET_ID, id);
      console.log('Socket Connected: ', this.socket.id);

      const auth = localStorage.getItem(storageConstants.AUTHORIZATION_TOKEN);
      if (auth) {
        this.socket.emit(Constants.AUTH, {
          socketId: id,
          authorization: auth,
        } satisfies ClientHello);
      }
    });

    this.socket.on(Constants.SERVER_AUTH_SUCCESS, () => {
      this.toastService.success('Socket Auth Successful', '');
    });

    this.socket.on(Constants.SERVER_AUTH_FAILED, () => {
      this.toastService.error('Socket Auth Failed', '');
    });

    this.socket.on(Constants.DISCONNECT, () => {});
  }
  auth(authorization: string, socketId?: string) {
    if (isPlatformBrowser(this.platformId)) {
      this.socket.emit(Constants.AUTH, {
        authorization,
        socketId,
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
