import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketService } from '../../services/socket.service';
import { Subscription } from 'rxjs';
import Constants from '../../constants/constants';
import storageConstants from '../../constants/storage.constants';

interface LogEntry {
  timestamp: Date;
  message: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  socketConnected = false;
  socketId: string | null = null;
  transport = 'Polling';
  activeUsers = 0;
  uptime = '0h 0m';
  memoryUsage = '0 MB';
  logs: LogEntry[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private socketService: SocketService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.checkSocketStatus();
    this.subscribeToSocketEvents();

    // Simulate some initial logs
    this.addLog('Dashboard initialized');
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private checkSocketStatus() {
    // In a real app, we might need to expose the socket instance or status from SocketService
    // For now, we'll rely on events and local storage
    this.socketConnected = !!this.socketId;
  }

  private subscribeToSocketEvents() {
    this.subscriptions.push(
      this.socketService.on(Constants.CONNECT).subscribe(() => {
        this.socketConnected = true;
        this.transport = 'WebSocket'; // Assumption
        this.addLog('Socket connected');
        this.cdr.detectChanges();
      }),
    );

    this.subscriptions.push(
      this.socketService.on(Constants.DISCONNECT).subscribe(() => {
        this.socketConnected = false;
        this.addLog('Socket disconnected');
        this.cdr.detectChanges();
      }),
    );

    this.subscriptions.push(
      this.socketService.on('server-stats').subscribe((stats: any) => {
        if (stats) {
          this.activeUsers = stats.activeUsers || this.activeUsers;
          this.uptime = stats.uptime || this.uptime;
          this.memoryUsage = stats.memoryUsage || this.memoryUsage;
          this.cdr.detectChanges();
        }
      }),
    );

    // Listen for general messages to log
    this.subscriptions.push(
      this.socketService.on(Constants.MESSAGE_EVENT).subscribe((msg: any) => {
        this.addLog(`Message received: ${JSON.stringify(msg)}`);
      }),
    );
  }

  private addLog(message: string) {
    this.logs.unshift({
      timestamp: new Date(),
      message,
    });
    if (this.logs.length > 50) {
      this.logs.pop();
    }
  }
}
