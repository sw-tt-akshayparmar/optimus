import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { SocketService } from './socket.service';
import Constants from '../constants/constants';
import { ApiService } from './api.service';
import APIConfig from '../config/api.config';
import { UserService } from './user.service';
import { ErrorResponse, SuccessResponse } from '../models/Response.model';

@Injectable({ providedIn: 'root' })
export class GameService {
  constructor(
    private socket: SocketService,
    private apiService: ApiService,
    private userService: UserService,
  ) {}
  startMatch(): Observable<any> {
    return this.apiService
      .post(APIConfig.GAME_MATCH, null, null, {
        connectionId: this.userService.getConnectionId()!,
      })
      .pipe(
        tap({
          next: (data: SuccessResponse) => {
            console.log(data);
          },
          error: (err: ErrorResponse) => {
            console.log(err);
          },
        }),
      );
  }
  onMoves() {
    return this.socket.on(Constants.GAME_MOVE).pipe(
      tap({
        next: (data) => {
          console.log(data);
        },
        error: (err) => {
          console.log(err);
        },
      }),
    );
  }
  onMatch() {
    return this.socket.on(Constants.MATCH_FOUND).pipe(
      tap({
        next: (data) => {
          console.log(data);
        },
        error: (err) => {
          console.log(err);
        },
      }),
    );
  }
}
