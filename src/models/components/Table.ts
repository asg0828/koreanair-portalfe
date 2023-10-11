import { CommonProps } from '@/models/common/Props';
import { Align } from '../common/Design';

export interface ColumnsInfo {
  headerName: string;
  field: string;
  colSpan?: number;
  align?: Align;
}

export interface RowsInfo {
  [key: string]: string | number;
}

export interface HorizontalTableProps extends CommonProps {}

export interface VerticalTableProps extends CommonProps {
  columns: Array<ColumnsInfo>;
  rows: Array<RowsInfo>;
  showHeader?: boolean;
  enableSort?: boolean;
  clickable?: boolean;
  rowSelection?: Function;
  onClick?: Function;
}
