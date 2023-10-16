import { useNavigate, useLocation } from 'react-router-dom';
import { TR, TH, TD, Button, Stack, Label, Radio, DatePicker, TextField } from '@components/ui';
import HorizontalTable from '@components/table/HorizontalTable';
import TinyEditor from '@/components/editor/TinyEditor';
import '@/assets/styles/Board.scss';

const Reg = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goToList = () => {
    navigate('..');
  };

  return (
    <Stack direction="Vertical" gap="MD" className="height-100">
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
          <TH>팝업공지여부</TH>
          <TD>
            <Stack gap="LG">
              <Radio label="사용" checked />
              <Radio label="미사용" />
            </Stack>
          </TD>
          <TH>팝업공지일자</TH>
          <TD>
            <DatePicker appearance="Outline" calendarViewMode="days" mode="single" shape="Square" size="MD" />
            <Label>~</Label>
            <DatePicker appearance="Outline" />
          </TD>
        </TR>
        <TR>
          <TH>게시여부</TH>
          <TD>
            <Stack gap="LG">
              <Radio label="게시" checked />
              <Radio label="미개시" />
            </Stack>
          </TD>
          <TH>중요여부</TH>
          <TD>
            <Stack gap="LG">
              <Radio label="중요" checked />
              <Radio label="일반" />
            </Stack>
          </TD>
        </TR>
        <TR className="height-100">
          <TH colSpan={1}>내용</TH>
          <TD colSpan={3} className="content">
            <TinyEditor />
          </TD>
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
