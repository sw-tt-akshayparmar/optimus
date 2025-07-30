import { io, Socket } from "socket.io-client";
import Constants from "~/constants/constants";
import * as envService from "~/services/env.service";

// const socket: Socket = io(envService.getSocketioUrl());

// export function disconnect() {
//   socket?.disconnect();
// }

// socket.on("connection", () => {
//   console.log("Socket connected:", socket.id);
// });

// export default socket;

class SocketIO {
  private socket!: Socket;
  private serverUrl: string;
  static s: SocketIO;
  constructor(url?: string) {
    this.serverUrl = url || envService.getServerUrl();
    this.socket = io(this.serverUrl);
    this.socket.on(Constants.SERVER_HELLO, (data: any) => {
      console.log(data);
      localStorage.setItem("connectionId", data);
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
