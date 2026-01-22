import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { isPlatformBrowser } from '@angular/common';
import Keys from '../enums/keys.enum';
import { ToastService } from '../services/toast.service';
import { Events } from './event.enum';
import { Message } from './message.model';

interface ClientHello {
  socketId?: string;
  authorization?: string;
}
@Injectable({ providedIn: 'root' })
export class SocketService {
  private readonly socket = inject(Socket);
  private readonly platformId = inject(PLATFORM_ID);

  private initialized = false;

  constructor(private readonly toastService: ToastService) {
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

    this.socket.on(Events.CONNECT, () => {
      const id = this.socket.ioSocket.id!;
      localStorage.setItem(Keys.SOCKET_ID, id);

      const auth = localStorage.getItem(Keys.AUTHORIZATION_TOKEN);
      if (auth) {
        this.socket.emit(Events.AUTH, {
          socketId: id,
          authorization: auth,
        } satisfies ClientHello);
      }
    });

    this.socket.on(Events.SERVER_AUTH_SUCCESS, () => {
      this.toastService.success('Socket Auth Successful', '');
    });

    this.socket.on(Events.SERVER_AUTH_FAILED, () => {
      this.toastService.error('Socket Auth Failed', '');
    });

    this.socket.on(Events.DISCONNECT, () => {});
  }
  auth(authorization: string, socketId?: string) {
    if (isPlatformBrowser(this.platformId)) {
      this.socket.emit(Events.AUTH, {
        authorization,
        socketId,
      } satisfies ClientHello);
    }
  }
  emit(event: string, data: Message) {
    if (isPlatformBrowser(this.platformId)) {
      this.socket.emit(event, data);
    }
  }

  on<T>(event: string) {
    return this.socket.fromEvent<T>(event);
  }
}
