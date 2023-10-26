import { useNavigate, useLocation } from 'react-router-dom';
import { Typography, TR, TH, TD, Button, Stack, TextField, Label } from '@components/ui';
import HorizontalTable from '@components/table/HorizontalTable';
import { regColumns as columns, regRows as rows } from '@/utils/data/tableSampleData'
import VerticalTable from '@components/table/VerticalTable';

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
      <Stack direction="Vertical" gap="MD">
      <Typography variant="h3">기본 정보</Typography>
        <HorizontalTable>
          <TR>
            <TH required colSpan={1} align='right'>대구분</TH>
            <TD colSpan={2} align='left'>
              가족
            </TD>
            <TH required colSpan={1} align='right'>중구분</TH>
            <TD colSpan={2} align='left'>
              회원
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align='right'>Feature ID</TH>
            <TD colSpan={2} align='left'>
              FI-12354
            </TD>
            <TH required colSpan={1} align='right'>Feature 타입</TH>
            <TD colSpan={2} align='left'>
              FACT 지수
            </TD>
          </TR>
          <TR>
            <TH required colSpan={1} align='right'>한글명</TH>
            <TD colSpan={2} align='left'>
              한글명123
            </TD>
            <TH required colSpan={1} align='right'>영문명</TH>
            <TD colSpan={2} align='left'>
              영문명123
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} required align='right'>Feature 정의</TH> 
            <TD colSpan={5.01} align='left'>
              KYPASS에 등록된 가족 수
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align='right'>산출단위</TH>
            <TD colSpan={5.01} align='left'>
              명
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align='right'>산출로직</TH>
            <TD colSpan={5.01} align='left'>
              SELECT SKYPASS한글명일치여부 FROM OneID_마스터 WHERE 타입코드 = 'P' AND 상태코드 = 'A'
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align='right'>비고</TH>
            <TD colSpan={5.01} align='left'>
              비고 1234
            </TD>
          </TR>
        </HorizontalTable>
      </Stack>

      <Stack direction="Vertical" gap="MD">
      <Typography variant="h3">신청 정보</Typography>
        <HorizontalTable>
          <TR>
            <TH align="right" colSpan={1}>Feature 신청자</TH>
            <TD colSpan={2} align='left'>
              홍길녀
            </TD>
            <TH align="right" colSpan={1}>신청부서</TH>
            <TD colSpan={2} align='left'>
              여객 마케팅부
            </TD>
          </TR>
        </HorizontalTable>
      </Stack>

      <Stack gap="SM" justifyContent="End">
        <Button priority="Primary" appearance="Contained" size="LG" onClick={goToEdit}>
          수정
        </Button>
        <Button priority="Normal" appearance="Outline" size="LG">
          삭제
        </Button>
        <Button appearance="Outline" size="LG" onClick={goToList}>
          목록
        </Button>
      </Stack>
    </>
  );
};
export default Detail;
