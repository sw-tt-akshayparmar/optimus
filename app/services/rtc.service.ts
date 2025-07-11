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
  socket = io("ws://localhost:5000");
  userId = Math.floor(Math.random()*100000).toString();
  user = username;
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
  socket?.on(
    Constants.PRIVATE_CHAT,
    (data: { userId: string; user: string; message: string }) => {
      console.log(data);
      if (data.userId !== userId) {
        callback(data);
      }
    }
  );
}
