import { downloadFile } from '@/api/FileAPI';
import { AttachFileIcon, ExpandLessIcon } from '@/assets/icons';
import '@/assets/styles/Board.scss';
import TinyEditor from '@/components/editor/TinyEditor';
import EmptyState from '@/components/emptyState/EmptyState';
import { useDeleteNotice } from '@/hooks/mutations/useNoticeMutations';
import { useNoticeById } from '@/hooks/queries/useNoticeQueries';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { ContextPath, ModalType, ValidType } from '@/models/common/Constants';
import { FileModel } from '@/models/model/FileModel';
import { NoticeModel, NoticeParams } from '@/models/model/NoticeModel';
import { selectContextPath } from '@/reducers/authSlice';
import { openModal } from '@/reducers/modalSlice';
import { getFileSize } from '@/utils/FileUtil';
import HorizontalTable from '@components/table/HorizontalTable';
import { Button, Link, Stack, TD, TH, TR, Typography, useToast } from '@components/ui';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Detail = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const contextPath = useAppSelector(selectContextPath());
  const location = useLocation();
  const noticeId = location?.state?.noticeId;
  const params: NoticeParams = location?.state?.params;
  const [noticeModel, setNoticeModel] = useState<NoticeModel>();
  const { data: response, isSuccess, isError } = useNoticeById(noticeId);
  const { data: dResponse, isSuccess: dIsSuccess, isError: dIsError, mutate } = useDeleteNotice(noticeId);

  const goToList = useCallback(() => {
    navigate('..', {
      state: {
        params: params,
      },
    });
  }, [params, navigate]);

  const goToEdit = () => {
    navigate('../edit', {
      state: {
        noticeId: noticeId,
        params: params,
      },
    });
  };

  const handleMoveDetail = (noticeId: string) => {
    navigate('', {
      state: {
        noticeId: noticeId,
        params: params,
      },
    });
  };

  const handleDelete = () => {
    dispatch(
      openModal({
        type: ModalType.CONFIRM,
        title: '삭제',
        content: '삭제하시겠습니까?',
        onConfirm: mutate,
      })
    );
  };

  const handleFileDownload = async (fileId: string, fileNm?: string) => {
    const isSuccess = await downloadFile(fileId, fileNm);

    if (isSuccess) {
      toast({
        type: ValidType.INFO,
        content: '파일이 다운로드되었습니다.',
      });
    } else {
      toast({
        type: ValidType.ERROR,
        content: '파일 다운로드 중 에러가 발생했습니다.',
      });
    }
  };

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '조회 중 에러가 발생했습니다.',
      });
    } else if (isSuccess && response.data) {
      response.data.fileList?.forEach((item: FileModel) => (item.fileSizeNm = getFileSize(item.fileSize)));
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
      goToList();
    }
  }, [dResponse, dIsSuccess, dIsError, goToList, navigate, toast]);

  if (!noticeId) {
    return (
      <EmptyState
        type="warning"
        description="조회에 필요한 정보가 없습니다"
        confirmText="돌아가기"
        onConfirm={goToList}
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
            <TH colSpan={1} align="right" className="attachFile">
              첨부파일
            </TH>
            <TD colSpan={5} align="left">
              <ul className="attachFileList">
                {noticeModel?.fileList.map((file: FileModel) => (
                  <li>
                    <Link onClick={() => handleFileDownload(file.fileId, file.fileNm)}>
                      <Stack>
                        <AttachFileIcon />
                        {`${file.fileNm} (${file.fileSizeNm})`}
                      </Stack>
                    </Link>
                  </li>
                ))}
              </ul>
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">
              다음
              <ExpandLessIcon fontSize="small" />
            </TH>
            <TD colSpan={5} align="left" className="nextContent">
              {noticeModel?.nextSj && (
                <Link linkType="Page" onClick={() => handleMoveDetail(noticeModel?.nextId)}>
                  {noticeModel?.nextSj}
                </Link>
              )}
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">
              이전
              <ExpandLessIcon fontSize="small" />
            </TH>
            <TD colSpan={5} align="left" className="nextContent">
              {noticeModel?.preSj && (
                <Link linkType="Page" onClick={() => handleMoveDetail(noticeModel?.preId)}>
                  {noticeModel?.preSj}
                </Link>
              )}
            </TD>
          </TR>
        </HorizontalTable>
      </Stack>

      <Stack gap="SM" justifyContent="End">
        {contextPath === ContextPath.ADMIN && (
          <>
            <Button priority="Primary" appearance="Contained" size="LG" onClick={goToEdit}>
              수정
            </Button>
            <Button priority="Normal" size="LG" onClick={handleDelete}>
              삭제
            </Button>
          </>
        )}
        <Button size="LG" onClick={goToList}>
          목록
        </Button>
      </Stack>
    </>
  );
};
export default Detail;
