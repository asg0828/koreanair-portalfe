import { useNavigate } from 'react-router-dom';
import SearchForm from '@/components/form/SearchForm';
import DataGrid from '@/components/grid/DataGrid';
import { RowsInfo } from '@/models/components/Table';
import {
  TR,
  TH,
  TD,
  Button,
  Stack,
  TextField,
  Checkbox,
  Select,
  SelectOption,
} from '@components/ui';
import { listColumns as columns, listRows as rows } from '@/utils/data/tableSampleData'

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
          <TH align="right">대구분</TH>
          <TD>
            <Select appearance="Outline" placeholder="전체" className="width-100">
              <SelectOption value={1}>테스트</SelectOption>
            </Select>
          </TD>
          <TH align="right">중구분</TH>
          <TD>
            <Select appearance="Outline" placeholder="전체" className="width-100">
              <SelectOption value={1}>테스트</SelectOption>
            </Select>
          </TD>
        </TR>
        <TR>
          <TH colSpan={1} align="right">검색 Feature</TH>
          <TD colSpan={3} align="left">
            <TextField className="width-100" />
          </TD>
        </TR>
        <TR>
          <TH colSpan={1} align="right">검색 조건</TH>
          <TD colSpan={3} align="left">
            <Checkbox label="Feature 한글명" />
            <Checkbox label="Feature 영문명" />
            <Checkbox label="정의" />
          </TD>
        </TR>
        <TR>
          <TH align="right">Feature 신청자</TH>
          <TD>
            <Stack gap="SM" className="width-100">
              <TextField className="width-100" />
              <Button>검색</Button>
            </Stack>
          </TD>
          <TH align="right">신청부서</TH>
          <TD>
            <Stack gap="SM" className="width-100">
              <TextField className="width-100" />
              <Button>검색</Button>
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
        buttonChildren={
          <>
            <Button size="LG">엑셀다운로드</Button>
            <Button priority="Primary" appearance="Contained" size="LG" onClick={goToReg}>
              등록
            </Button>
          </>
        }
      />
    </>
  );
};
export default List;
