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
          <TH colSpan={1}>제목</TH>
          <TD colSpan={3}>
            <Stack gap="SM" className="width-100">
              <TextField className="width-100" />
            </Stack>
          </TD>
        </TR>
        <TR>
          <TH colSpan={1}>게시여부</TH>
          <TD colSpan={3}>
            <Stack gap="LG" className="width-100">
              <Radio label="공개" checked />
              <Radio label="비공개" />
            </Stack>
          </TD>
        </TR>
        <TR>
          <TH colSpan={1}>내용</TH>
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
