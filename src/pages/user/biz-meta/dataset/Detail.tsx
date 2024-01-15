import '@/assets/styles/Board.scss';
import VerticalTable from '@/components/table/VerticalTable';
import { useDeleteDataset } from '@/hooks/mutations/useDatasetMutations';
import { useDatasetById } from '@/hooks/queries/useDatasetQueries';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { ContextPath, ModalType, ValidType } from '@/models/common/Constants';
import { ColumnsInfo } from '@/models/components/Table';
import { DatasetColumnModel, DatasetModel, DatasetParams } from '@/models/model/DatasetModel';
import { PageModel } from '@/models/model/PageModel';
import { FieldType } from '@/pages/user/biz-meta/dataset/Reg';
import { selectContextPath, selectSessionInfo } from '@/reducers/authSlice';
import { openModal } from '@/reducers/modalSlice';
import HorizontalTable from '@components/table/HorizontalTable';
import { Button, Stack, TD, TH, TR, Typography, useToast } from '@components/ui';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const Detail = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const contextPath = useAppSelector(selectContextPath());
  const sessionInfo = useAppSelector(selectSessionInfo());
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const mtsId: string = searchParams.get('mtsId') || '';
  const params: DatasetParams = location?.state?.params;
  const page: PageModel = location?.state?.page;
  const [datasetModel, setDatasetModel] = useState<DatasetModel>();
  const columns: Array<ColumnsInfo> = [
    {
      headerName: t('bizMeta:label.koNm'),
      field: 'mcsKoNm',
      colSpan: 2,
      maxLength: 100,
      require: true,
      align: 'left',
    },
    {
      headerName: t('bizMeta:label.enNm'),
      field: 'mcsEnNm',
      colSpan: 2,
      require: true,
      align: 'left',
    },
    {
      headerName: t('bizMeta:label.srcClNm'),
      field: 'srcClNm',
      colSpan: 2,
      require: false,
      align: 'left',
    },
    {
      headerName: t('bizMeta:label.def'),
      field: 'mcsDef',
      colSpan: 2.9,
      require: true,
      align: 'left',
    },
    {
      headerName: t('bizMeta:label.featureFm'),
      field: 'clFm',
      colSpan: 1.1,
      require: false,
      render: (rowIndex: number, fieldName: FieldType, maxLength?: number) => {
        return (
          <Stack gap="SM" className="width-100" direction="Vertical">
            <Button
              className="width-100"
              appearance="Contained"
              onClick={() => openCalculationLogicModal(rowIndex, fieldName)}
            >
              {t('common.button.visible')}
            </Button>
          </Stack>
        );
      },
    },
  ];
  const [rows, setRows] = useState<Array<DatasetColumnModel>>([]);
  const { data: response, isSuccess, isError } = useDatasetById(mtsId);
  const { mutate, data: dResponse, isSuccess: dIsSuccess, isError: dIsError } = useDeleteDataset(mtsId);

  const openCalculationLogicModal = (rowIndex: number, fieldName: FieldType) => {
    dispatch(
      openModal({
        type: ModalType.CALCULATION_LOGIC,
        title: t('bizMeta:label.featureFm'),
        content: rows[rowIndex][fieldName],
        disabled: true,
      })
    );
  };

  const goToList = useCallback(() => {
    navigate('..', {
      state: {
        params: params,
        page: page,
      },
    });
  }, [params, page, navigate]);

  const goToEdit = () => {
    navigate(`../edit`, {
      state: {
        mtsId: mtsId,
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

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('common.toast.error.read'),
      });
    } else if (isSuccess) {
      if (response.data) {
        setDatasetModel(response.data);
        setRows(response.data?.columnSpecs);
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
    <Stack direction="Vertical" gap="MD" justifyContent="Between" className="height-100 width-100 detail-container">
      <Stack direction="Vertical" gap="MD" className="height-100">
        <Typography variant="h3">{t('bizMeta:header.basicInfo')}</Typography>
        <HorizontalTable>
          <TR>
            <TH required colSpan={1} align="right">
              {t('bizMeta:label.tableKoNm')}
            </TH>
            <TD colSpan={2} align="left">
              {datasetModel?.mtsKoNm}
            </TD>
            <TH required colSpan={1} align="right">
              {t('bizMeta:label.tableEnNm')}
            </TH>
            <TD colSpan={2} align="left">
              {datasetModel?.mtsEnNm}
            </TD>
          </TR>
          <TR>
            <TH required colSpan={1} align="right">
              {t('bizMeta:label.tableDef')}
            </TH>
            <TD colSpan={5} align="left">
              {datasetModel?.mtsDef}
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} required align="right">
              {t('bizMeta:label.columnDef')}
            </TH>
            <TD colSpan={5} align="left" className="height-300 overflow-auto">
              <Stack gap="SM" className="width-100 height-100" direction="Vertical" alignItems="Start">
                <VerticalTable
                  className="tableTdScrollFix width-100"
                  columns={columns}
                  rows={rows}
                  isMultiSelected={false}
                  clickable={false}
                />
              </Stack>
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">
              {t('bizMeta:label.srcSys')}
            </TH>
            <TD colSpan={5} align="left">
              {datasetModel?.srcSys}
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">
              {t('bizMeta:label.srcTbNm')}
            </TH>
            <TD colSpan={5} align="left">
              {datasetModel?.srcTbNm}
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">
              {t('bizMeta:label.dbNm')}
            </TH>
            <TD colSpan={5} align="left">
              {datasetModel?.srcDbCd}
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">
              {t('bizMeta:label.featureDsc')}
            </TH>
            <TD colSpan={5} align="left">
              {datasetModel?.mtsDsc}
            </TD>
          </TR>
        </HorizontalTable>
      </Stack>

      <Stack gap="SM" justifyContent="End">
        {(() => {
          if (contextPath === ContextPath.ADMIN) {
            if (sessionInfo.userId === datasetModel?.rgstId || sessionInfo.apldMgrAuthId === 'ma23000000001') {
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
    </Stack>
  );
};
export default Detail;
