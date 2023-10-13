import { useNavigate, useLocation } from 'react-router-dom';
import { TR, TH, TD, Button, Stack, Label, Grid, GridCol, Typography, TextField } from '@components/ui';
import HorizontalTable from '@components/table/HorizontalTable';
import '@/assets/styles/Board.scss';

const Detail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goToList = () => {
    navigate('..');
  };

  const goToEdit = () => {
    navigate('../edit');
  };

  return (
    <Stack direction="Vertical" gap="MD">
      <HorizontalTable>
        <TR>
          <TH colSpan={4} className="headerName">
            <Typography variant="h3">공지사항 테스트</Typography>
          </TH>
        </TR>
        <TR>
          <TD colSpan={4} className="content"></TD>
        </TR>
        <TR>
          <TH colSpan={1} className="attachFile">첨부파일</TH>
          <TD colSpan={3}></TD>
        </TR>
        <TR>
          <TD colSpan={4} className="reply">
            <Stack direction="Vertical" gap="SM" className="width-100">
              <Stack>
                <TextField size="LG" className="width-100" />
                <Button size="LG" >등록</Button>
              </Stack>
              <Stack>
                <Stack gap="SM" className="width-100">
                  <Label>서비스개발본부 관리자</Label>
                  <Label>2023-09-25 06:37:38</Label>
                </Stack>
                <Stack>
                  <Button appearance="Unfilled">답글</Button>
                  <Button appearance="Unfilled">수정</Button>
                  <Button appearance="Unfilled">삭제</Button>
                </Stack>
              </Stack>
              <Label>답변완료.</Label>
            </Stack>
          </TD>
        </TR>
        <TR>
          <TH colSpan={1}>다음</TH>
          <TD colSpan={3}></TD>
        </TR>
        <TR>
          <TH colSpan={1}>이전</TH>
          <TD colSpan={3}></TD>
        </TR>
      </HorizontalTable>

      <Stack gap="SM" justifyContent="End">
        <Button priority="Primary" appearance="Contained" size="LG" onClick={goToEdit}>
          수정
        </Button>
        <Button priority="Normal" appearance="Contained" size="LG">
          삭제
        </Button>
        <Button size="LG" onClick={goToList}>
          목록
        </Button>
      </Stack>
    </Stack>
  );
};
export default Detail;
