import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { Game } from '../../lib/chess/game';
import { Move } from '../../lib/chess/move';
import { Chessboard, Tile } from '../../lib/chess/chessboard';
import Config from '../../lib/chess/chess.config';
import { CommonModule, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import 'jquery';
// import * as $ from 'jquery';
import { PiecePosition, PieceType } from '../../lib/chess/chess.types';
import { ChessData, IChessData } from '../../data/chess.data';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';

declare let $: any;

@Component({
  selector: 'app-chessboard',
  standalone: true,
  templateUrl: './chessboard.component.html',
  styleUrl: './chessboard.component.scss',
  imports: [CommonModule, CdkDrag, CdkDropList, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChessboardComponent {
  protected game: Game;
  protected chessboard: Chessboard;
  protected board: Array<Array<{ color: boolean; piece: PieceType } | null>>;
  protected orientation: boolean = true;
  protected config = Config;
  protected appData: IChessData = ChessData;
  protected moveMap: boolean[][] | null = null;
  protected move: Move = new Move(true);
  protected readonly isBrowser: boolean;
  protected data: Array<any> = [];

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private cdRef: ChangeDetectorRef,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.game = new Game();
    this.chessboard = this.game.getBoard();
    this.board = this.config.initialPosition;
    this.updateBoard();
  }

  updateBoard(): boolean {
    this.chessboard.board.forEach((rank: Tile[], i: number) => {
      rank.forEach((tile: Tile, j: number) => {
        if (tile.piece) {
          this.board[i][j] = { color: tile.piece.getColor(), piece: tile.piece.getType() };
        } else {
          this.board[i][j] = null;
        }
      });
    });
    return false;
  }

  ngOnInit() {}

  ngAfterViewChecked(): void {
    this.jqueryRerender();
  }

  jqueryRerender() {
    $('.piece').draggable({
      containment: 'table.grid#chessgrid',
      revert: true,
    });
  }

  onPieceGrab(x: number, y: number): boolean {
    if (!this.chessboard.board[x][y].piece) {
      return false;
    }
    const color = this.chessboard.board[x][y].piece!.getColor();
    this.moveMap = this.game.getMoveMapFor(x, y, color);
    this.move = new Move(color);
    this.move.setSrc(x as PiecePosition, y as PiecePosition);
    this.moveMap.forEach((rank, i) => {
      rank.forEach((tile, j) => {
        if (tile) {
          $(`#${i}-${j}`).droppable({
            drop: (e: any, ui: any) => {
              this.drop(i as PiecePosition, j as PiecePosition);
            },
          });
          $(`#${i}-${j} > .mark`).css({
            display: 'flex',
          });
        } else {
          try {
            $(`#${i}-${j} > .mark`).css({
              display: 'none',
            });
            $(`#${i}-${j}`).droppable('destroy');
          } catch (err) {}
        }
      });
    });
    return true;
  }

  clearMovableTiles() {
    $(`td.tile > .mark`).css({
      display: 'none',
    });
    try {
      $(`td.tile > .mark`).droppable('destroy');
    } catch (err) {}

    this.moveMap = null;
  }

  drop(x: PiecePosition, y: PiecePosition) {
    this.clearMovableTiles();
    this.move.setDest(x, y);
    this.moveTo(this.move);
    this.cdRef.detectChanges();
  }

  moveTo(move: Move = this.move): Move {
    const ret: Move = this.game.move(move);
    this.updateBoard();
    this.move.reset();
    return ret;
  }
  // drop(event: any, i: number, j: number) {
  //   console.log('event', event);
  // }
}
