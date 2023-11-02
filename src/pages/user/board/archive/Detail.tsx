import { useNavigate, useLocation } from 'react-router-dom';
import { TR, TH, TD, Button, Stack, Typography } from '@components/ui';
import HorizontalTable from '@components/table/HorizontalTable';
import '@/assets/styles/Board.scss';
import { Link } from '@ke-design/components';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
      <Stack direction="Vertical" gap="MD" className="height-100 contentDeatilWrap">
        <HorizontalTable className="height-100">
          <TR>
            <TH colSpan={4} className="headerName">
              <Stack className="headerNameWrap">
                <Typography variant="h3">자료실 첨부파일 등록</Typography>
                  <ul>
                    <li>업체명</li>
                    <li>서비스 개발본부 관리자</li>
                    <li>0000-00-00 00:00:00</li>
                    <li>조회수<span>60</span></li>
                  </ul>
              </Stack>
            </TH>
          </TR>
          <TR className="height-100">
            <TD colSpan={4} className="content">1234</TD>
          </TR>
          <TR>
            <TH colSpan={1} className="attachFile">첨부파일</TH>
            <TD colSpan={3}>
              <ul className="attachFileList">
                <li>
                  <Link href="#" target="_blank"><AttachFileIcon />첨부파일입니다.</Link>
                </li>
                <li>
                  <Link href="#" target="_blank"><AttachFileIcon />첨부파일입니다.</Link>
                </li>
                <li>
                  <Link href="#" target="_blank"><AttachFileIcon />첨부파일입니다.</Link>
                </li>
                <li>
                  <Link href="#" target="_blank"><AttachFileIcon />첨부파일입니다.</Link>
                </li>
              </ul>
            </TD>
          </TR>
          <TR>
            <TH colSpan={1}>다음<ExpandLessIcon fontSize="small"/></TH>
            <TD colSpan={3} className="nextContent">
              <Link href="#" linkType="Page">다음글입니다.</Link>
            </TD>
          </TR>
          <TR>
            <TH colSpan={1}>이전<ExpandMoreIcon fontSize="small" /></TH>
            <TD colSpan={3} className="prevContent">
              <Link href="#" linkType="Page">이전글입니다.</Link>
            </TD>
          </TR>
        </HorizontalTable>
      </Stack>

      <Stack gap="SM" justifyContent="End">
        {/* <Button priority="Primary" appearance="Contained" size="LG" onClick={goToEdit}>
          수정
        </Button>
        <Button priority="Normal" size="LG">
          삭제
        </Button> */}
        <Button size="LG" onClick={goToList}>
          목록
        </Button>
      </Stack>
    </>
  );
};
export default Detail;
