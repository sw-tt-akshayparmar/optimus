import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { User } from '../models/User.model';
import { ApiService } from './api.service';
import APIConfig from '../config/api.config';
import { catchError, map, throwError } from 'rxjs';
import { SuccessResponse } from '../models/Response.model';
import { AuthToken } from '../models/Auth.model';
import { Exception } from '../exception/app.exception';
import ErrorCode from '../enums/error.enum';
import { isPlatformBrowser } from '@angular/common';
import { SocketService } from '../socket/socket.service';
import Keys from '../enums/keys.enum';
import { RecordModel } from '../models/record.model';
import { Utils } from '../utils/utils';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly platformId = inject(PLATFORM_ID);

  constructor(
    private readonly apiService: ApiService,
    private readonly socketService: SocketService,
    private readonly utils: Utils,
  ) {}
  login(data: { username: string; password: string }) {
    return this.apiService.post<AuthToken>(APIConfig.LOGIN, data).pipe(
      map<SuccessResponse<AuthToken>, User>((res) => {
        this.socketService.auth(res.data.accessToken, this.getSocketId() ?? undefined);
        this.setAccessToken(res.data.accessToken);
        this.setRefreshToken(res.data.refreshToken);
        this.setUserData(res.data.user);
        return res.data.user;
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
        this.socketService.auth(res.data.accessToken, this.getSocketId() ?? undefined);
        this.setAccessToken(res.data.accessToken);
        this.setRefreshToken(res.data.refreshToken);
        this.setUserData(res.data.user);
        return res.data.user;
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

  getAllUsers(search?: string, pageNumber?: number, pageSize?: number) {
    const { page, size } = this.utils.page(pageNumber, pageSize);
    return this.apiService.get<RecordModel<User>>(APIConfig.USERS, null, { page, size, search });
  }

  setUserData(user: User) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(Keys.USER_DATA, JSON.stringify(user));
    }
  }
  setAccessToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(Keys.AUTHORIZATION_TOKEN, token);
    }
  }
  setRefreshToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(Keys.REFRESH_TOKEN, token);
    }
  }
  getSocketId() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(Keys.SOCKET_ID);
    }
    return null;
  }
  getUserData(): User | null {
    if (isPlatformBrowser(this.platformId)) {
      const userJSON = localStorage.getItem(Keys.USER_DATA);
      return userJSON ? User.from(JSON.parse(userJSON)) : null;
    }
    return null;
  }
  getAccessToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(Keys.AUTHORIZATION_TOKEN);
    }
    return null;
  }
  getRefreshToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(Keys.REFRESH_TOKEN);
    }
    return null;
  }
  isLoggedIn() {
    return !!this.getAccessToken();
  }
  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(Keys.AUTHORIZATION_TOKEN);
      localStorage.removeItem(Keys.REFRESH_TOKEN);
      localStorage.removeItem(Keys.SOCKET_ID);
      localStorage.removeItem(Keys.USER_DATA);
    }
  }
}
