import { Injectable, signal, WritableSignal } from '@angular/core';
import { User } from '../models/User.model';
import { ApiService } from './api.service';
import { LoaderService } from './loader.service';
import APIConfig from '../config/api.config';
import LoaderActions from '../enums/loader.enum';
import { AuthToken } from '../models/Auth.model';
import { Exception } from '../exception/app.exception';
import { ToastService } from './toast.service';
import { finalize } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _auth: WritableSignal<AuthToken | Exception | null> = signal(null);
  constructor(
    private apiService: ApiService,
    private loaderService: LoaderService,
    private toast: ToastService,
  ) {}
  login(data: { username: string; password: string }) {
    const apiCall$ = this.apiService.post<User>(APIConfig.LOGIN, data);
    if (apiCall$) {
      this.loaderService.enable(LoaderActions.LOG_IN);
      apiCall$.pipe(finalize(() => this.loaderService.disable(LoaderActions.LOG_IN))).subscribe({
        next: (res) => {
          this.toast.success('Success', res.success);
          console.log(res);
        },
        error: (err: Error) => {
          console.log(err);
          this.toast.error('Error', err.message);
        },
      });
    } else {
      console.log('API call failed');
      this.toast.error('Error', 'Error');
    }
  }

  register(name: string, username: string, password: string) {}

  readonly auth = this._auth.asReadonly();
}
