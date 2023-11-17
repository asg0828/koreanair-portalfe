import '@/assets/styles/Board.scss';
import TinyEditor from '@/components/editor/TinyEditor';
import EmptyState from '@/components/emptyState/EmptyState';
import { useDeleteNotice } from '@/hooks/mutations/useNoticeMutations';
import { useNoticeById } from '@/hooks/queries/useNoticeQueries';
import { useAppDispatch } from '@/hooks/useRedux';
import { NoticeModel } from '@/models/model/NoticeModel';
import { ModalTitle, ModalType, ValidType } from '@/models/common/Constants';
import { openModal } from '@/reducers/modalSlice';
import HorizontalTable from '@components/table/HorizontalTable';
import { Button, Link, Stack, TD, TH, TR, Typography, useToast } from '@components/ui';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Detail = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const [noticeModel, setNoticeModel] = useState<NoticeModel>();
  const [prevNoticeModel, setPrevNoticeModel] = useState<NoticeModel>();
  const [nextNoticeModel, setNextNoticeModel] = useState<NoticeModel>();
  const noticeId: string = location?.state?.noticeId || '';
  const rows: Array<NoticeModel> = location?.state?.rows;
  const { data: response, isSuccess, isError } = useNoticeById(noticeId);
  const { data: dResponse, isSuccess: dIsSuccess, isError: dIsError, mutate } = useDeleteNotice(noticeId);

  const goToList = () => {
    navigate('..');
  };

  const goToEdit = () => {
    navigate('../edit', {
      state: {
        noticeId: noticeId,
      },
    });
  };

  const handleMoveDetail = (noticeId: string | undefined) => {
    navigate('', {
      state: {
        noticeId: noticeId,
        rows: rows,
      },
    });
  };

  const handleDelete = () => {
    dispatch(
      openModal({
        type: ModalType.CONFIRM,
        title: ModalTitle.REMOVE,
        content: '삭제하시겠습니까?',
        onConfirm: mutate,
      })
    );
  };

  useEffect(() => {
    if (rows?.length > 0) {
      const index = rows.findIndex((row) => row.noticeId === noticeId);
      setPrevNoticeModel(index === 0 ? undefined : rows[index - 1]);
      setNextNoticeModel(index === rows.length - 1 ? undefined : rows[index + 1]);
    }
  }, [noticeId, rows]);

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '조회 중 에러가 발생했습니다.',
      });
    } else if (isSuccess) {
      setNoticeModel(response.data);
    }
  }, [response, isSuccess, isError, toast]);

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

  if (!noticeId) {
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
              <Typography variant="h3">{noticeModel?.sj}</Typography>
            </TH>
          </TR>
          <TR className="height-100">
            <TD colSpan={4} className="content">
              <TinyEditor content={noticeModel?.cn} disabled />
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
              {nextNoticeModel?.sj && (
                <Link linkType="Page" onClick={() => handleMoveDetail(nextNoticeModel?.noticeId)}>
                  {nextNoticeModel?.sj}
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
              {prevNoticeModel?.sj && (
                <Link linkType="Page" onClick={() => handleMoveDetail(prevNoticeModel?.noticeId)}>
                  {prevNoticeModel?.sj}
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
