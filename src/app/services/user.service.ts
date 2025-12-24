import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { User } from '../models/User.model';
import { ApiService } from './api.service';
import APIConfig from '../config/api.config';
import { catchError, map, of, throwError } from 'rxjs';
import { SuccessResponse } from '../models/Response.model';
import { AuthToken } from '../models/Auth.model';
import storageConstants from '../constants/storage.constants';
import { Exception } from '../exception/app.exception';
import ErrorCode from '../enums/error.enum';
import { SocketService } from './socket.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class UserService {
  private platformId = inject(PLATFORM_ID);

  constructor(
    private apiService: ApiService,
    private socketService: SocketService,
  ) {}
  login(data: { username: string; password: string }) {
    return this.apiService.post<AuthToken>(APIConfig.LOGIN, data).pipe(
      map<SuccessResponse<AuthToken>, User>((res) => {
        this.socketService.auth(res.data.accessToken, this.getConnectionId() ?? undefined);
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

  register(data: { name: string; username: string; password: string }) {
    return this.apiService.post<AuthToken>(APIConfig.REGISTER, data).pipe(
      map<SuccessResponse<AuthToken>, User>((res) => {
        this.socketService.auth(res.data.accessToken, this.getConnectionId() ?? undefined);
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

  setConnectionId(connectionId: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(storageConstants.CONNECTION_ID, connectionId);
    }
  }
  setUserData(user: User) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(storageConstants.USER_DATA, JSON.stringify(user));
    }
  }
  setAccessToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(storageConstants.AUTHORIZATION_TOKEN, token);
    }
  }
  setRefreshToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(storageConstants.REFRESH_TOKEN, token);
    }
  }
  getConnectionId() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(storageConstants.CONNECTION_ID);
    }
    return null;
  }
  getUserData(): User | null {
    if (isPlatformBrowser(this.platformId)) {
      const userJSON = localStorage.getItem(storageConstants.USER_DATA);
      return userJSON ? User.from(JSON.parse(userJSON)) : null;
    }
    return null;
  }
  getAccessToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(storageConstants.AUTHORIZATION_TOKEN);
    }
    return null;
  }
  getRefreshToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(storageConstants.REFRESH_TOKEN);
    }
    return null;
  }
}
