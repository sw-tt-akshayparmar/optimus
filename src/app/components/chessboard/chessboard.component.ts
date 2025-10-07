import { Component, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { Game } from '../../lib/chess/game';
import { Move } from '../../lib/chess/move';
import Config from '../../lib/chess/chess.config';
import { CommonModule, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { IBoard, IPosition } from '../../lib/chess/chess.types';
import { ChessData, IChessData } from '../../data/chess.data';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { GameService } from '../../services/game.service';
import { ToastService } from '../../services/toast.service';
import { MatFabButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { LoaderService } from '../../services/loader.service';
import LoaderActions from '../../enums/loader.enum';
import { GameMatch } from '../../models/game/GameMatch.model';
import { MoveType, PLAYER } from '../../lib/chess/games.enum';
import { UserService } from '../../services/user.service';
import { Game as GameModel } from '../../models/game/Game.model';

@Component({
  selector: 'app-chessboard',
  standalone: true,
  templateUrl: './chessboard.component.html',
  styleUrl: './chessboard.component.scss',
  imports: [
    CommonModule,
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    MatProgressBar,
    MatFabButton,
    NgOptimizedImage,
  ],
})
export class ChessboardComponent implements OnInit {
  protected game!: Game;
  protected config = Config;
  protected board = signal<IBoard>(this.config.INITIAL_POS);
  protected orientation: boolean = true;
  protected chessData: IChessData = ChessData;
  protected playAs: boolean = true;
  protected turn = signal<boolean>(true);
  protected moveMap = signal<boolean[][] | null>(null);
  protected readonly isBrowser: boolean;
  protected match!: GameMatch;
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private gameService: GameService,
    private toast: ToastService,
    private userService: UserService,
    protected loader: LoaderService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.gameService.onMatch().subscribe({
      next: (match: GameMatch) => {
        this.match = match;
        this.loader.disable(LoaderActions.GAME_REQUEST);
        this.toast.success('Success', match.game?.id!);
        this.game = new Game(Config.INITIAL_POS, match.turn);
        this.playAs = match.game?.playerW === this.userService.getUserData()?.id;
        this.turn.set(match.turn === PLAYER.WHITE);
      },
      error: (err) => {
        this.toast.error('Error', err.message);
      },
    });
    this.gameService.onMoves().subscribe({
      next: (m: { game: GameModel; move: Move }) => {
        console.log('move', m.move);
        this.toast.success('Moved', '');
        this.moveTo(m.move);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  updateBoard(): boolean {
    this.board.set(this.game.getPosition());
    return false;
  }

  onPieceGrab(event: any) {
    const src = event.source.data;
    const color = this.board()[src.x][src.y]!.color;
    const map = this.game.getMoveMapFor(src.x, src.y, color);
    console.log(src);

    this.moveMap.set(map);
  }

  moveTo(move: Move, send?: boolean): Move {
    const moved: Move = this.game.move(move);
    if (
      moved.type !== MoveType.ILLEGAL_MOVE &&
      moved.type !== MoveType.NOT_APPLICABLE &&
      moved.type !== MoveType.WRONG_PLAYER
    ) {
      if (send)
        this.gameService.sendMove({
          game: this.match.game!,
          move,
        });
      this.turn.update((t) => !t);
    }
    console.log(this);
    console.log(this.turn());
    this.updateBoard();
    return moved;
  }
  drop(event: CdkDragDrop<any>) {
    const src: { x: IPosition; y: IPosition } = event.item.data;
    const dest: { x: IPosition; y: IPosition } = event.container.data;
    if (this.playAs === this.turn() && this.moveMap()?.[dest.x][dest.y]) {
      const color = this.board()[src.x][src.y]!.color;
      this.moveTo(new Move(color, src, dest), true);
    }
    this.moveMap.set(null);
  }

  startGame() {
    this.loader.enable(LoaderActions.GAME_REQUEST);
    this.gameService.startMatch().subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  protected readonly LoaderActions = LoaderActions;
}
