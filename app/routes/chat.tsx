import { useEffect, useRef, useState } from "react";
import rtClient from "../services/rtc.service";

import { useUser } from "./_authenticated";
import type { User } from "~/models/User.model";
import { Button } from "primereact/button";

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
    <div className="max-w-[480px] mx-auto bg-card rounded-xl shadow-nav p-6 flex flex-col min-h-[60vh]">
      <div className="text-xl font-bold text-primary text-center mb-4 tracking-wide">
        💬 Optimus Chat
      </div>
      <div className="flex-1 overflow-y-auto mb-4 bg-cardDark rounded-lg p-4 min-h-[220px]">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 text-base ${msg.user.id === user.id ? "text-chatSelf text-right" : "text-chatMsg"} `}
          >
            <span className="font-semibold text-primary mr-1">{msg.user.name}:</span> {msg.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="flex gap-2" onSubmit={handleSend}>
        <input
          className="flex-1 p-3 rounded border border-chatInputBorder text-base bg-chatInput text-chatMsg outline-none transition-colors focus:border-primary"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          autoFocus
          aria-label="Type a message"
        />
        <Button icon="pi pi-send" disabled={!input.trim()} />
      </form>
    </div>
  );
}
