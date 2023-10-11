import { useNavigate } from 'react-router-dom';
import VerticalTable from '@components/table/VerticalTable';
import HorizontalTable from '@components/table/HorizontalTable';
import { RowsInfo } from '@/models/components/Table';
import { Pagination, TR, TH, TD, Button, Stack, TextField, Select, SelectOption, Label } from '@components/ui';
import { listColumns as columns, listRows as rows } from './data';

const List = () => {
  const navigate = useNavigate();

  const rowSelection = () => {
    console.log('rowSelection');
  }

  return (
    <Stack direction="Vertical" gap="MD" className="height-100">
      <Stack direction="Vertical" gap="MD" justifyContent="End" className="height-100">
        <Label>총 373 건</Label>
        <VerticalTable
          columns={columns}
          rows={rows}
          enableSort={true}
          clickable={true}
        />
        <Stack className="pagination-layout">
          <Select appearance="Outline" size="LG" defaultValue={10} className="select-page">
            <SelectOption value={10}>10</SelectOption>
            <SelectOption value={30}>30</SelectOption>
            <SelectOption value={50}>50</SelectOption>
          </Select>

          <Pagination size="LG" className="pagination" />

          <Stack justifyContent="End" gap="SM" className="width-100">
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
export default List;
