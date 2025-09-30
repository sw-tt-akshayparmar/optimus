import type { PiecePosition } from './chess.types';
import { MoveType } from './games.enum';

export class Move {
  xSrc: PiecePosition = -1;
  ySrc: PiecePosition = -1;
  xDest: PiecePosition = -1;
  yDest: PiecePosition = -1;

  type: MoveType = MoveType.NOT_APPLICABLE;
  player: boolean = true;

  constructor(
    player: boolean,
    src?: { x: PiecePosition; y: PiecePosition },
    dest?: { x: PiecePosition; y: PiecePosition },
  ) {
    this.player = player;
    this.init();

    if (src) {
      this.xSrc = src.x;
      this.ySrc = src.y;
    }
    if (dest) {
      this.xDest = dest.x;
      this.yDest = dest.y;
    }
  }

  init() {
    this.xSrc = -1;
    this.ySrc = -1;
    this.xDest = -1;
    this.yDest = -1;
  }

  setSrc(x: PiecePosition, y: PiecePosition): boolean {
    this.xSrc = x;
    this.ySrc = y;
    return true;
  }

  setDest(x: PiecePosition, y: PiecePosition) {
    this.xDest = x;
    this.yDest = y;
    return true;
  }

  reset() {
    this.xSrc = -1;
    this.ySrc = -1;
    this.xDest = -1;
    this.yDest = -1;
    this.type = MoveType.NOT_APPLICABLE;
  }
}
