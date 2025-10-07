import { Component, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { Game } from '../../lib/chess/game';
import { Move } from '../../lib/chess/move';
import { Chessboard } from '../../lib/chess/chessboard';
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
  protected chessboard!: Chessboard;
  protected config = Config;
  protected board = signal<IBoard>(this.config.INITIAL_POS);
  protected orientation: boolean = true;
  protected chessData: IChessData = ChessData;
  protected moveMap = signal<boolean[][] | null>(null);
  protected move: Move = new Move(true);
  protected readonly isBrowser: boolean;
  protected data: Array<any> = [];
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private gameService: GameService,
    private toast: ToastService,
    protected loader: LoaderService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.gameService.onMatch().subscribe({
      next: (game: GameMatch) => {
        this.loader.disable(LoaderActions.GAME_REQUEST);
        this.toast.success('Success', game.opponentId!);
      },
      error: (err) => {
        this.toast.error('Error', err.message);
      },
    });
    this.game = new Game();
    this.chessboard = this.game.getBoard();
    this.updateBoard();
  }

  updateBoard(): boolean {
    this.board.update((_b) => this.game.getPosition());
    return false;
  }

  onPieceGrab(event: any) {
    const src = event.source.data;
    const color = this.board()[src.x][src.y]!.color;
    const map = this.game.getMoveMapFor(src.x, src.y, color);

    this.moveMap.set(map);
  }

  moveTo(move: Move = this.move): Move {
    const ret: Move = this.game.move(move);
    this.updateBoard();
    this.move.reset();
    return ret;
  }
  drop(event: CdkDragDrop<any>) {
    const src: { x: IPosition; y: IPosition } = event.item.data;
    const dest: { x: IPosition; y: IPosition } = event.container.data;
    if (this.moveMap()?.[dest.x][dest.y]) {
      const color = this.board()[src.x][src.y]!.color;
      this.moveTo(new Move(color, src, dest));
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
