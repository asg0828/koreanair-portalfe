import { useNavigate } from 'react-router-dom';
import VerticalTable from '@components/table/VerticalTable';
import HorizontalTable from '@components/table/HorizontalTable';
import { RowsInfo } from '@/models/components/Table';
import {
  Pagination,
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
    <Stack direction="Vertical" gap="MD" className="height-100">
      <HorizontalTable>
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
      </HorizontalTable>

      <Stack gap="SM" justifyContent="Center">
        <Button priority="Primary" appearance="Contained" size="LG">
          검색
        </Button>
        <Button size="LG">초기화</Button>
      </Stack>

      <Stack direction="Vertical" gap="MD" justifyContent="End" className="height-100">
        <Label>총 373 건</Label>
        <VerticalTable
          columns={columns}
          rows={rows}
          enableSort={true}
          clickable={true}
          onClick={clickRow}
        />
        <Stack className="pagination-layout">
          <Select appearance="Outline" size="LG" defaultValue={10} className="select-page">
            <SelectOption value={10}>10</SelectOption>
            <SelectOption value={30}>30</SelectOption>
            <SelectOption value={50}>50</SelectOption>
          </Select>

          <Pagination size="LG" className="pagination" />

          <Stack justifyContent="End" gap="SM" className="width-100">
            <Button size="LG">엑셀다운로드</Button>
            <Button priority="Primary" appearance="Contained" size="LG" onClick={goToReg}>
              등록
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
export default List;
