import Constants from "../constants/constants";
import socket, { SocketIO } from "~/socket";
import * as userService from "./user.service";
import * as apiService from "./api.service";
import APIConfig from "~/config/api.config";

export class ShellClient {
  connectionId: string;
  socket: SocketIO = socket;
  constructor() {
    this.connectionId = userService.getConnectionId();
  }
  startShell() {
    apiService.post(APIConfig.SHELL, null, { connectionId: userService.getConnectionId() });
  }
  terminate() {}
  onData(callback: (data: { timestamp: number; data: string }) => void) {
    socket.on(Constants.SHELL_OUT, (data: { timestamp: number; data: string }) => {
      console.log(data);
      callback(data);
    });
  }
  send(message: string) {
    socket.send(Constants.SHELL_IN, { timestamp: Date.now(), data: message });
  }
}

const shellClient: ShellClient = new ShellClient();

export default shellClient;
