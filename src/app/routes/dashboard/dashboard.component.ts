import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { User } from '../../models/User.model';
import { SocketService } from '../../socket/socket.service';
import { Events } from '../../socket/events.enum';

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
  liveUsers: User[] = [];
  uptime = '0h 0m';
  memoryUsage = '0 MB';
  logs: LogEntry[] = [];

  private readonly subscriptions: Subscription[] = [];

  constructor(
    private readonly socketService: SocketService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.checkSocketStatus();
    // this.subscribeToSocketEvents();

    this.addLog('Dashboard initialized');
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private checkSocketStatus() {
    this.socketConnected = !!this.socketId;
  }

  // private subscribeToSocketEvents() {
  //   this.subscriptions.push(
  //     this.socketService.on(Events.CONNECT).subscribe(() => {
  //       this.socketConnected = true;
  //       this.transport = 'WebSocket'; // Assumption
  //       this.addLog('Socket connected');
  //       this.cdr.detectChanges();
  //     }),
  //   );
  //
  //   this.subscriptions.push(
  //     this.socketService.on(Events.DISCONNECT).subscribe(() => {
  //       this.socketConnected = false;
  //       this.addLog('Socket disconnected');
  //       this.cdr.detectChanges();
  //     }),
  //   );
  //
  //   this.subscriptions.push(
  //     this.socketService.on('server-stats').subscribe((stats: any) => {
  //       if (stats) {
  //         this.activeUsers = stats.activeUsers || this.activeUsers;
  //         this.liveUsers = (stats.users || []).map((u: any) => User.from(u));
  //         this.uptime = stats.uptime || this.uptime;
  //         this.memoryUsage = stats.memoryUsage || this.memoryUsage;
  //         this.cdr.detectChanges();
  //       }
  //     }),
  //   );
  //
  //   this.subscriptions.push(
  //     this.socketService.on(Events.MESSAGE_EVENT).subscribe((msg: any) => {
  //       this.addLog(`Message received: ${JSON.stringify(msg)}`);
  //     }),
  //   );
  // }

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
