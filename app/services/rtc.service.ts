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

export function connect() {
  socket = io("ws://localhost:5000");
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
    toUserId: localStorage.getItem(Constants.TO_USER_ID),
    message,
  });
}

export function onRecive(
  callback: (data: { user: string; text: string }) => void
) {
  socket?.on(Constants.PRIVATE_CHAT, (data: any) => {
    console.log(data);
    callback({ text: data.message, user: data.toUserId });
  });
}
