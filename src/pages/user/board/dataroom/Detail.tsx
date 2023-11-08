import '@/assets/styles/Board.scss';
import TinyEditor from '@/components/editor/TinyEditor';
import EmptyState from '@/components/emptyState/EmptyState';
import { useDeleteDataroom } from '@/hooks/mutations/useDataroomMutations';
import { useDataroomById } from '@/hooks/queries/useDataroomQueries';
import useModal from '@/hooks/useModal';
import { DataroomInfo } from '@/models/Board/Dataroom';
import { ModalTitle, ModalType, ValidType } from '@/models/common/Constants';
import HorizontalTable from '@components/table/HorizontalTable';
import { Button, Link, Stack, TD, TH, TR, Typography, useToast } from '@components/ui';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Detail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { openModal } = useModal();
  const [dataroomInfo, setDataroomInfo] = useState<DataroomInfo>();
  const [prevDataroomInfo, setPrevDataroomInfo] = useState<DataroomInfo>();
  const [nextDataroomInfo, setNextDataroomInfo] = useState<DataroomInfo>();
  const dataId: string = location?.state?.dataId || '';
  const rows: Array<DataroomInfo> = location?.state?.rows;
  const { data: response, isSuccess, isError } = useDataroomById(dataId);
  const { mutate, data: dResponse, isSuccess: dIsSuccess, isError: dIsError } = useDeleteDataroom(dataId);

  const goToList = () => {
    navigate('..');
  };

  const goToEdit = () => {
    navigate('../edit', {
      state: {
        dataId: dataId,
      },
    });
  };

  const handleMoveDetail = (dataId: string | undefined) => {
    navigate('', {
      state: {
        dataId: dataId,
        rows: rows,
      },
    });
  };

  const handleDelete = () => {
    openModal({
      type: ModalType.CONFIRM,
      title: ModalTitle.REMOVE,
      content: '삭제하시겠습니까?',
      onConfirm: mutate,
    });
  };

  useEffect(() => {
    if (rows?.length > 0) {
      const index = rows.findIndex((row) => row.dataId === dataId);
      setPrevDataroomInfo(index === 0 ? undefined : rows[index - 1]);
      setNextDataroomInfo(index === rows.length - 1 ? undefined : rows[index + 1]);
    }
  }, [dataId, rows]);

  useEffect(() => {
    isSuccess && setDataroomInfo(response.data);
  }, [isSuccess, response?.data]);

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '조회 중 에러가 발생했습니다.',
      });
    }
  }, [response, isError, toast]);

  useEffect(() => {
    if (dIsError || dResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '삭제 중 에러가 발생했습니다.',
      });
    } else if (dIsSuccess) {
      toast({
        type: ValidType.CONFIRM,
        content: '삭제되었습니다.',
      });
      navigate('..');
    }
  }, [dResponse, dIsSuccess, dIsError, toast, navigate]);

  if (!dataId) {
    return (
      <EmptyState
        type="warning"
        description="조회에 필요한 정보가 없습니다"
        confirmText="돌아가기"
        onConfirm={() => navigate('..')}
      />
    );
  }

  return (
    <>
      <Stack direction="Vertical" gap="MD" className="height-100 contentDeatilWrap">
        <HorizontalTable className="height-100">
          <TR>
            <TH colSpan={4} className="headerName">
              <Typography variant="h3">{dataroomInfo?.sj}</Typography>
            </TH>
          </TR>
          <TR className="height-100">
            <TD colSpan={4} className="content">
              <TinyEditor content={dataroomInfo?.cn} disabled />
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} className="attachFile">
              첨부파일
            </TH>
            <TD colSpan={3}>
              {/* <ul className="attachFileList">
                <li>
                  <Link target="_blank">
                    <AttachFileIcon />
                    첨부파일입니다.
                  </Link>
                </li>
              </ul> */}
            </TD>
          </TR>
          <TR>
            <TH colSpan={1}>
              다음
              <ExpandLessIcon fontSize="small" />
            </TH>
            <TD colSpan={3} className="nextContent">
              {nextDataroomInfo?.sj && (
                <Link linkType="Page" onClick={() => handleMoveDetail(nextDataroomInfo?.dataId)}>
                  {nextDataroomInfo?.sj}
                </Link>
              )}
            </TD>
          </TR>
          <TR>
            <TH colSpan={1}>
              이전
              <ExpandLessIcon fontSize="small" />
            </TH>
            <TD colSpan={3} className="nextContent">
              {prevDataroomInfo?.sj && (
                <Link linkType="Page" onClick={() => handleMoveDetail(prevDataroomInfo?.dataId)}>
                  {prevDataroomInfo?.sj}
                </Link>
              )}
            </TD>
          </TR>
        </HorizontalTable>
      </Stack>

      <Stack gap="SM" justifyContent="End">
        <Button priority="Primary" appearance="Contained" size="LG" onClick={goToEdit}>
          수정
        </Button>
        <Button priority="Normal" size="LG" onClick={handleDelete}>
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
