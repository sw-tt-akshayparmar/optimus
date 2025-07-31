import Constants from "../constants/constants";
import type { User } from "~/models/User.model";
import socket from "~/socket";
import * as userService from "./user.service";

export function connect() {
  const user: User = userService.getUserdata();
  socket.send(Constants.REGISTER_EVENT, user);
}
export function disconnect() {
  socket.send(Constants.UNREGISTER_EVENT, localStorage.getItem(Constants.USER_ID));
}
export function register() {
  socket.send(Constants.REGISTER_EVENT, localStorage.getItem(Constants.USER_ID));
}
export function send(message: string) {
  const user: User = userService.getUserdata();
  socket.send(Constants.PRIVATE_CHAT, {
    user,
    message,
  });
}

export function onRecive(
  callback: (data: { user: string; userId: string; message: string }) => void
) {
  socket.on(Constants.PRIVATE_CHAT, callback);
}

export function onRegister(callback: (user: User) => void) {
  const currUser: User = userService.getUserdata();
  socket.on(Constants.REGISTER_EVENT, (user: User) => {
    if (currUser.id !== user.id) {
      callback(user);
    }
  });
}
