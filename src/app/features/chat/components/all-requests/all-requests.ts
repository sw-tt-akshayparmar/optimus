import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Request } from '../../models/chat.models';
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../../../services/user.service';
import { NgOptimizedImage } from '@angular/common';
import { ToastService } from '../../../../services/toast.service';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-all-requests',
  standalone: true,
  imports: [NgOptimizedImage, MatIcon, MatIconButton],
  templateUrl: 'all-requests.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllRequests implements OnInit, OnDestroy {
  requests = signal<Request[]>([]);

  constructor(
    private readonly chatService: ChatService,
    protected readonly userService: UserService,
    private readonly toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.getAllRequests();
  }

  getAllRequests(): void {
    this.chatService.getAlRequests('all').subscribe({
      next: (res) => {
        this.requests.set(res.data.records);
      },
    });
  }
  ngOnDestroy(): void {}

  acceptRequest(request: Request) {
    this.chatService.processRequest(request, 'accept').subscribe({
      next: (res) => {
        this.toast.success(res.success, 'Request accepted successfully');
        this.getAllRequests();
      },
      error: (err) => {
        this.toast.error(err.error.error, 'Error accepting request');
      },
    });
  }
  rejectRequest(request: Request) {
    this.chatService.processRequest(request, 'reject').subscribe({
      next: (res) => {
        this.toast.success(res.success, 'Request rejected successfully');
        this.getAllRequests();
      },
      error: (err) => {
        this.toast.error(err.error.error, 'Error rejecting request');
      },
    });
  }
  cancelRequest(request: Request) {
    this.chatService.processRequest(request, 'cancel').subscribe({
      next: (res) => {
        this.toast.success(res.success, 'Request canceled successfully');
        this.getAllRequests();
      },
      error: (err) => {
        this.toast.error(err.error.error, 'Error canceling request');
      },
    });
  }
}
