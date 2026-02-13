import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Request } from '../../models/chat.models';
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../../../services/user.service';
import { NgOptimizedImage } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-all-requests',
  standalone: true,
  imports: [NgOptimizedImage, MatIcon, MatMiniFabButton],
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
      },
      error: (err) => {
        this.toast.error(err.error.error, 'Error canceling request');
      },
    });
  }
}
