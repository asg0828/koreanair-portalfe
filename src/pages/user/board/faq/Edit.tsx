import { useNavigate, useLocation } from 'react-router-dom';
import { TR, TH, TD, Button, Stack, Radio, TextField, Select, SelectOption, Typography, Label } from '@components/ui';
import SearchForm from '@/components/form/SearchForm';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent,} from '@ke-design/components';
import HorizontalTable from '@components/table/HorizontalTable';
import UploadDropzone from '@/components/upload/UploadDropzone';
import TinyEditor from '@/components/editor/TinyEditor';
import '@/assets/styles/Board.scss';
import AddIcon from '@mui/icons-material/Add';

const Edit = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goToList = () => {
    navigate('..');
  };

  const goToReg = () => {
    navigate('reg');
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
          <Label>총 <span className="total">0</span> 건</Label>
          <Select
            appearance="Outline"
            size="LG"
            className="select-page"
            defaultValue={10}
            >
            <SelectOption value={10}>10건</SelectOption>
            <SelectOption value={30}>30건</SelectOption>
            <SelectOption value={50}>30건</SelectOption>
          </Select>  
        </Stack>
        <Stack className="accordionWrap width-100">
          <Accordion defaultValue="item01" type="single" size="LG">
            <AccordionItem title="[시스템] 시스템 질문1" value="item01">
              <Stack justifyContent="End" gap="SM" className="width-100">
                <Button>수정</Button>
                <Button>삭제</Button>
              </Stack>
              <Typography variant="body1" className="answer">
                시스템 질문1 답변입니다.
              </Typography>
            </AccordionItem>
            <AccordionItem
              title="[기타] 권한신청 결재선 설정방법"
              value="item02"
            >
              <Stack justifyContent="End" gap="SM" className="width-100">
                <Button>수정</Button>
                <Button>삭제</Button>
              </Stack>
              <Typography variant="body1" className="answer">
              권한신청 결재선 설정방법입니다
              </Typography>
            </AccordionItem>
            <AccordionItem
              title="[기타] 권한신청 결재선 설정방법"
              value="item03"
            >
              <Stack justifyContent="End" gap="SM" className="width-100">
                <Button>수정</Button>
                <Button>삭제</Button>
              </Stack>
              <Typography variant="body1" className="answer">
              권한신청 결재선 설정방법입니다
              </Typography>
            </AccordionItem>
            <AccordionItem
              title="[기타] 권한신청 결재선 설정방법"
              value="item04"
            >
              <Stack justifyContent="End" gap="SM" className="width-100">
                <Button>수정</Button>
                <Button>삭제</Button>
              </Stack>
              <Typography variant="body1" className="answer">
              권한신청 결재선 설정방법입니다
              </Typography>
            </AccordionItem>
            <AccordionItem
              title="[기타] 권한신청 결재선 설정방법"
              value="item05"
            >
              <Stack justifyContent="End" gap="SM" className="width-100">
                <Button>수정</Button>
                <Button>삭제</Button>
              </Stack>
              <Typography variant="body1" className="answer">
              권한신청 결재선 설정방법입니다
              </Typography>
            </AccordionItem>
            <AccordionItem
              title="[기타] 권한신청 결재선 설정방법"
              value="item06"
            >
              <Stack justifyContent="End" gap="SM" className="width-100">
                <Button>수정</Button>
                <Button>삭제</Button>
              </Stack>
              <Typography variant="body1" className="answer">
              권한신청 결재선 설정방법입니다
              </Typography>
            </AccordionItem>
            <AccordionItem
              title="[기타] 권한신청 결재선 설정방법"
              value="item07"
            >
              <Stack justifyContent="End" gap="SM" className="width-100">
                <Button>수정</Button>
                <Button>삭제</Button>
              </Stack>
              <Typography variant="body1" className="answer">
              권한신청 결재선 설정방법입니다
              </Typography>
            </AccordionItem>
            <AccordionItem
              title="[기타] 권한신청 결재선 설정방법"
              value="item08"
            >
              <Stack justifyContent="End" gap="SM" className="width-100">
                <Button>수정</Button>
                <Button>삭제</Button>
              </Stack>
              <Typography variant="body1" className="answer">
              권한신청 결재선 설정방법입니다
              </Typography>
            </AccordionItem>
            <AccordionItem
              title="[기타] 권한신청 결재선 설정방법"
              value="item09"
            >
              <Stack justifyContent="End" gap="SM" className="width-100">
                <Button>수정</Button>
                <Button>삭제</Button>
              </Stack>
              <Typography variant="body1" className="answer">
              권한신청 결재선 설정방법입니다
              </Typography>
            </AccordionItem>
            <AccordionItem
              title="[기타] 권한신청 결재선 설정방법"
              value="item10"
            >
              <Stack justifyContent="End" gap="SM" className="width-100">
                <Button>수정</Button>
                <Button>삭제</Button>
              </Stack>
              <Typography variant="body1" className="answer">
              권한신청 결재선 설정방법입니다
              </Typography>
            </AccordionItem>
          </Accordion>
        </Stack>
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
export default Edit;
