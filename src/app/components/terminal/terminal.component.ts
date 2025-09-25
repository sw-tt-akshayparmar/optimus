// terminal.component.ts
import { Component, ElementRef, effect, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserService } from '../../services/user.service';

type LineType = 'input' | 'output' | 'system';

interface Line {
  id: string;
  text: string;
  type: LineType;
  timestamp?: number;
}

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './terminal.component.html',
})
export class TerminalComponent {
  // --- Inputs / options
  maxLines = 1000;

  // --- Signals
  lines = signal<Line[]>([]);
  history = signal<string[]>([]);

  // --- FormControl for input
  inputCtrl = new FormControl('', { nonNullable: true });

  // --- Refs
  container = viewChild<ElementRef<HTMLDivElement>>('container');
  inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl');

  constructor(protected userService: UserService) {
    // auto-scroll on new lines
    effect(() => {
      this.lines();
      queueMicrotask(() => {
        const c = this.container()?.nativeElement;
        if (c) c.scrollTop = c.scrollHeight;
      });
    });

    // subscribe shell output
    // shellClient.onData(({ data, timestamp }: { data: string; timestamp: number }) => {
    //   data.split('\n').forEach((line) => {
    //     if (line.trim()) this.appendLine(line, 'output', timestamp);
    //   });
    // });
  }

  private appendLine(text: string, type: LineType = 'output', timestamp?: number) {
    this.lines.update((prev) => {
      const next = [...prev, { id: crypto.randomUUID(), text, type, timestamp }];
      return next.length > this.maxLines ? next.slice(-this.maxLines) : next;
    });
  }

  private runCommand(raw: string) {
    const cmd = raw.trim();
    if (!cmd) return;
    this.appendLine(`${this.userService.getUserData()?.username} ${cmd}`, 'input', Date.now());
    // shellClient.send(cmd);
    this.history.update((h) => [cmd, ...h].slice(0, 200));
  }

  handleSubmit() {
    const value = this.inputCtrl.value.trim();
    if (!value) {
      this.inputCtrl.setValue('');
      return;
    }
    this.runCommand(value);
    this.inputCtrl.setValue('');
  }

  handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.handleSubmit();
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      // TODO: implement history navigation
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      // TODO: implement history navigation
    }
    if (e.ctrlKey && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      this.appendLine('^C', 'system', Date.now());
      this.inputCtrl.setValue('');
    }
  }
}
