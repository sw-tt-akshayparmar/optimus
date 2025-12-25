import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { SocketService } from './socket.service';
import Constants from '../constants/constants';
import { ApiService } from './api.service';
import APIConfig from '../config/api.config';
import { UserService } from './user.service';
import { ErrorResponse, SuccessResponse } from '../models/Response.model';
import { GameMatch } from '../models/game/GameMatch.model';
import { Game as GameModel } from '../models/game/Game.model';
import { Move } from '../lib/chess/move';

@Injectable({ providedIn: 'root' })
export class GameService {
  constructor(
    private socket: SocketService,
    private apiService: ApiService,
    private userService: UserService,
  ) {}
  startMatch(): Observable<any> {
    return this.apiService.post(APIConfig.GAME_MATCH, null, null, {
      socketId: this.userService.getSocketId()!,
    });
    // .pipe(
    //   tap({
    //     next: (res: SuccessResponse<GameMatch>) => {},
    //     error: (err: ErrorResponse) => {
    //       console.log(err);
    //     },
    //   }),
    // );
  }
  onMoves() {
    return this.socket.on<{ game: GameModel; move: Move }>(Constants.GAME_MOVE);
    // .pipe(
    //   tap({
    //     next: (m: { game: GameModel; move: Move }) => {
    //       console.log(m);
    //     },
    //     error: (err) => {
    //       console.log(err);
    //     },
    //   }),
    // );
  }
  onMatch() {
    return this.socket.on<GameMatch>(Constants.MATCH_FOUND);
    //   .pipe(
    //   tap({
    //     next: (match: GameMatch) => {
    //       console.log(match);
    //     },
    //     error: (err) => {
    //       console.log(err);
    //     },
    //   }),
    // );
  }
  sendMove(move: { game: GameModel; move: Move }) {
    this.socket.emit(Constants.GAME_MOVE, move);
  }
}
