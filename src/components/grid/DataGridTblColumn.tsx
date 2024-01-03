import { RowsInfo } from '@/models/components/Table';
import { PageProps } from '@/models/model/PageModel';
import { VerticalTableProps } from '@components/table/VerticalTable';
import { Label, Stack } from '@components/ui';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import VerticalTblColumn from '../table/VerticalTblColumn';
import './DataGrid.scss';

export interface DatagridProps extends VerticalTableProps, PageProps {
  buttonChildren?: ReactNode;
  props: any;
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
}) => {
  const { t } = useTranslation();

  return (
    <Stack className="dataGridWrap" direction="Vertical" gap="MD">
      <Stack className="total-layout">
        <Label>
          {t('common.label.countingUnit.total')}
          <span className="total">{` ${rows.length} `}</span>
          {t('common.label.countingUnit.thing')}
        </Label>
      </Stack>
      <VerticalTblColumn
        columns={columns}
        props={props}
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
