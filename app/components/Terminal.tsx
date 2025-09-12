import React, { useEffect, useRef, useState, useCallback } from "react";

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
  maxLines = 1000,
}: {
  prompt?: string;
  welcome?: string;
  maxLines?: number;
}) {
  const [lines, setLines] = useState<Line[]>(() => []);
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
    return () => {
      shellClient.offData();
    };
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
    <div className="flex flex-col h-full min-h-[320px] max-h-[720px] w-full rounded-t-xl border-t shadow-lg">
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full inline-block bg-[red]" />
          <span className="h-3 w-3 rounded-full inline-block bg-[orange]" />
          <span className="h-3 w-3 rounded-full inline-block bg-[green]" />
          <div className="ml-2 text-sm font-medium opacity-90">terminal</div>
        </div>
        <div className="text-xs opacity-70">/ web • demo</div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3" ref={containerRef}>
        <div className="flex flex-col gap-2 font-mono text-sm">
          {lines.length === 0 && <div className="text-gray-400 italic">(cleared)</div>}
          {lines.map(ln => (
            <div
              key={ln.id}
              className={
                ln.type === "input"
                  ? "text-teal-300"
                  : ln.type === "output"
                    ? "text-gray-200"
                    : ln.type === "system"
                      ? "text-amber-300 italic"
                      : ""
              }
            >
              {ln.text}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-3 py-2">
        <div className="flex items-center gap-3">
          <div className="font-mono text-sm text-teal-300">{prompt}</div>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="type a command..."
            className="flex-1 bg-grey outline-none font-mono text-sm text-inherit border-none placeholder:opacity-50"
            autoComplete="off"
            spellCheck={false}
            aria-label="Terminal input"
          />
        </div>
      </form>
    </div>
  );
}
