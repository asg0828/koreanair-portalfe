import { PageModel, PageProps, initPage, pageSizeList } from '@/models/model/PageModel';
import { VerticalTableProps } from '@components/table/VerticalTable';
import { Label, Pagination, Select, SelectOption, Stack } from '@components/ui';
import { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import VerticalTableChildNode from '../table/VerticalTableChildNode';
import './DataGrid.scss';

export interface DatagridProps extends VerticalTableProps, PageProps {
  buttonChildren?: ReactNode;
  totals?: any;
}

const DataGridChild: React.FC<DatagridProps> = ({
  columns,
  rows,
  enableSort,
  clickable,
  onClick,
  onChange,
  buttonChildren,
  page,
  rowSelection,
  totals,
}) => {
  const { t } = useTranslation();
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
          {t('common.label.countingUnit.total')}
          <span className="total">{` ${pages.totalCount} `}</span>
          {t('common.label.countingUnit.thing')}
        </Label>
        <Select
          appearance="Outline"
          size="LG"
          className="select-page"
          value={pages.pageSize}
          onChange={(e, value) => handleChange('pageSize', value)}
        >
          {pageSizeList.map((pageSize, index) => (
            <SelectOption key={index} value={pageSize}>{`${pageSize} ${t(
              'common.label.countingUnit.thing'
            )}`}</SelectOption>
          ))}
        </Select>
      </Stack>
      <VerticalTableChildNode
        columns={columns}
        rows={rows}
        enableSort={enableSort}
        clickable={clickable}
        onClick={onClick}
        totals={totals}
        rowSelection={rowSelection}
      />
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
export default DataGridChild;
