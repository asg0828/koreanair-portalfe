import { PageModel, PageProps, initPage } from '@/models/model/PageModel';
import { VerticalTableProps } from '@components/table/VerticalTable';
import { Label, Pagination, Stack } from '@components/ui';
import { ReactNode, useEffect, useState } from 'react';
import './DataGrid.scss';
import VerticalTableMeta from '../table/VerticalTableMeta';
import { RowsInfo } from '@/models/components/Table';

export interface DatagridProps extends VerticalTableProps, PageProps {
  buttonChildren?: ReactNode;
  props: any;
  list: RowsInfo;
}

const DataGridMeta: React.FC<DatagridProps> = ({
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
      <VerticalTableMeta
        props={props}
        list={list}
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
