import SearchForm from '@/components/form/SearchForm';
import { RowsInfo } from '@/models/components/Table';
import { TR, TH, TD, Button, Stack, TextField, Select, SelectOption, Typography, Label, Pagination } from '@components/ui';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent,} from '@ke-design/components';
// import { listColumns as columns, listRows as rows } from '@/utils/data/tableSampleData';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const List = () => {
  const navigate = useNavigate();

  const goToReg = () => {
    navigate('reg');
  };

  const goToDetail = (row: RowsInfo) => {
    navigate('detail', { state: row });
  };

  const clickRow = (row: RowsInfo, index: number) => {
    goToDetail(row);
  };

  return (
    <>
      <SearchForm>
        <TR>
          <TH colSpan={1} align="right">
            검색
          </TH>
          <TD colSpan={3}>
            <Stack gap="SM" className="width-100">
              <Select appearance="Outline" placeholder="전체" className="select-basic">
                <SelectOption value={1}>테스트</SelectOption>
              </Select>
              <TextField className="width-100" />
            </Stack>
          </TD>
        </TR>
      </SearchForm>

      <Stack className="dataGridWrap" direction="Vertical" gap="MD">
        <Stack className="total-layout">
          <Label>
            총 <span className="total">0</span> 건
          </Label>
          <Select appearance="Outline" size="LG" className="select-page" defaultValue={10}>
            <SelectOption value={10}>10건</SelectOption>
            <SelectOption value={30}>30건</SelectOption>
            <SelectOption value={50}>30건</SelectOption>
          </Select>
        </Stack>
        <Stack className="accordionWrap width-100">
          <Accordion defaultValue="item01" type="single" size="LG">
            <AccordionItem title="[시스템] 시스템 질문1" value="item01">
              {/* 관리자 FAQ 수정 삭제 */}
              {/* <Stack justifyContent="End" gap="SM" className="width-100">
                <Button appearance="Unfilled">수정</Button>
                <Button appearance="Unfilled">삭제</Button>
              </Stack> */}
              <Typography variant="body1" className="answer">
                시스템 질문1 답변입니다.
              </Typography>
            </AccordionItem>
            <AccordionItem title="[기타] 권한신청 결재선 설정방법" value="item02">
              <Typography variant="body1" className="answer">
                권한신청 결재선 설정방법입니다
              </Typography>
            </AccordionItem>
            <AccordionItem title="[기타] 권한신청 결재선 설정방법" value="item03">
              <Typography variant="body1" className="answer">
                권한신청 결재선 설정방법입니다
              </Typography>
            </AccordionItem>
            <AccordionItem title="[기타] 권한신청 결재선 설정방법" value="item04">
              <Typography variant="body1" className="answer">
                권한신청 결재선 설정방법입니다
              </Typography>
            </AccordionItem>
            <AccordionItem title="[기타] 권한신청 결재선 설정방법" value="item05">
              <Typography variant="body1" className="answer">
                권한신청 결재선 설정방법입니다
              </Typography>
            </AccordionItem>
            <AccordionItem title="[기타] 권한신청 결재선 설정방법" value="item06">
              <Typography variant="body1" className="answer">
                권한신청 결재선 설정방법입니다
              </Typography>
            </AccordionItem>
            <AccordionItem title="[기타] 권한신청 결재선 설정방법" value="item07">
              <Typography variant="body1" className="answer">
                권한신청 결재선 설정방법입니다
              </Typography>
            </AccordionItem>
            <AccordionItem title="[기타] 권한신청 결재선 설정방법" value="item08">
              <Typography variant="body1" className="answer">
                권한신청 결재선 설정방법입니다
              </Typography>
            </AccordionItem>
            <AccordionItem title="[기타] 권한신청 결재선 설정방법" value="item09">
              <Typography variant="body1" className="answer">
                권한신청 결재선 설정방법입니다
              </Typography>
            </AccordionItem>

            <AccordionItem title="[기타] 권한신청 결재선 설정방법" value="item10">
              <Typography variant="body1" className="answer">
                권한신청 결재선 설정방법입니다
              </Typography>
            </AccordionItem>
          </Accordion>
        </Stack>
        <Pagination size="MD" className="pagination" />
        <Stack justifyContent="End" gap="SM" className="width-100">
          <Button priority="Primary" appearance="Contained" size="LG" onClick={goToReg}>
            <AddIcon />
            등록
          </Button>
        </Stack>
      </Stack>
    </>
  );
};
export default List;
