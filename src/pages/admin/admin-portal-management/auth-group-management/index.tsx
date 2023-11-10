import DataGrid from '@/components/grid/DataGrid';
import HorizontalTable from '@components/table/HorizontalTable';
import { TR, TH, TD, Stack, TextField, Typography, Button } from '@components/ui';
import { authGroupColumns as columns, authGroupRows as rows } from '@/utils/data/tableSampleData';

const List = () => {
  return (
    <>
      <DataGrid columns={columns} rows={rows} enableSort={true} clickable={true} onChange={undefined} />

      <Stack direction="Vertical" gap="MD">
        <Typography variant="h3">권한그룹 등록</Typography>
        <HorizontalTable>
          <TR>
            <TH>권한그룹 ID</TH>
            <TD>
              <TextField disabled className="width-100" />
            </TD>
            <TH>권한그룹명</TH>
            <TD>
              <TextField className="width-100" />
            </TD>
          </TR>
          <TR>
            <TH colSpan={1}>비고</TH>
            <TD colSpan={3}>
              <TextField className="width-100" />
            </TD>
          </TR>
        </HorizontalTable>
      </Stack>

      <Stack gap="SM" justifyContent="End">
        <Button priority="Primary" appearance="Contained" size="LG">신규</Button>
        <Button size="LG">
          저장
        </Button>
        <Button size="LG">
          삭제
        </Button>
      </Stack>
    </>
  );
};
export default List;
