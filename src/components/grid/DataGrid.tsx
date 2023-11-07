import { ReactNode } from 'react';
import VerticalTable from '@components/table/VerticalTable';
import { VerticalTableProps } from '@components/table/VerticalTable';
import '@components/grid/DataGrid.scss';
import {
  Pagination,
  Stack,
  Select,
  SelectOption,
  Label,
} from '@components/ui';

export interface DatagridProps extends VerticalTableProps {
  totalCount?: number;
  buttonChildren?: ReactNode;
  onChange?: (e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null, value: any) => void,
}

const DataGrid: React.FC<DatagridProps> = ({
  totalCount = 0,
  columns,
  rows,
  enableSort,
  clickable,
  onClick,
  onChange,
  buttonChildren,
}) => {
  return (
    <Stack className="dataGridWrap" direction="Vertical" gap="MD">
      <Stack className="total-layout">
        <Label>총 <span className="total">{totalCount}</span> 건</Label>
        <Select
          appearance="Outline"
          size="LG"
          className="select-page"
          defaultValue={10}
          onChange={onChange}
          >
          <SelectOption value={10}>10건</SelectOption>
          <SelectOption value={30}>30건</SelectOption>
          <SelectOption value={50}>30건</SelectOption>
        </Select>  
      </Stack>
      <VerticalTable
        columns={columns}
        rows={rows}
        enableSort={enableSort}
        clickable={clickable}
        onClick={onClick}
        />
      <Stack className="pagination-layout">
        <Pagination size="MD" className="pagination" />

        <Stack justifyContent="End" gap="SM" className="width-100">
          {buttonChildren}
        </Stack>
      </Stack>
    </Stack>
  )
}
export default DataGrid;