import { PageModel, PageProps, initPage } from '@/models/model/PageModel';
import { VerticalTableProps } from '@components/table/VerticalTable';
import { Label, Stack } from '@components/ui';
import { ReactNode } from 'react';
import './DataGrid.scss';
import VerticalTblColumn from '../table/VerticalTblColumn';

export interface DatagridProps extends VerticalTableProps, PageProps {
  buttonChildren?: ReactNode;
}

const DataGridMeta: React.FC<DatagridProps> = ({
  columns,
  rows,
  enableSort,
  clickable,
  onClick,
  onChange,
  rowSelection,
}) => {
  return (
    <Stack className="dataGridWrap" direction="Vertical" gap="MD">
      <Stack className="total-layout">
        <Label>
          총 <span className="total">{rows.length}</span> 건
        </Label>
      </Stack>
      <VerticalTblColumn
        columns={columns}
        rows={rows}
        enableSort={enableSort}
        clickable={clickable}
        onClick={onClick}
        rowSelection={rowSelection}
        onChange={onChange}
      />
    </Stack>
  );
};
export default DataGridMeta;
