import { Align } from '@/models/common/Design';

export interface ColumnsInfo {
  headerName: string;
  field: string;
  colSpan?: number;
  maxLength?: number;
  require?: boolean;
  align?: Align;
  isTooltip?: boolean;
  render?: (rowIndex: number, field: any, maxLength?: number, require?: boolean) => any;
}

export interface RowsInfo {
  [key: string]: any;
}
