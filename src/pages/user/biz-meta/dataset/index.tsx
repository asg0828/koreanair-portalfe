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
  DatePicker,
  Label,
} from '@components/ui';
import { tableColumns as columns, tableRows as rows } from '@/utils/data/tableSampleData'
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
          <TH colSpan={1} align="right">데이터셋 검색</TH>
          <TD colSpan={3}>
            <TextField className="width-100" />
          </TD>
        </TR>
        <TR>
          <TH colSpan={1} align="right">데이터셋 조건</TH>
          <TD colSpan={3} align="left">
            <Checkbox label="테이터셋명" />
            <Checkbox label="테이블ID" />
            <Checkbox label="정의" />
            <Checkbox label="분석관점" />
            <Checkbox label="지수" />
            <Checkbox label="활용상세" />
          </TD>
        </TR>
        {/* <TR>
          <TH align="right">주제영역</TH>
          <TD>
            <Select appearance="Outline" placeholder="전체" className="width-100">
              <SelectOption value={1}>테스트</SelectOption>
            </Select>
          </TD>
          <TH align="right">공개여부</TH>
          <TD>
            <Select appearance="Outline" placeholder="전체" className="width-100">
              <SelectOption value={1}>테스트</SelectOption>
            </Select>
          </TD>
        </TR>
        <TR>
          <TH colSpan={1} align="right">등록일</TH>
          <TD colSpan={3}>
            <DatePicker appearance="Outline" calendarViewMode="days" mode="single" shape="Square" size="MD" />
            <Label>~</Label>
            <DatePicker appearance="Outline" />
          </TD>
        </TR>
        <TR>
          <TH align="right">관련부서</TH>
          <TD>
            <Stack gap="SM" className="width-100">
              <TextField className="width-100" />
              <Button>검색</Button>
            </Stack>
          </TD>
          <TH align="right">담당자</TH>
          <TD>
            <Stack gap="SM" className="width-100">
              <TextField className="width-100" />
              <Button>검색</Button>
            </Stack>
          </TD>
        </TR> */}
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
            {/* <Button size="LG">엑셀다운로드</Button> */}
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
