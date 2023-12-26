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
import { selectContextPath, selectSessionInfo } from '@/reducers/authSlice';
import { openModal } from '@/reducers/modalSlice';
import { getFileSize } from '@/utils/FileUtil';
import HorizontalTable from '@components/table/HorizontalTable';
import { Button, Link, Stack, TD, TH, TR, Typography, useToast } from '@components/ui';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

const Detail = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const contextPath = useAppSelector(selectContextPath());
  const sessionInfo = useAppSelector(selectSessionInfo());
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

  const handleMoveDetail = (nNoticeId: string) => {
    navigate('', {
      state: {
        noticeId: nNoticeId,
        params: params,
      },
    });
  };

  const handleDelete = () => {
    dispatch(
      openModal({
        type: ModalType.CONFIRM,
        title: t('common.modal.title.delete'),
        content: t('common.modal.message.deleteConfirm'),
        onConfirm: mutate,
      })
    );
  };

  const handleFileDownload = async (fileId: string, fileNm?: string) => {
    const isDownload = await downloadFile(fileId, fileNm);

    if (isDownload) {
      toast({
        type: ValidType.INFO,
        content: t('common.toast.success.download'),
      });
    } else {
      toast({
        type: ValidType.ERROR,
        content: t('common.toast.error.download'),
      });
    }
  };

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('common.toast.error.list'),
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
        content: t('common.toast.error.delete'),
      });
    } else if (dIsSuccess) {
      toast({
        type: ValidType.CONFIRM,
        content: t('common.toast.success.delete'),
      });
      goToList();
    }
  }, [dResponse, dIsSuccess, dIsError, goToList, navigate, toast]);

  if (!noticeId) {
    return (
      <EmptyState
        type="warning"
        description={t('common.message.noRequireInfo')}
        confirmText={t('common.message.goBack')}
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
              {t('board:label.attachedFile')}
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
              {t('board:label.next')}
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
              {t('board:label.prev')}
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
        {(() => {
          if (contextPath === ContextPath.ADMIN) {
            if (sessionInfo.userId === noticeModel?.rgstId || sessionInfo.apldMgrAuthId === 'ma23000000001') {
              return (
                <>
                  <Button priority="Primary" appearance="Contained" size="LG" onClick={goToEdit}>
                    {t('common.button.edit')}
                  </Button>
                  <Button priority="Normal" size="LG" onClick={handleDelete}>
                    {t('common.button.delete')}
                  </Button>
                </>
              );
            } else if (sessionInfo.apldMgrAuthId === 'ma23000000002') {
              return (
                <Button priority="Normal" size="LG" onClick={handleDelete}>
                  {t('common.button.delete')}
                </Button>
              );
            }
          }
          return null;
        })()}
        <Button size="LG" onClick={goToList}>
          {t('common.button.list')}
        </Button>
      </Stack>
    </>
  );
};
export default Detail;
