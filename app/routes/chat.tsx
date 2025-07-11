import { useEffect, useRef, useState } from "react";
import {
  connect,
  disconnect,
  onRecive,
  send,
  onRegister,
} from "../services/rtc.service";
import "./chat.css";
import Constants from "~/constants/constants";

export default function Chat() {
  const [messages, setMessages] = useState<
    { userId: string; user: string; message: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const onReciveCallback = (message: {
    user: string;
    userId: string;
    message: string;
  }) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const onRegisterCallback = (data: { user: string }) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { user: data.user, message: "has Joined", userId: "" },
    ]);
  };

  useEffect(() => {
    if (!joined) return;
    connect(username);
    onRecive(onReciveCallback);
    onRegister(onRegisterCallback);
    return disconnect;
  }, [joined]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim()) {
      send(input);
      setInput("");
    }
  }

  function handleJoin() {
    if (username.trim()) setJoined(true);
  }

  if (!joined) {
    return (
      <div className="chat-join-container">
        <div className="chat-join-box">
          <h2 style={{ color: "#60a5fa", marginBottom: "1rem" }}>Join Chat</h2>
          <input
            className="chat-join-input"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && username.trim() && setJoined(true)
            }
            autoFocus
            aria-label="Enter your name"
          />
          <button
            className="chat-join-btn"
            onClick={handleJoin}
            disabled={!username.trim()}
            type="button"
          >
            Join
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">💬 Optimus Chat</div>
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-message${msg.userId === localStorage.getItem(Constants.USER_ID) ? " self" : ""}`}
          >
            <span className="chat-user">{msg.user}:</span> {msg.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="chat-input-row" onSubmit={handleSend}>
        <input
          className="chat-input"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
          aria-label="Type a message"
        />
        <button
          className="chat-send-btn"
          type="submit"
          disabled={!input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}
