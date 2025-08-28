import React, { useEffect, useRef, useState } from "react";
import "./terminal.css"

// Simple Terminal Emulator React component (single-file)
// - Tailwind CSS for styling (no imports required)
// - Default export
// - Features: command history, up/down navigation, built-in commands: help, clear, echo, date, about

type Line = {
  id: string;
  text: string;
  type?: "input" | "output" | "system";
};

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export default function TerminalEmulator({
  prompt = "user@web:~$",
  welcome = "Welcome to the simple terminal emulator. Type 'help' to start.",
  maxLines = 1000,
}: {
  prompt?: string;
  welcome?: string;
  maxLines?: number;
}) {
  const [lines, setLines] = useState<Line[]>(() => [
    { id: uid("sys"), text: welcome, type: "system" },
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
    // focus input on mount
    inputRef.current?.focus();
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
      // trim
      if (next.length > maxLines) next.splice(0, next.length - maxLines);
      return next;
    });
  }

  function runCommand(raw: string) {
    const cmd = raw.trim();
    if (!cmd) return;

    // show the input
    appendLine(`${prompt} ${cmd}`, "input");

    const [name, ...args] = cmd.split(/\s+/);

    switch (name.toLowerCase()) {
      case "help":
        appendLine("Built-in commands: help, clear, echo, date, about, history");
        break;
      case "clear":
        setLines([]);
        break;
      case "echo":
        appendLine(args.join(" ") || "");
        break;
      case "date":
        appendLine(new Date().toString());
        break;
      case "about":
        appendLine("Simple React terminal emulator — demo only.");
        break;
      case "history":
        appendLine(history.join("\n") || "(no history yet)");
        break;
      default:
        appendLine(`command not found: ${name}`);
        break;
    }

    // record history
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
      // navigate history backward
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
      // Ctrl+C behavior: print newline + ^C
      e.preventDefault();
      appendLine("^C", "system");
      setInput("");
    }
  }

  return (
    <div className="flex h-full min-h-[320px] max-h-[720px] w-full flex-col rounded-2xl border bg-gray-900 text-gray-100 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-gray-800 px-3 py-2">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-lime-500" />
          <div className="ml-2 text-sm font-medium opacity-90">terminal</div>
        </div>
        <div className="text-xs opacity-70">/ web • demo</div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto px-4 py-3" ref={containerRef}>
        <div className="space-y-2 font-mono text-sm">
          {lines.length === 0 && <div className="text-gray-400 italic">(cleared)</div>}

          {lines.map(ln => (
            <div
              key={ln.id}
              className={`whitespace-pre-wrap ${ln.type === "input" ? "text-teal-300" : ln.type === "system" ? "text-amber-300 italic" : "text-gray-200"}`}
            >
              {ln.text}
            </div>
          ))}
        </div>
      </div>

      {/* Prompt */}
      <form onSubmit={handleSubmit} className="border-t border-gray-800 px-3 py-2">
        <div className="flex items-center gap-3">
          <div className="font-mono text-sm text-teal-300">{prompt}</div>

          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="type a command..."
            className="flex-1 bg-transparent outline-none placeholder:opacity-50 font-mono text-sm"
            autoComplete="off"
            spellCheck={false}
          />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                // quick help
                appendLine(prompt + " help", "input");
                appendLine("Built-in commands: help, clear, echo, date, about, history");
              }}
              className="text-xs rounded px-2 py-1 hover:bg-gray-800"
            >
              Help
            </button>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(lines.map(l => l.text).join("\n")).catch(() => {});
              }}
              className="text-xs rounded px-2 py-1 hover:bg-gray-800"
            >
              Copy
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
