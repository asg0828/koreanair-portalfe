import { downloadFile } from '@/api/FileAPI';
import { AttachFileIcon, ExpandLessIcon } from '@/assets/icons';
import '@/assets/styles/Board.scss';
import TinyEditor from '@/components/editor/TinyEditor';
import EmptyState from '@/components/emptyState/EmptyState';
import { useDeleteDataroom } from '@/hooks/mutations/useDataroomMutations';
import { useDataroomById } from '@/hooks/queries/useDataroomQueries';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { ContextPath, ModalType, ValidType } from '@/models/common/Constants';
import { DataroomModel } from '@/models/model/DataroomModel';
import { FileModel } from '@/models/model/FileModel';
import { selectContextPath } from '@/reducers/authSlice';
import { openModal } from '@/reducers/modalSlice';
import { getFileSize } from '@/utils/FileUtil';
import HorizontalTable from '@components/table/HorizontalTable';
import { Button, Link, Stack, TD, TH, TR, Typography, useToast } from '@components/ui';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Detail = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const contextPath = useAppSelector(selectContextPath());
  const dataId: string = location?.state?.dataId || '';
  const rows: Array<DataroomModel> = location?.state?.rows;
  const [dataroomModel, setDataroomModel] = useState<DataroomModel>();
  const [prevDataroomModel, setPrevDataroomModel] = useState<DataroomModel>();
  const [nextDataroomModel, setNextDataroomModel] = useState<DataroomModel>();
  const { data: response, isSuccess, isError } = useDataroomById(dataId);
  const { data: dResponse, isSuccess: dIsSuccess, isError: dIsError, mutate } = useDeleteDataroom(dataId);

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
    if (rows?.length > 0) {
      const index = rows.findIndex((row) => row.dataId === dataId);
      setPrevDataroomModel(index === 0 ? undefined : rows[index - 1]);
      setNextDataroomModel(index === rows.length - 1 ? undefined : rows[index + 1]);
    }
  }, [dataId, rows]);

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '조회 중 에러가 발생했습니다.',
      });
    } else if (isSuccess) {
      response.data.fileList?.forEach((item: FileModel) => (item.fileSizeNm = getFileSize(item.fileSize)));
      setDataroomModel(response.data);
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
              <Typography variant="h3">{dataroomModel?.sj}</Typography>
            </TH>
          </TR>
          <TR className="height-100">
            <TD colSpan={4} className="content">
              <TinyEditor content={dataroomModel?.cn} disabled />
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right" className="attachFile">
              첨부파일
            </TH>
            <TD colSpan={5} align="left">
              <ul className="attachFileList">
                {dataroomModel?.fileList.map((file: FileModel) => (
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
              {nextDataroomModel?.sj && (
                <Link linkType="Page" onClick={() => handleMoveDetail(nextDataroomModel?.dataId)}>
                  {nextDataroomModel?.sj}
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
              {prevDataroomModel?.sj && (
                <Link linkType="Page" onClick={() => handleMoveDetail(prevDataroomModel?.dataId)}>
                  {prevDataroomModel?.sj}
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
