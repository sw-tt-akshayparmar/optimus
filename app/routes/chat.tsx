import { useEffect, useRef, useState } from "react";
import rtClient from "../services/rtc.service";
import "./chat.css";
import { useUser } from "./_authenticated";
import type { User } from "~/models/User.model";

export default function Chat() {
  const { user } = useUser();
  const [messages, setMessages] = useState<{ message: string; user: User }[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const onReceiveCallback = (data: { user: User; message: string }) => {
    setMessages(prevMessages => [...prevMessages, data]);
  };

  const onRegisterCallback = (user: User) => {
    setMessages(prevMessages => [...prevMessages, { user: user, message: "has Joined" }]);
  };

  useEffect(() => {
    rtClient.register();
    rtClient.onReceive(onReceiveCallback);
    rtClient.onRegister(onRegisterCallback);

    return () => rtClient.unregister();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim()) {
      rtClient.send(input);
      setInput("");
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-header">💬 Optimus Chat</div>
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message${msg.user.id === user.id ? " self" : ""}`}>
            <span className="chat-user">{msg.user.name}:</span> {msg.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="chat-input-row" onSubmit={handleSend}>
        <input
          className="chat-input"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          autoFocus
          aria-label="Type a message"
        />
        <button className="chat-send-btn" type="submit" disabled={!input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
