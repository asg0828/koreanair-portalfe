import '@/assets/styles/Board.scss';
import TinyEditor from '@/components/editor/TinyEditor';
import EmptyState from '@/components/emptyState/EmptyState';
import { useDeleteQna } from '@/hooks/mutations/useQnaMutations';
import { useQnaById } from '@/hooks/queries/useQnaQueries';
import useModal from '@/hooks/useModal';
import { QnaInfo } from '@/models/board/Qna';
import { ModalTitle, ModalType, ValidType } from '@/models/common/Constants';
import HorizontalTable from '@components/table/HorizontalTable';
import { Button, Link, Stack, TD, TH, TR, Typography, useToast, TextField, Label } from '@components/ui';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Detail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { openModal } = useModal();
  const [dataroomInfo, setQnaInfo] = useState<QnaInfo>();
  const [prevQnaInfo, setPrevQnaInfo] = useState<QnaInfo>();
  const [nextQnaInfo, setNextQnaInfo] = useState<QnaInfo>();
  const qnaId: string = location?.state?.qnaId || '';
  const rows: Array<QnaInfo> = location?.state?.rows;
  const { data: response, isSuccess, isError } = useQnaById(qnaId);
  const { mutate, data: dResponse, isSuccess: dIsSuccess, isError: dIsError } = useDeleteQna(qnaId);

  const goToList = () => {
    navigate('..');
  };

  const goToEdit = () => {
    navigate('../edit', {
      state: {
        qnaId: qnaId,
      },
    });
  };

  const handleMoveDetail = (qnaId: string | undefined) => {
    navigate('', {
      state: {
        qnaId: qnaId,
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
      const index = rows.findIndex((row) => row.qnaId === qnaId);
      setPrevQnaInfo(index === 0 ? undefined : rows[index - 1]);
      setNextQnaInfo(index === rows.length - 1 ? undefined : rows[index + 1]);
    }
  }, [qnaId, rows]);

  useEffect(() => {
    isSuccess && setQnaInfo(response.data);
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

  if (!qnaId) {
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
              <Stack className="headerNameWrap">
                <Typography variant="h3">{dataroomInfo?.sj}</Typography>
                  <ul>
                    <li>기타</li>
                    <li>서비스 개발본부 관리자</li>
                    <li>0000-00-00 00:00:00</li>
                    <li>조회수<span>60</span></li>
                  </ul>
              </Stack>
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
            <TD colSpan={4} className="reply">
              <Stack direction="Vertical" gap="SM" className="width-100">
                <Typography variant="h6">Comment <span className="total">1</span>건</Typography>
                <Stack>
                  <TextField size="LG" className="width-100" />
                  <Button size="LG" >등록</Button>
                </Stack>
                <Stack>
                  <Stack gap="SM" className="width-100">
                    <Label>서비스개발본부 관리자</Label>
                    <Typography variant="h6">서비스개발본부 관리자</Typography>
                    <Label>2023-09-25 06:37:38</Label>
                  </Stack>
                  <Stack>
                    <Button appearance="Unfilled">답글</Button>
                    <Button appearance="Unfilled">수정</Button>
                    <Button appearance="Unfilled">삭제</Button>
                  </Stack>
                </Stack>
                <Label>답변완료.</Label>
                <Typography variant="body1">답변완료</Typography>
              </Stack>
            </TD>
          </TR>
          <TR>
            <TH colSpan={1}>
              다음
              <ExpandLessIcon fontSize="small" />
            </TH>
            <TD colSpan={3} className="nextContent">
              {nextQnaInfo?.sj && (
                <Link linkType="Page" onClick={() => handleMoveDetail(nextQnaInfo?.qnaId)}>
                  {nextQnaInfo?.sj}
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
              {prevQnaInfo?.sj && (
                <Link linkType="Page" onClick={() => handleMoveDetail(prevQnaInfo?.qnaId)}>
                  {prevQnaInfo?.sj}
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
