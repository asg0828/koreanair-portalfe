import { PageModel, PageProps, initPage, pageSizeList } from '@/models/model/PageModel';
import VerticalTable, { VerticalTableProps } from '@components/table/VerticalTable';
import { Label, Pagination, Select, SelectOption, Stack } from '@components/ui';
import { ReactNode, useEffect, useState } from 'react';
import './DataGrid.scss';

export interface DatagridProps extends VerticalTableProps, PageProps {
  buttonChildren?: ReactNode;
  showPageSizeSelect?: boolean;
  showPagination?: boolean;
  initialSortedColumn?: string;
}

const DataGrid: React.FC<DatagridProps> = ({
  columns,
  rows,
  enableSort,
  clickable,
  onClick,
  onChange,
  buttonChildren,
  page,
  initialSortedColumn,
  rowSelection,
  showPagination = true,
  showPageSizeSelect = true,
  isMultiSelected,
}) => {
  const [pages, setPages] = useState<PageModel>(initPage);

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
        {showPageSizeSelect && (
          <Select
            appearance="Outline"
            size="LG"
            className="select-page"
            value={pages.pageSize}
            onChange={(e, value) => value && handleChange('pageSize', value)}
          >
            {pageSizeList.map((pageSize, index) => (
              <SelectOption key={index} value={pageSize}>{`${pageSize} 건`}</SelectOption>
            ))}
          </Select>
        )}
      </Stack>
      <VerticalTable
        columns={columns}
        rows={rows}
        enableSort={enableSort}
        initialSortedColumn={initialSortedColumn}
        clickable={clickable}
        isMultiSelected={isMultiSelected}
        onClick={onClick}
        rowSelection={rowSelection}
      />
      <Stack className="pagination-layout">
        {showPagination && (
          <Pagination
            size="LG"
            className="pagination"
            page={pages.page}
            totalPages={pages.totalPage}
            onChangePage={(value) => handleChange('page', value)}
          />
        )}
        <Stack justifyContent="End" gap="SM" className="width-100">
          {buttonChildren}
        </Stack>
      </Stack>
    </Stack>
  );
};
export default DataGrid;
