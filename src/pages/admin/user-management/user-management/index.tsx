import { useNavigate } from 'react-router-dom';
import SearchForm from '@/components/form/SearchForm';
import DataGrid from '@/components/grid/DataGrid';
import { RowsInfo } from '@/models/components/Table';
import { TR, TH, TD, Stack, TextField, Select, SelectOption, Radio } from '@components/ui';
import { listColumns as columns, listRows as rows } from '@/utils/data/tableSampleData';

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
          <TH>성명</TH>
          <TD>
            <TextField className="width-100" />
          </TD>
          <TH>부서명</TH>
          <TD>
            <TextField className="width-100" />
          </TD>
        </TR>
        <TR>
          <TH>관리자권한</TH>
          <TD>
            <Select appearance="Outline" placeholder="전체" className="width-100">
              <SelectOption className="width-100" value={1}>
                테스트
              </SelectOption>
            </Select>
          </TD>
          <TH>사용자권한</TH>
          <TD>
            <Select appearance="Outline" placeholder="전체" className="width-100">
              <SelectOption className="width-100" value={1}>
                테스트
              </SelectOption>
            </Select>
          </TD>
        </TR>
        <TR>
          <TH colSpan={1}>사용여부</TH>
          <TD colSpan={3}>
            <Stack gap="LG" className="width-100">
              <Radio label="전체" checked />
              <Radio label="사용" />
              <Radio label="미사용" />
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
      />
    </>
  );
};
export default List;
