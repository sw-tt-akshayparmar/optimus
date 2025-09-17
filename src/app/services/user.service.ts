import { Injectable } from '@angular/core';
import { User } from '../models/User.model';
import { ApiService } from './api.service';
import { LoaderService } from './loader.service';
import APIConfig from '../config/api.config';
import LoaderActions from '../enums/loader.enum';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private apiService: ApiService,
    private loaderService: LoaderService,
  ) {}
  login(data: { username: string; password: string }) {
    this.loaderService.enable(LoaderActions.LOG_IN);
    this.apiService.post<User>(APIConfig.LOGIN, data).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.loaderService.disable(LoaderActions.LOG_IN);
      },
    });
  }

  register(name: string, username: string, password: string) {}
}
