import { useNavigate, useLocation } from 'react-router-dom';
import { Typography, TR, TH, TD, Button, Stack, TextField, Select, SelectOption } from '@components/ui';
import HorizontalTable from '@components/table/HorizontalTable';

const Detail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goToList = () => {
    navigate('..');
  };

  return (
    <>
      <Stack direction="Vertical" gap="MD">
        <Typography variant="h3">사용자 기본정보</Typography>
        <HorizontalTable>
          <TR>
            <TH>ID</TH>
            <TD>
              <TextField disabled className="width-100" />
            </TD>
            <TH>성명</TH>
            <TD>
              <TextField disabled className="width-100" />
            </TD>
          </TR>
          <TR>
            <TH>회사명</TH>
            <TD>
              <TextField disabled className="width-100" />
            </TD>
            <TH>부서</TH>
            <TD>
              <TextField disabled className="width-100" />
            </TD>
          </TR>
          <TR>
            <TH>사용여부</TH>
            <TD>
              <TextField disabled className="width-100" />
            </TD>
            <TH>사번</TH>
            <TD>
              <TextField disabled className="width-100" />
            </TD>
          </TR>
        </HorizontalTable>
      </Stack>

      <Stack direction="Vertical" gap="MD">
        <Typography variant="h3">사용자 권한정보</Typography>
        <HorizontalTable>
          <TR>
            <TH>이전 사용자 권한</TH>
            <TD></TD>
            <TH>적용 사용자 권한</TH>
            <TD>
              <Select appearance="Outline" placeholder="전체" className="width-100">
                <SelectOption className="width-100" value={1}>
                  테스트
                </SelectOption>
              </Select>
            </TD>
          </TR>
          <TR>
            <TH>이전 관리자 권한</TH>
            <TD></TD>
            <TH>적용 관리자 권한</TH>
            <TD>
              <Select appearance="Outline" placeholder="전체" className="width-100">
                <SelectOption className="width-100" value={1}>
                  테스트
                </SelectOption>
              </Select>
            </TD>
          </TR>
          <TR>
            <TH>최종변경일시</TH>
            <TD></TD>
            <TH></TH>
            <TD></TD>
          </TR>
        </HorizontalTable>
      </Stack>

      <Stack gap="SM" justifyContent="End">
        <Button priority="Primary" appearance="Contained" size="LG">
          수정
        </Button>
        <Button size="LG" onClick={goToList}>
          목록
        </Button>
      </Stack>
    </>
  );
};
export default Detail;
