import { Injectable } from '@angular/core';
import { User } from '../models/User.model';
import { ApiService } from './api.service';
import APIConfig from '../config/api.config';
import { catchError, map, throwError } from 'rxjs';
import { SuccessResponse } from '../models/Response.model';
import { AuthToken } from '../models/Auth.model';
import storageConstants from '../constants/storage.constants';
import { Exception } from '../exception/app.exception';
import ErrorCode from '../enums/error.enum';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private apiService: ApiService) {}
  login(data: { username: string; password: string }) {
    return this.apiService.post<AuthToken>(APIConfig.LOGIN, data).pipe(
      map<SuccessResponse<AuthToken>, User>((res) => {
        this.setAccessToken(res.data.accessToken);
        this.setRefreshToken(res.data.refreshToken);
        this.setUserData(res.data.user);
        return res.data.user!;
      }),
      catchError((err) => {
        let exception: Exception;
        if (err.status === 0) {
          exception = new Exception(ErrorCode.NETWORK_ERROR, 'Network Error', err);
        } else {
          exception = new Exception(err.error.code, err.error.error, err.error);
        }
        return throwError(() => exception);
      }),
    );
  }

  register(name: string, username: string, password: string) {}

  setConnectionId(connectionId: string) {
    localStorage.setItem(storageConstants.CONNECTION_ID, connectionId);
  }
  setUserData(user: User) {
    localStorage.setItem(storageConstants.USER_DATA, JSON.stringify(user));
  }
  setAccessToken(token: string) {
    localStorage.setItem(storageConstants.AUTHORIZATION_TOKEN, token);
  }
  setRefreshToken(token: string) {
    localStorage.setItem(storageConstants.REFRESH_TOKEN, token);
  }
  getConnectionId() {
    localStorage.getItem(storageConstants.CONNECTION_ID);
  }
  getUserData(user: User): User | null {
    const userJSON = localStorage.getItem(storageConstants.USER_DATA);
    return userJSON ? User.from(JSON.parse(userJSON)) : null;
  }
  getAccessToken(token: string): string | null {
    return localStorage.getItem(storageConstants.AUTHORIZATION_TOKEN);
  }
  getRefreshToken(token: string): string | null {
    return localStorage.getItem(storageConstants.REFRESH_TOKEN);
  }
}
