import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/User.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatLabel, MatPrefix } from '@angular/material/input';
import { ChatService } from '../../services/chat.service';
import { ToastService } from '../../../../services/toast.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-request',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButton,
    MatIcon,
    MatInput,
    MatFormField,
    MatLabel,
    MatPrefix,
    NgOptimizedImage,
  ],
  templateUrl: 'request.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Request implements OnInit, OnDestroy {
  records = signal<{ user: User; invited: boolean }[]>([]);

  form!: FormGroup;
  t?: NodeJS.Timeout;
  s?: Subscription;
  constructor(
    private readonly userService: UserService,
    private readonly formBuilder: FormBuilder,
    private readonly chatService: ChatService,
    private readonly toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group<{ search: string }>({
      search: '',
    });
  }

  ngOnDestroy(): void {}

  searchUsers(event: any) {
    if (this.t) {
      clearTimeout(this.t);
    }
    if (this.form.value.search?.trim?.())
      this.t = setTimeout(() => {
        this.s = this.userService.getAllUsers(this.form.value.search.trim()).subscribe({
          next: (res) => {
            this.records.set(res.data.records.map((user: User) => ({ user, invited: false })));
          },
        });
      }, 250);
  }

  inviteUser(user: User, index: number) {
    this.chatService.sendRequest(user.id).subscribe({
      next: (res) => {
        this.toastService.success(res.success, 'Invite sent successfully');
        this.records.update((records) => {
          records[index].invited = true;
          return [...records];
        });
      },
      error: (err) => {
        this.toastService.error(err.error.error, 'Error sending invite');
      },
    });
  }
}
