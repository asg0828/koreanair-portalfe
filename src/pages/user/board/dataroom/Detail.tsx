import { downloadFile } from '@/api/FileAPI';
import { AttachFileIcon, ExpandLessIcon } from '@/assets/icons';
import '@/assets/styles/Board.scss';
import TinyEditor from '@/components/editor/TinyEditor';
import EmptyState from '@/components/emptyState/EmptyState';
import { useDeleteDataroom } from '@/hooks/mutations/useDataroomMutations';
import { useDataroomById } from '@/hooks/queries/useDataroomQueries';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { ModalType, ValidType } from '@/models/common/Constants';
import { DataroomModel, DataroomParams } from '@/models/model/DataroomModel';
import { FileModel } from '@/models/model/FileModel';
import { selectSessionInfo } from '@/reducers/authSlice';
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
  const sessionInfo = useAppSelector(selectSessionInfo());
  const location = useLocation();
  const dataId: string = location?.state?.dataId || '';
  const params: DataroomParams = location?.state?.params;
  const [dataroomModel, setDataroomModel] = useState<DataroomModel>();
  const { data: response, isSuccess, isError } = useDataroomById(dataId);
  const { data: dResponse, isSuccess: dIsSuccess, isError: dIsError, mutate } = useDeleteDataroom(dataId);

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
        dataId: dataId,
        params: params,
      },
    });
  };

  const handleMoveDetail = (nDataId: string) => {
    navigate('', {
      state: {
        dataId: nDataId,
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
      setDataroomModel(response.data);
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

  if (!dataId) {
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
              {t('board:label.attachedFile')}
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
              {t('board:label.next')}
              <ExpandLessIcon fontSize="small" />
            </TH>
            <TD colSpan={5} align="left" className="nextContent">
              {dataroomModel?.nextSj && (
                <Link linkType="Page" onClick={() => handleMoveDetail(dataroomModel?.nextId)}>
                  {dataroomModel?.nextSj}
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
              {dataroomModel?.preSj && (
                <Link linkType="Page" onClick={() => handleMoveDetail(dataroomModel?.preId)}>
                  {dataroomModel?.preSj}
                </Link>
              )}
            </TD>
          </TR>
        </HorizontalTable>
      </Stack>

      <Stack gap="SM" justifyContent="End">
        {(() => {
          if (sessionInfo.userId === dataroomModel?.rgstId || sessionInfo.apldMgrAuthId === 'ma23000000001') {
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
