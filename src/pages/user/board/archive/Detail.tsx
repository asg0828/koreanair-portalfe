import { useNavigate, useLocation } from 'react-router-dom';
import { TR, TH, TD, Button, Stack, Typography } from '@components/ui';
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
    <>
      <Stack direction="Vertical" gap="MD" className="height-100">
        <HorizontalTable>
          <TR>
            <TH colSpan={4} className="headerName">
              <Typography variant="h3">도움말 테스트</Typography>
            </TH>
          </TR>
          <TR className="height-100">
            <TD colSpan={4} className="content"></TD>
          </TR>
          <TR>
            <TH colSpan={1} className="attachFile">첨부파일</TH>
            <TD colSpan={3}></TD>
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
      </Stack>

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
    </>
  );
};
export default Detail;
