import { ReactNode } from 'react';
import VerticalTable from '@components/table/VerticalTable';
import { VerticalTableProps } from '@components/table/VerticalTable';
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
    <Stack direction="Vertical" gap="MD">
      <Label>{`총 ${totalCount} 건`}</Label>
      <VerticalTable
        columns={columns}
        rows={rows}
        enableSort={enableSort}
        clickable={clickable}
        onClick={onClick}
        />
      <Stack className="pagination-layout">
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

        <Pagination size="LG" className="pagination" />

        <Stack justifyContent="End" gap="SM" className="width-100">
          {buttonChildren}
        </Stack>
      </Stack>
    </Stack>
  )
}
export default DataGrid;