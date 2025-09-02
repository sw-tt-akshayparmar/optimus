import React, { useEffect, useRef, useState, useCallback } from "react";
import "./terminal.css";
import shellClient from "~/services/shell.service";
import * as userService from "~/services/user.service";

type Line = {
  id: string;
  text: string;
  type: "input" | "output" | "system";
  timestamp?: number;
};

export default function Terminal({
  prompt = `${userService.getUserData().username}@optimus:~$`,
  welcome = "Welcome to the simple terminal emulator. Type 'help' to start.",
  maxLines = 1000,
}: {
  prompt?: string;
  welcome?: string;
  maxLines?: number;
}) {
  const [lines, setLines] = useState<Line[]>(() => [
    { id: crypto.randomUUID(), text: welcome, type: "system", timestamp: Date.now() },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    });
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
    const handleShellData = (data: { timestamp: number; data: string }) => {
      data.data.split("\n").forEach(line => {
        if (line.trim()) {
          appendLine(line, "output", data.timestamp);
        }
      });
    };
    shellClient.onData(handleShellData);
  }, []);

  const appendLine = useCallback(
    (text: string, type: Line["type"] = "output", timestamp?: number) => {
      setLines(prev => {
        const next = [...prev, { id: crypto.randomUUID(), text, type, timestamp }];
        if (next.length > maxLines) next.splice(0, next.length - maxLines);
        return next;
      });
    },
    [maxLines]
  );

  const runCommand = useCallback(
    (raw: string) => {
      const cmd = raw.trim();
      if (!cmd) return;
      appendLine(`${prompt} ${cmd}`, "input", Date.now());
      shellClient.send(cmd);
      setHistory(h => [cmd, ...h].slice(0, 200));
    },
    [appendLine, prompt]
  );

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!input.trim()) return setInput("");
      runCommand(input);
      setInput("");
    },
    [input, runCommand]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
      }
      if (e.ctrlKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        appendLine("^C", "system", Date.now());
        setInput("");
      }
    },
    [handleSubmit, history, appendLine]
  );

  return (
    <div className="terminal">
      <div className="terminal-header">
        <div className="terminal-header-left">
          <span className="dot red" />
          <span className="dot amber" />
          <span className="dot green" />
          <div className="terminal-title">terminal</div>
        </div>
        <div className="terminal-subtitle">/ web • demo</div>
      </div>

      <div className="terminal-body" ref={containerRef}>
        <div className="terminal-lines">
          {lines.length === 0 && <div className="cleared">(cleared)</div>}
          {lines.map(ln => (
            <div key={ln.id} className={`line ${ln.type}`}>
              {ln.text}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="terminal-input-form">
        <div className="input-wrapper">
          <div className="prompt">{prompt}</div>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="type a command..."
            className="input-field"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </form>
    </div>
  );
}
