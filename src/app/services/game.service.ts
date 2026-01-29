import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import APIConfig from '../config/api.config';
import { UserService } from './user.service';
import { GameMatch } from '../models/game/GameMatch.model';
import { Game as GameModel } from '../models/game/Game.model';
import { Move } from '../lib/chess/move';
import { Events } from '../socket/events.enum';
import { SocketService } from '../socket/socket.service';

@Injectable({ providedIn: 'root' })
export class GameService {
  constructor(
    private readonly socket: SocketService,
    private readonly apiService: ApiService,
    private readonly userService: UserService,
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
    return this.socket.on<{ game: GameModel; move: Move }>(Events.GAME_MOVE);
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
    return this.socket.on<GameMatch>(Events.MATCH_FOUND);
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
    // TODO Temporary @ts-ignore
    // @ts-ignore
    this.socket.emit(Events.GAME_MOVE, move);
  }
}
