import { useNavigate, useLocation } from 'react-router-dom';
import { TR, TH, TD, Button, Stack, Radio, TextField, Select, SelectOption } from '@components/ui';
import HorizontalTable from '@components/table/HorizontalTable';
import UploadDropzone from '@/components/upload/UploadDropzone';
import TinyEditor from '@/components/editor/TinyEditor';
import '@/assets/styles/Board.scss';
import { AddIcon } from '@/assets/icons';

const Edit = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goToList = () => {
    navigate('..');
  };

  return (
    <>
      <Stack direction="Vertical" gap="MD" className="height-100">
        <HorizontalTable className="height-100">
          <TR>
            <TH colSpan={1} align='right'>질문</TH>
            <TD colSpan={5}>
              <Stack gap="SM" className="width-100">
                <TextField className="width-100" />
              </Stack>
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align='right'>분류</TH>
            <TD colSpan={2}>
              <Select appearance="Outline" placeholder="전체" className="width-100">
                <SelectOption value={1}>테스트</SelectOption>
              </Select>
            </TD>
            <TH colSpan={1} align='right'>게시여부</TH>
            <TD colSpan={2}  align='left'>
              <Stack gap="LG">
                <Radio name='show' label="게시" checked />
                <Radio name='show' label="미게시" />
              </Stack>
            </TD>
          </TR>
          <TR className="height-100">
            <TH colSpan={1} align='right'>답변</TH>
            <TD colSpan={5} className="content">
              <TinyEditor />
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align='right'>첨부파일</TH>
            <TD colSpan={5} className="attachFile">
              <UploadDropzone />
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align='right'>파일링크</TH>
            <TD colSpan={5}>
              <Stack gap="SM" className="width-100">
                <TextField className="width-100" />
              </Stack>
            </TD>
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
export default Edit;
