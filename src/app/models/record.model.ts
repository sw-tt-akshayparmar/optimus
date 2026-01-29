export interface RecordModel<Data = any> {
  total: number;
  page: number;
  size: number;
  records: Array<Data>;
}
