import { useNavigate, useLocation } from 'react-router-dom';
import { Typography, TR, TH, TD, Button, Stack, TextField, Label, Select, SelectOption } from '@components/ui';
import HorizontalTable from '@components/table/HorizontalTable';
import { regColumns as columns, regRows as rows } from '@/utils/data/tableSampleData'
import VerticalTable from '@components/table/VerticalTable';

const Reg = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goToList = () => {
    navigate('..');
  };

  return (
    <Stack direction="Vertical" gap="MD">
      <Typography variant="h3">기본 정보</Typography>
      <HorizontalTable>
        <TR>
          <TH required>대구분</TH>
          <TD>
            <Select appearance="Outline" placeholder="전체" className="width-100">
              <SelectOption value={1}>테스트</SelectOption>
            </Select>
          </TD>
          <TH required>중구분</TH>
          <TD>
            <Select appearance="Outline" placeholder="전체" className="width-100">
              <SelectOption value={1}>테스트</SelectOption>
            </Select>
          </TD>
        </TR>
        <TR>
          <TH>Feature ID</TH>
          <TD>
            <TextField className="width-100" />
          </TD>
          <TH required>Feature 타입</TH>
          <TD>
          <TextField className="width-100" />
          </TD>
        </TR>
        <TR>
          <TH required>한글명</TH>
          <TD>
            <Stack gap="SM" className="width-100">
              <TextField className="width-100" />
              <Button>중복확인</Button>
            </Stack>
          </TD>
          <TH required>영문명</TH>
          <TD>
            <Stack gap="SM" className="width-100">
              <TextField className="width-100" />
              <Button>중복확인</Button>
            </Stack>
          </TD>
        </TR>
        <TR>
          <TH colSpan={1} required>Feature 정의</TH> 
          <TD colSpan={3}>
            <TextField className="width-100" />
          </TD>
        </TR>
        <TR>
          <TH colSpan={1}>산출단위</TH>
          <TD colSpan={3}>
            <Select appearance="Outline" placeholder="전체" className="width-100">
              <SelectOption value={1}>테스트</SelectOption>
            </Select>
          </TD>
        </TR>
        <TR>
          <TH colSpan={1}>산출로직</TH>
          <TD colSpan={3}>
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

      <Typography variant="h3">신청 정보</Typography>
      <HorizontalTable>
        <TR>
          <TH>Feature 신청자</TH>
          <TD>
            <Stack gap="SM" className="width-100">
              <TextField className="width-100" />
              <Button>검색</Button>
            </Stack>
          </TD>
          <TH>신청부서</TH>
          <TD>
            <TextField className="width-100" />
          </TD>
        </TR>
      </HorizontalTable>

      <Stack gap="SM" justifyContent="End">
        <Button priority="Primary" appearance="Contained" size="LG">
          등록
        </Button>
        <Button size="LG" onClick={goToList}>
          목록
        </Button>
      </Stack>
    </Stack>
  );
};
export default Reg;
