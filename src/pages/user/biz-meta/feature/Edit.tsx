import { useNavigate, useLocation } from 'react-router-dom';
import { Typography, TR, TH, TD, Button, Stack, TextField, Label } from '@components/ui';
import HorizontalTable from '@components/table/HorizontalTable';
import { regColumns as columns, regRows as rows } from '@/utils/data/tableSampleData'
import VerticalTable from '@components/table/VerticalTable';

const Edit = () => {
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
          <TH required>데이터셋 물리명</TH>
          <TD>
            <Stack gap="SM" className="width-100">
              <TextField className="width-100" />
              <Button>중복확인</Button>
            </Stack>
          </TD>
          <TH required>데이터셋 논리명</TH>
          <TD>
            <Stack gap="SM" className="width-100">
              <TextField className="width-100" />
              <Button>중복확인</Button>
            </Stack>
          </TD>
        </TR>
        <TR>
          <TH colSpan={1} required>데이터셋 정의</TH>
          <TD colSpan={3}>
            <TextField className="width-100" />
          </TD>
        </TR>
        <TR>
          <TH colSpan={1} required>컬럼 정의</TH>
          <TD colSpan={3}>
            <VerticalTable columns={columns} rows={rows} />
          </TD>
        </TR>
        <TR>
          <TH colSpan={1}>관련 데이터 셋</TH>
          <TD colSpan={3}>
            <Stack gap="SM" className="width-100">
              <TextField className="width-100" />
              <Button>데이터셋검색</Button>
            </Stack>
          </TD>
        </TR>
        <TR>
          <TH colSpan={1}>비고</TH>
          <TD colSpan={3}>
            <TextField className="width-100" />
          </TD>
        </TR>
        <TR>
          <TH colSpan={1}>검색태그</TH>
          <TD colSpan={3}>
            <Stack gap="SM" direction="Vertical" className="width-100">
              <Stack gap="SM" className="width-100">
                <TextField className="width-100" />
                <Button>등록</Button>
              </Stack>
              <TextField />
            </Stack>
          </TD>
        </TR>
      </HorizontalTable>

      <Typography variant="h3">관리 정보</Typography>
      <HorizontalTable>
        <TR>
          <TH>데이터셋 담당자</TH>
          <TD>
            <Stack gap="SM" className="width-100">
              <TextField className="width-100" />
              <Button>검색</Button>
            </Stack>
          </TD>
          <TH>담당 부서</TH>
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
export default Edit;
