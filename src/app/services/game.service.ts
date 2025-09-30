import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { SocketService } from './socket.service';
import Constants from '../constants/constants';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class GameService {
  constructor(
    private socket: SocketService,
    private apiService: ApiService,
  ) {}
  startMatch(): Observable<any> {
    // TODO: Replace with actual HTTP call
    return of({ id: Math.floor(Math.random() * 10000) });
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
