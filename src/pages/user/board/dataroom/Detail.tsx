import { downloadFile } from '@/api/FileAPI';
import { AttachFileIcon, ExpandLessIcon, ExpandMoreIcon } from '@/assets/icons';
import '@/assets/styles/Board.scss';
import TinyEditor from '@/components/editor/TinyEditor';
import { useDeleteDataroom } from '@/hooks/mutations/useDataroomMutations';
import { useDataroomById } from '@/hooks/queries/useDataroomQueries';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { ContextPath, ModalType, ValidType } from '@/models/common/Constants';
import { DataroomModel, DataroomParams } from '@/models/model/DataroomModel';
import { FileModel } from '@/models/model/FileModel';
import { PageModel } from '@/models/model/PageModel';
import { selectContextPath, selectSessionInfo } from '@/reducers/authSlice';
import { openModal } from '@/reducers/modalSlice';
import { getFileSize } from '@/utils/FileUtil';
import { openPopup } from '@/utils/FuncUtil';
import HorizontalTable from '@components/table/HorizontalTable';
import { Button, Link, Stack, TD, TH, TR, Typography, useToast } from '@components/ui';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const Detail = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const contextPath = useAppSelector(selectContextPath());
  const sessionInfo = useAppSelector(selectSessionInfo());
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const dataId: string = searchParams.get('dataId') || '';
  const params: DataroomParams = location?.state?.params;
  const page: PageModel = location?.state?.page;
  const [dataroomModel, setDataroomModel] = useState<DataroomModel>();
  const { data: response, isSuccess, isError } = useDataroomById(dataId);
  const { data: dResponse, isSuccess: dIsSuccess, isError: dIsError, mutate } = useDeleteDataroom(dataId);

  const goToList = useCallback(() => {
    navigate('..', {
      state: {
        params: params,
        page: page,
      },
    });
  }, [params, page, navigate]);

  const goToEdit = () => {
    navigate(`../edit?dataId=${dataId}`, {
      state: {
        params: params,
        page: page,
      },
    });
  };

  const handleMoveDetail = (nDataId: string) => {
    navigate(`?dataId=${nDataId}`, {
      state: {
        params: params,
        page: page,
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
        content: t('common.toast.error.read'),
      });
    } else if (isSuccess) {
      if (response.data) {
        response.data.fileList?.forEach((item: FileModel) => (item.fileSizeNm = getFileSize(item.fileSize)));
        setDataroomModel(response.data);
      } else {
        toast({
          type: ValidType.INFO,
          content: t('common.toast.info.noData'),
        });
        goToList();
      }
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
            <TH colSpan={1} align="right">
              {t('board:label.fileLink')}
            </TH>
            <TD colSpan={5}>
              <ul className="attachFileList">
                {dataroomModel?.fileLinks.map((fileLink: string) => (
                  <li>
                    <Link linkType="External" children={fileLink} onClick={() => openPopup(fileLink)} />
                  </li>
                ))}
              </ul>
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
              <ExpandMoreIcon fontSize="small" />
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
          if (contextPath === ContextPath.ADMIN) {
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
