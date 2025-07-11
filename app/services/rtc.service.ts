import { io, Socket } from "socket.io-client";
import Constants from "../constants/constants";

// socket = io("http://localhost:5000");
//     socket.on("private_message", (msg) => {
//       setMessages((msgs) => [...msgs, msg]);
//     });
//     return () => {
//       socket.disconnect();
//     };

//     socket.emit("private_message", { user: username, text: input });

let socket: Socket | null = null;
let userId: string = "";
let user: string = "";
export function connect(username: string) {
  socket = io("ws://192.168.4.57:5000");
  userId = Math.floor(Math.random() * 100000).toString();
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
