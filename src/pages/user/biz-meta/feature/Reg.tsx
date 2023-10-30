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
    <>
      <Stack direction="Vertical" gap="MD">
        <Typography variant="h3">기본 정보</Typography>
        <HorizontalTable>
          <TR>
            <TH required colSpan={1} align='right'>대구분</TH>
            <TD colSpan={2}>
              <Select appearance="Outline" placeholder="전체" className="width-100">
                <SelectOption value={1}>테스트</SelectOption>
              </Select>
            </TD>
            <TH required colSpan={1} align='right'>중구분</TH>
            <TD colSpan={2}>
              <Select appearance="Outline" placeholder="전체" className="width-100">
                <SelectOption value={1}>테스트</SelectOption>
              </Select>
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align='right'>Feature ID</TH>
            <TD colSpan={2}>
              <TextField className="width-100" readOnly value={"12345"}/>
            </TD>
            <TH required colSpan={1} align='right'>Feature 타입</TH>
            <TD colSpan={2}>
              <Select appearance="Outline" placeholder="전체" className="width-100">
                <SelectOption value={1}>테스트</SelectOption>
              </Select>
            </TD>
          </TR>
          <TR>
            <TH required colSpan={1} align='right'>한글명</TH>
            <TD colSpan={2}>
              <Stack gap="SM" className="width-100">
                <TextField className="width-100" />
                <Button>중복확인</Button>
              </Stack>
            </TD>
            <TH required colSpan={1} align='right'>영문명</TH>
            <TD colSpan={2}>
              <Stack gap="SM" className="width-100">
                <TextField className="width-100" />
                <Button>중복확인</Button>
              </Stack>
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} required align='right'>Feature 정의</TH> 
            <TD colSpan={5.01}>
              <TextField className="width-100" multiline/>
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align='right'>산출단위</TH>
            <TD colSpan={5.01}>
              <Select appearance="Outline" placeholder="전체" className="width-100">
                <SelectOption value={1}>테스트</SelectOption>
              </Select>
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align='right'>산출로직</TH>
            <TD colSpan={5.01}>
              <TextField className="width-100" multiline/>
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align='right'>비고</TH>
            <TD colSpan={5.01}>
              <TextField className="width-100" multiline/>
            </TD>
          </TR>
        </HorizontalTable>
      </Stack>

      <Stack direction="Vertical" gap="MD">
        <Typography variant="h3">신청 정보</Typography>
        <HorizontalTable>
          <TR>
            <TH align='right' colSpan={1}>Feature 신청자</TH>
            <TD colSpan={2}>
              <Stack gap="SM" className="width-100">
                <TextField className="width-100" size='MD' />
                <Button
                  appearance="Contained"
                  priority="Normal"
                  shape="Square"
                  size="MD"
                >
                  <span className="searchIcon"></span>
                </Button>
              </Stack>
            </TD>
            <TH align='right' colSpan={1}>신청부서</TH>
            <TD colSpan={2}>
              <TextField className="width-100" size='MD' />
            </TD>
          </TR>
        </HorizontalTable>
      </Stack>

      <Stack gap="SM" justifyContent="End">
        <Button priority="Primary" appearance="Contained" size="LG">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor"></path></svg>
          등록
        </Button>
        <Button size="LG" onClick={goToList}>
          목록
        </Button>
      </Stack>
    </>
  );
};
export default Reg;
