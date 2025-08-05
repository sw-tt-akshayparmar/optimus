import Constants from "../constants/constants";
import type { User } from "~/models/User.model";
import socket, { SocketIO } from "~/socket";
import * as userService from "./user.service";

export class RTClient {
  user: User;
  isRegistered: boolean;
  socket: SocketIO = socket;
  constructor(user?: User) {
    this.user = user || userService.getUserData();
    this.isRegistered = false;
  }
  register() {
    if (!this.isRegistered) {
      this.socket.send(Constants.REGISTER_EVENT, this.user);
      this.isRegistered = true;
    }
  }
  unregister() {
    if (this.isRegistered) {
      this.socket.send(Constants.UNREGISTER_EVENT, userService.getUserData());
      this.isRegistered = false;
    }
  }
  onRegister(callback: (user: User) => void) {
    this.socket.off(Constants.REGISTER_EVENT);
    const currUser: User = userService.getUserData();
    this.socket.on(Constants.REGISTER_EVENT, (user: User) => {
      if (currUser.id !== user.id) {
        callback(user);
      }
    });
  }
  onUnregister(callback: (user: User) => void) {}
  send(message: string) {
    this.socket.send(Constants.PRIVATE_CHAT, {
      user: this.user,
      message,
    });
  }
  onReceive(callback: (data: { user: User; message: string }) => void) {
    socket.off(Constants.PRIVATE_CHAT);
    this.socket.on(Constants.PRIVATE_CHAT, callback);
  }
}

const rtClient: RTClient = new RTClient();

export default rtClient;
