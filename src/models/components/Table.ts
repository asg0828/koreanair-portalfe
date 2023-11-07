import { Align } from '../common/Design';

export interface ColumnsInfo {
  headerName: string;
  field: string;
  colSpan?: number;
  align?: Align;
}

export interface RowsInfo {
  [key: string]: any;
}

export interface PageInfo {
  page: number;
  pageSize: number;
  totalPage: number;
  totalCount: number;
}
