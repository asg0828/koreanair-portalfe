import { useNavigate } from 'react-router-dom';
import SearchForm from '@/components/form/SearchForm';
import DataGrid, { initPage } from '@/components/grid/DataGrid';
import { RowsInfo } from '@/models/components/Table';
import { TR, TH, TD, Button, Stack, TextField, Select, SelectOption } from '@components/ui';
import { dataroomColumns as columns, dataroomRows as rows } from '@/utils/data/tableSampleData';
import AddIcon from '@mui/icons-material/Add';

const List = () => {
  const navigate = useNavigate();

  const goToReg = () => {
    navigate('reg');
  };

  const goToDetail = (row: RowsInfo) => {
    navigate('detail', { state: row });
  };

  const clickRow = (row: RowsInfo, index: number) => {
    goToDetail(row);
  };

  return (
    <>
      <SearchForm>
        <TR>
          <TH colSpan={1} align="right">
            검색
          </TH>
          <TD colSpan={3}>
            <Stack gap="SM" className="width-100">
              <Select appearance="Outline" placeholder="전체" className="select-basic">
                <SelectOption value={1}>테스트</SelectOption>
              </Select>
              <TextField className="width-100" />
            </Stack>
          </TD>
        </TR>
      </SearchForm>

      <DataGrid
        columns={columns}
        rows={rows}
        enableSort={true}
        clickable={true}
        onClick={clickRow}
        onChange={undefined}
        page={initPage}
        buttonChildren={
          <>
            <Button priority="Primary" appearance="Contained" size="LG" onClick={goToReg}>
             <AddIcon />
              등록
            </Button>
          </>
        }
      />
    </>
  );
};
export default List;
