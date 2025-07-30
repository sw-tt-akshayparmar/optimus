import Constants from "../constants/constants";
import socket from "~/socket";

let userId: string = "";
let user: string = "";
export function connect(username: string) {
  userId = (Math.random() * 100000).toString();
  localStorage.setItem(Constants.USER_ID, userId);
  user = username;
  socket?.send(Constants.REGISTER_EVENT, { userId, user });
}
export function disconnect() {
  socket.send(Constants.UNREGISTER_EVENT, localStorage.getItem(Constants.USER_ID));
}
export function register() {
  socket?.send(Constants.REGISTER_EVENT, localStorage.getItem(Constants.USER_ID));
}
export function send(message: string) {
  socket?.send(Constants.PRIVATE_CHAT, {
    user,
    userId,
    message,
  });
}

export function onRecive(
  callback: (data: { user: string; userId: string; message: string }) => void
) {
  socket.on(Constants.PRIVATE_CHAT, callback);
}

export function onRegister(callback: (data: { user: string; userId: string }) => void) {
  socket.on(Constants.REGISTER_EVENT, (data: { user: string; userId: string }) => {
    if (data.userId !== userId) {
      callback(data);
    }
  });
}
