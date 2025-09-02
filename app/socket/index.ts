import { io, Socket } from "socket.io-client";
import Constants from "~/constants/constants";
import * as envService from "~/services/env.service";
import { saveConnectionId } from "~/services/user.service";

// TODO make it better
export class SocketIO {
  private socket!: Socket;
  private serverUrl: string;
  listeners: { [key: string]: (data: any) => void } = {};
  initializers: (() => void)[] = [];
  constructor(url?: string) {
    this.serverUrl = url || envService.getSocketioUrl();
    this.connect();
  }
  connect(url?: string) {
    this.socket = io(this.serverUrl);
    this.socket.on(Constants.SERVER_HELLO, (data: { connectionId: string }) => {
      saveConnectionId(data.connectionId);
      this.socket.off();
      Object.entries(this.listeners).forEach(([key, cb]) => {
        this.socket.on(key, cb);
      });
      this.initializers.forEach((cb: () => void) => cb());
    });
  }
  send(event: string, data: any) {
    this.socket?.emit(event, data);
  }
  on(event: string, callback: (data: any) => void) {
    this.listeners[event] = callback;
    this.socket?.on(event, callback);
  }
  off(event?: string, callback?: (data: any) => void) {
    event && delete this.listeners[event];
    this.socket?.off(event, callback);
  }
  disconnect() {
    this.socket?.disconnect();
  }
  isConnected(): boolean {
    return this.socket && this.socket.connected;
  }
  onConnect(cb: () => void) {
    this.initializers.push(cb);
  }
}

const socket: SocketIO = new SocketIO();

export default socket;
