import { io, Socket } from "socket.io-client";
import Constants from "../constants/constants";
import * as envService from "~/services/env.service";

let socket: Socket | null = null;
let userId: string = "";
let user: string = "";
export function connect(username: string) {
  socket = io(envService.getSocketioUrl());
  userId = (Math.random() * 100000).toString();
  localStorage.setItem(Constants.USER_ID, userId);
  user = username;
  socket?.emit(Constants.REGISTER_EVENT, { userId, user });
}
export function disconnect() {
  socket?.disconnect();
}
export function register() {
  socket?.emit(
    Constants.REGISTER_EVENT,
    localStorage.getItem(Constants.USER_ID)
  );
}
export function send(message: string) {
  socket?.emit(Constants.PRIVATE_CHAT, {
    user,
    userId,
    message,
  });
}

export function onRecive(
  callback: (data: { user: string; userId: string; message: string }) => void
) {
  socket?.on(Constants.PRIVATE_CHAT, callback);
}

export function onRegister(
  callback: (data: { user: string; userId: string }) => void
) {
  socket?.on(
    Constants.REGISTER_EVENT,
    (data: { user: string; userId: string }) => {
      if (data.userId !== userId) {
        callback(data);
      }
    }
  );
}
