import TableSearchForm from '@/components/form/TableSearchForm';
import TreeMenuForm from '@/components/form/TreeSearchForm';
import { Stack } from '@components/ui';

const columns = [
  { headerName: '권한ID', field: 'column1' },
  { headerName: '권한명', field: 'column2' },
  { headerName: '권한분류', field: 'column3' },
];

const rows = [
  {
    column1: 'administrators',
    column2: '관리자그룹',
    column3: '',
  },
  {
    column1: 'analysist',
    column2: '분석가',
    column3: '',
  },
  {
    column1: 'au20100000001',
    column2: '일반사용자',
    column3: '',
  },
  {
    column1: 'au20100000002',
    column2: '데이터 스튜어드',
    column3: '',
  },
  {
    column1: 'au20100000003',
    column2: '운영담당',
    column3: '',
  },
  {
    column1: 'test',
    column2: '테스트_권한그룹',
    column3: '',
  },
];

const List = () => {
  return (
    <Stack>
      <TableSearchForm
        columns={columns}
        rows={rows}
      />
      <TreeMenuForm />
    </Stack>
  );
};
export default List;
