import TableSearchForm from '@/components/form/TableSearchForm';
import TreeMenuForm from '@/components/form/TreeSearchForm';
import { Stack } from '@components/ui';

const columns = [
  { headerName: '권한ID', field: 'column1' },
  { headerName: '권한명', field: 'column2' },
];

const rows = [
  {
    column1: 'au2000000000001',
    column2: '관리자',
  },
  {
    column1: 'au2000000000002',
    column2: '분석관리자',
  },
  {
    column1: 'au2000000000003',
    column2: '모니터링',
  },
];

const List = () => {
  return (
    <Stack alignItems="Start">
      <TableSearchForm
        columns={columns}
        rows={rows}
      />
      <TreeMenuForm />
    </Stack>
  );
};
export default List;
