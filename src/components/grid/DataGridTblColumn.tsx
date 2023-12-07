import { PageProps } from '@/models/model/PageModel';
import { VerticalTableProps } from '@components/table/VerticalTable';
import { Label, Stack } from '@components/ui';
import { ReactNode } from 'react';
import './DataGrid.scss';
import VerticalTblColumn from '../table/VerticalTblColumn';
import { RowsInfo } from '@/models/components/Table';

export interface DatagridProps extends VerticalTableProps, PageProps {
  buttonChildren?: ReactNode;
  props: any;
  list: RowsInfo;
}

const DataGridTblColumn: React.FC<DatagridProps> = ({
  columns,
  rows,
  enableSort,
  clickable,
  onClick,
  onChange,
  rowSelection,
  props,
  list,
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
        props={props}
        list={list}
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
export default DataGridTblColumn;
