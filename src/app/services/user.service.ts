import { Injectable, signal, WritableSignal } from '@angular/core';
import { User } from '../models/User.model';
import { ApiService } from './api.service';
import { LoaderService } from './loader.service';
import APIConfig from '../config/api.config';
import LoaderActions from '../enums/loader.enum';
import { AuthToken } from '../models/Auth.model';
import { Exception } from '../exception/app.exception';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _auth: WritableSignal<AuthToken | Exception | null> = signal(null);
  constructor(
    private apiService: ApiService,
    private loaderService: LoaderService,
  ) {}
  login(data: { username: string; password: string }) {
    this.loaderService.enable(LoaderActions.LOG_IN);
    this.apiService.post<User>(APIConfig.LOGIN, data).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('API call completed');
        this.loaderService.disable(LoaderActions.LOG_IN);
      },
    });
  }

  register(name: string, username: string, password: string) {}

  readonly auth = this._auth.asReadonly();
}
