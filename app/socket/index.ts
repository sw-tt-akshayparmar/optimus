import { io, Socket } from "socket.io-client";
import Constants from "~/constants/constants";
import * as envService from "~/services/env.service";
import { saveConnectionId } from "~/services/storage.service";

class SocketIO {
  private socket!: Socket;
  private serverUrl: string;
  static s: SocketIO;
  constructor(url?: string) {
    this.serverUrl = url || envService.getSocketioUrl();
    this.socket = io(this.serverUrl);
    this.socket.on(Constants.SERVER_HELLO, (data: { connectionId: string }) => {
      saveConnectionId(data.connectionId);
    });
  }
  connect(url?: string) {
    this.socket = io(url || this.serverUrl);
  }
  send(event: string, data: any) {
    this.socket.emit(event, data);
  }
  on(event: string, callback: (data: any) => void) {
    this.socket.on(event, callback);
  }
}

const socket: SocketIO = new SocketIO();

export default socket;
