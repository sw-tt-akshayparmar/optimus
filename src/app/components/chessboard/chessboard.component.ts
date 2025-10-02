import { Component, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { Game } from '../../lib/chess/game';
import { Move } from '../../lib/chess/move';
import { Chessboard, Tile } from '../../lib/chess/chessboard';
import Config from '../../lib/chess/chess.config';
import { CommonModule, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { PiecePosition, PieceType } from '../../lib/chess/chess.types';
import { ChessData, IChessData } from '../../data/chess.data';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { GameService } from '../../services/game.service';
import { ToastService } from '../../services/toast.service';
import { MatButton } from '@angular/material/button';

type BoardUI = Array<Array<{ color: boolean; piece: PieceType } | null>>;

@Component({
  selector: 'app-chessboard',
  standalone: true,
  templateUrl: './chessboard.component.html',
  styleUrl: './chessboard.component.scss',
  imports: [CommonModule, CdkDrag, CdkDropList, NgOptimizedImage, CdkDropListGroup, MatButton],
})
export class ChessboardComponent implements OnInit {
  protected game!: Game;
  protected chessboard!: Chessboard;
  protected config = Config;
  protected board = signal<BoardUI>(this.config.random);
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
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.gameService.onMatch().subscribe({
      next: (data: any) => {
        this.toast.success('Success', data.success);
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
    const newBoard = this.chessboard.board.map((rank: Tile[]) =>
      rank.map((tile: Tile) =>
        tile.piece
          ? { color: tile.piece.getColor(), piece: tile.piece.getType() as PieceType }
          : null,
      ),
    );
    this.board.set(newBoard);
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
    const src: { x: PiecePosition; y: PiecePosition } = event.item.data;
    const dest: { x: PiecePosition; y: PiecePosition } = event.container.data;
    if (this.moveMap()?.[dest.x][dest.y]) {
      const color = this.board()[src.x][src.y]!.color;
      this.moveTo(new Move(color, src, dest));
    }
    this.moveMap.set(null);
  }

  startGame() {
    this.gameService.startMatch().subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
