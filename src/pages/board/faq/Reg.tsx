import { useNavigate, useLocation } from 'react-router-dom';
import { TR, TH, TD, Button, Stack, Label, Radio, DatePicker, TextField, Select, SelectOption } from '@components/ui';
import HorizontalTable from '@components/table/HorizontalTable';
import '@/assets/styles/Board.scss';

const Reg = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goToList = () => {
    navigate('..');
  };

  return (
    <Stack direction="Vertical" gap="MD">
      <HorizontalTable>
        <TR>
          <TH colSpan={1}>질문</TH>
          <TD colSpan={3}>
            <Stack gap="SM" className="width-100">
              <TextField className="width-100" />
            </Stack>
          </TD>
        </TR>
        <TR>
          <TH>분류</TH>
          <TD>
            <Select appearance="Outline" placeholder="전체" className="width-100">
              <SelectOption value={1}>테스트</SelectOption>
            </Select>
          </TD>
          <TH>게시여부</TH>
          <TD>
            <Stack gap="LG">
              <Radio label="게시" checked />
              <Radio label="미게시" />
            </Stack>
          </TD>
        </TR>
        <TR>
          <TH colSpan={1}>답변</TH>
          <TD colSpan={3} className="content"></TD>
        </TR>
        <TR>
          <TH colSpan={1}>첨부파일</TH>
          <TD colSpan={3} className="attachFile"></TD>
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
