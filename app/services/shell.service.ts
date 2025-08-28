import Constants from "../constants/constants";
import socket, { SocketIO } from "~/socket";
import * as userService from "./user.service";
import * as apiService from "./api.service";
import APIConfig from "~/config/api.config";

export class ShellClient {
  connectionId: string;
  socket: SocketIO = socket;
  isStarted: boolean = false;
  isOnDataSet: boolean = false;
  constructor() {
    this.connectionId = userService.getConnectionId();
  }
  startShell() {
    if (!this.isStarted) {
      apiService.post(APIConfig.SHELL, null, { connectionId: userService.getConnectionId() });
      this.isStarted = true;
    }
  }
  terminate() {}
  onData(callback: (data: { timestamp: number; data: string }) => void) {
    if (!this.isOnDataSet) {
      socket.on(Constants.SHELL_OUT, callback);
      this.isOnDataSet = true;
    }
  }
  send(message: string) {
    socket.send(Constants.SHELL_IN, { timestamp: Date.now(), data: message });
  }
}

const shellClient: ShellClient = new ShellClient();

export default shellClient;
