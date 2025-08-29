import React, { useEffect, useRef, useState } from "react";
import "./terminal.css";
import shellClient from "~/services/shell.service";
import * as userService from "~/services/user.service";

type Line = {
  id: string;
  text: string;
  type?: "input" | "output" | "system";
};

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export default function TerminalEmulator({
  prompt = `${userService.getUserData().username}@optimus:~$`,
  welcome = "Welcome to the simple terminal emulator. Type 'help' to start.",
  maxLines = 1000,
}: {
  prompt?: string;
  welcome?: string;
  maxLines?: number;
}) {
  const [lines, setLines] = useState<Line[]>(() => [
    { id: uid("sys"), text: welcome, type: "system", timetamp: Date.now() },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIndex, setHistIndex] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    scrollToBottom();
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
    shellClient.startShell();
    shellClient.onData((data: { timestamp: number; data: string }) => {
      data.data.split("\n").map(line => appendLine(line));
    });
  }, []);

  function scrollToBottom() {
    requestAnimationFrame(() => {
      if (!containerRef.current) return;
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    });
  }

  function appendLine(text: string, type: Line["type"] = "output") {
    setLines(prev => {
      const next = [...prev, { id: uid("ln"), text, type }];
      if (next.length > maxLines) next.splice(0, next.length - maxLines);
      return next;
    });
  }

  function runCommand(raw: string) {
    const cmd = raw.trim();
    if (!cmd) return;
    shellClient.send(cmd);

    // appendLine(`${prompt} ${cmd}`, "input");

    // const [name, ...args] = cmd.split(/\s+/);

    // switch (name.toLowerCase()) {
    //   case "help":
    //     appendLine("Built-in commands: help, clear, echo, date, about, history");
    //     break;
    //   case "clear":
    //     setLines([]);
    //     break;
    //   case "echo":
    //     appendLine(args.join(" ") || "");
    //     break;
    //   case "date":
    //     appendLine(new Date().toString());
    //     break;
    //   case "about":
    //     appendLine("Simple React terminal emulator — demo only.");
    //     break;
    //   case "history":
    //     appendLine(history.join("\n") || "(no history yet)");
    //     break;
    //   default:
    //     appendLine(`command not found: ${name}`);
    //     break;
    // }

    setHistory(h => [cmd, ...h].slice(0, 200));
    setHistIndex(null);
  }

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = input;
    if (!trimmed) return setInput("");
    runCommand(trimmed);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHistIndex(idx => {
        const next = idx === null ? 0 : Math.min(idx + 1, history.length - 1);
        const cmd = history[next] ?? "";
        setInput(cmd);
        return next;
      });
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHistIndex(idx => {
        if (idx === null) return null;
        const next = idx - 1;
        const cmd = next >= 0 ? history[next] : "";
        setInput(cmd);
        return next >= 0 ? next : null;
      });
    }

    if (e.ctrlKey && e.key.toLowerCase() === "c") {
      e.preventDefault();
      appendLine("^C", "system");
      setInput("");
    }
  }

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
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="type a command..."
            className="input-field"
            autoComplete="off"
            spellCheck={false}
          />

          <div className="buttons">
            <button
              type="button"
              onClick={() => {
                appendLine(prompt + " help", "input");
                appendLine("Built-in commands: help, clear, echo, date, about, history");
              }}
              className="btn"
            >
              Help
            </button>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(lines.map(l => l.text).join("\n")).catch(() => {});
              }}
              className="btn"
            >
              Copy
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
