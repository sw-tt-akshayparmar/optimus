function imgPath(p: string) {
  return `/images/chess_pieces/${p}.png`;
}
export interface IChessData {
  wk: string;
  wq: string;
  wr: string;
  wb: string;
  wn: string;
  wp: string;

  bk: string;
  bq: string;
  br: string;
  bb: string;
  bn: string;
  bp: string;

  PIECE_IMG: Array<Array<string>>;
}

export const ChessData: IChessData = {
  wk: imgPath('wk'),
  wq: imgPath('wq'),
  wr: imgPath('wr'),
  wb: imgPath('wb'),
  wn: imgPath('wn'),
  wp: imgPath('wp'),

  bk: imgPath('bk'),
  bq: imgPath('bq'),
  br: imgPath('br'),
  bb: imgPath('bb'),
  bn: imgPath('bn'),
  bp: imgPath('bp'),

  PIECE_IMG: [
    [imgPath('bp'), imgPath('bn'), imgPath('bb'), imgPath('br'), imgPath('bq'), imgPath('bk')],
    [imgPath('wp'), imgPath('wn'), imgPath('wb'), imgPath('wr'), imgPath('wq'), imgPath('wk')],
  ],
};
