import { useNavigate, useLocation } from 'react-router-dom';
import { TR, TH, TD, Button, Stack, Radio, TextField } from '@components/ui';
import HorizontalTable from '@components/table/HorizontalTable';
import UploadDropzone from '@/components/upload/UploadDropzone';
import TinyEditor from '@/components/editor/TinyEditor';
import '@/assets/styles/Board.scss';

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
            <TH colSpan={1}>제목</TH>
            <TD colSpan={3}>
              <Stack gap="SM" className="width-100">
                <TextField className="width-100" />
              </Stack>
            </TD>
          </TR>
          <TR>
            <TH colSpan={1}>게시여부</TH>
            <TD colSpan={3}>
              <Stack gap="LG" className="width-100">
                <Radio label="공개" checked />
                <Radio label="비공개" />
              </Stack>
            </TD>
          </TR>
          <TR className="height-100">
            <TH colSpan={1}>내용</TH>
            <TD colSpan={3} className="content">
              <TinyEditor />
            </TD>
          </TR>
          <TR>
            <TH colSpan={1}>첨부파일</TH>
            <TD colSpan={3} className="attachFile">
              <UploadDropzone />
            </TD>
          </TR>
          <TR>
            <TH colSpan={1}>파일링크</TH>
            <TD colSpan={3}>
              <Stack gap="SM" className="width-100">
                <TextField className="width-100" />
              </Stack>
            </TD>
          </TR>
        </HorizontalTable>
      </Stack>

      <Stack gap="SM" justifyContent="End">
        <Button priority="Primary" appearance="Contained" size="LG">
          등록
        </Button>
        <Button size="LG" onClick={goToList}>
          목록
        </Button>
      </Stack>
    </>
  );
};
export default Edit;
