import Constants from "../constants/constants";
import socket, { SocketIO } from "~/socket";
import * as userService from "./user.service";
import * as apiService from "./api.service";
import APIConfig from "~/config/api.config";
import storageConstants from "~/constants/storage.constants";

export class ShellClient {
  socket: SocketIO = socket;
  isStarted: boolean = false;
  onDataCB: ((data: { timestamp: number; data: string }) => void) | undefined = undefined;
  constructor() {
    this.socket.on(Constants.DISCONNECT, () => {
      this.onDataCB = undefined;
      this.isStarted = false;
      this.socket.off(Constants.SHELL_OUT);
    });
    socket.onConnect(() => {
      this.isStarted = false;
      this.startShell();
    });
  }
  startShell() {
    if (!this.isStarted) {
      apiService.post(APIConfig.SHELL, null, { connectionId: userService.getConnectionId() });
      this.isStarted = true;
    }
  }
  terminate() {}
  onData(callback: (data: { timestamp: number; data: string }) => void) {
    if (!this.onDataCB) {
      this.onDataCB = callback;
      socket.on(Constants.SHELL_OUT, callback);
    }
  }
  send(message: string) {
    socket.send(Constants.SHELL_IN, { timestamp: Date.now(), data: message });
  }
}

const shellClient: ShellClient = new ShellClient();

export default shellClient;
