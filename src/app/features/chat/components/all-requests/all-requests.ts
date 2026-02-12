import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Request } from '../../models/chat.models';
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../../../services/user.service';
import { NgOptimizedImage } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatFabButton } from '@angular/material/button';

@Component({
  selector: 'app-all-requests',
  standalone: true,
  imports: [NgOptimizedImage, MatIcon, MatButton, MatFabButton],
  templateUrl: 'all-requests.html',
  // styleUrls: ['request.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllRequests implements OnInit, OnDestroy {
  requests = signal<Request[]>([]);

  constructor(
    private readonly chatService: ChatService,
    protected readonly userService: UserService,
  ) {}

  ngOnInit(): void {
    this.chatService.getAlRequests('all').subscribe({
      next: (res) => {
        console.log(res);
        this.requests.set(res.data.records);
      },
    });
  }

  ngOnDestroy(): void {}
}
