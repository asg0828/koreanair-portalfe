import { PageInfo } from '@/models/components/Table';
import VerticalTable, { VerticalTableProps } from '@components/table/VerticalTable';
import { Label, Pagination, Select, SelectOption, Stack } from '@components/ui';
import { ReactNode, useEffect, useState } from 'react';
import './DataGrid.scss';

export interface DatagridProps extends VerticalTableProps {
  buttonChildren?: ReactNode;
  onChange?: (pageSize: any) => void;
  page?: PageInfo;
}

export const initPage = {
  totalCount: 0,
  totalPage: 0,
  page: 0,
  pageSize: 10,
};

const pageSizeList = [10, 30, 50];

const DataGrid: React.FC<DatagridProps> = ({
  columns,
  rows,
  enableSort,
  clickable,
  onClick,
  onChange,
  buttonChildren,
  page,
}) => {
  const [pages, setPages] = useState<PageInfo>(initPage);

  useEffect(() => {
    page && setPages(page);
  }, [page]);

  const handleChange = (key: string, value: any) => {
    setPages((prevState) => {
      const state = {
        ...prevState,
        [key]: value,
      };
      if (key === 'pageSize') {
        state.page = 0;
      }
      onChange && onChange(state);
      return state;
    });
  };

  return (
    <Stack className="dataGridWrap" direction="Vertical" gap="MD">
      <Stack className="total-layout">
        <Label>
          총 <span className="total">{pages.totalCount}</span> 건
        </Label>
        <Select
          appearance="Outline"
          size="LG"
          className="select-page"
          value={pages.pageSize}
          onChange={(e, value) => handleChange('pageSize', value)}
        >
          {pageSizeList.map((pageSize) => (
            <SelectOption value={pageSize}>{`${pageSize} 건`}</SelectOption>
          ))}
        </Select>
      </Stack>
      <VerticalTable columns={columns} rows={rows} enableSort={enableSort} clickable={clickable} onClick={onClick} />
      <Stack className="pagination-layout">
        <Pagination
          size="LG"
          className="pagination"
          page={pages.page}
          totalPages={pages.totalPage}
          onChangePage={(value) => handleChange('page', value)}
        />
        <Stack justifyContent="End" gap="SM" className="width-100">
          {buttonChildren}
        </Stack>
      </Stack>
    </Stack>
  );
};
export default DataGrid;
