import '@/assets/styles/Board.scss';
import EmptyState from '@/components/emptyState/EmptyState';
import VerticalTable from '@/components/table/VerticalTable';
import { useDeleteDataset } from '@/hooks/mutations/useDatasetMutations';
import { useDatasetById } from '@/hooks/queries/useDatasetQueries';
import { useAppDispatch } from '@/hooks/useRedux';
import { ModalTitle, ModalType, ValidType } from '@/models/common/Constants';
import { ColumnsInfo } from '@/models/components/Table';
import { DatasetColumnModel, DatasetModel } from '@/models/model/DatasetModel';
import { fieldType } from '@/pages/user/biz-meta/dataset/Reg';
import { openModal } from '@/reducers/modalSlice';
import HorizontalTable from '@components/table/HorizontalTable';
import { Button, Stack, TD, TH, TR, TextField, Typography, useToast } from '@components/ui';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Detail = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const mtsId: string = location?.state?.mtsId || '';
  const [datasetModel, setDatasetModel] = useState<DatasetModel>();
  const columns: Array<ColumnsInfo> = [
    {
      headerName: '영문명',
      field: 'mcsEnNm',
      colSpan: 1.5,
      require: true,
    },
    {
      headerName: '한글명',
      field: 'mcsKoNm',
      colSpan: 1.5,
      maxLength: 100,
      require: true,
    },
    {
      headerName: '원천 컬럼명',
      field: 'srcClNm',
      colSpan: 1.5,
      require: true,
    },
    {
      headerName: '정의',
      field: 'mcsDef',
      colSpan: 3.9,
      require: true,
    },
    {
      headerName: '산출로직',
      field: 'clFm',
      colSpan: 1.1,
      require: true,
      render: (rowIndex: number, fieldName: fieldType, maxLength?: number) => {
        return (
          <Stack gap="SM" className="width-100" direction="Vertical">
            <Button
              className="width-100"
              appearance="Contained"
              onClick={() => openCalculationLogicModal(rowIndex, fieldName)}
            >
              보기
            </Button>
          </Stack>
        );
      },
    },
  ];
  const [rows, setRows] = useState<Array<DatasetColumnModel>>([]);
  const { data: response, isSuccess, isError } = useDatasetById(mtsId);
  const { mutate, data: dResponse, isSuccess: dIsSuccess, isError: dIsError } = useDeleteDataset(mtsId);

  const openCalculationLogicModal = (rowIndex: number, fieldName: fieldType) => {
    dispatch(
      openModal({
        type: ModalType.CALCULATION_LOGIC,
        title: '산출로직',
        content: rows[rowIndex][fieldName],
        disabled: true,
      })
    );
  };

  const goToList = () => {
    navigate('..');
  };

  const goToEdit = () => {
    navigate('../edit', {
      state: {
        mtsId: mtsId,
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
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '조회 중 에러가 발생했습니다.',
      });
    } else if (isSuccess) {
      setDatasetModel(response.data);
      setRows(response.data?.columnSpecs);
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

  if (!mtsId) {
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
    <Stack direction="Vertical" gap="MD" justifyContent="Between" className="height-100 width-100">
      <Stack direction="Vertical" gap="MD" className="height-100">
        <Typography variant="h3">기본 정보</Typography>
        <HorizontalTable>
          <TR>
            <TH required colSpan={1} align="right">
              테이블 영문명
            </TH>
            <TD colSpan={2} align="left">
              {datasetModel?.mtsEnNm}
            </TD>
            <TH required colSpan={1} align="right">
              테이블 한글명
            </TH>
            <TD colSpan={2} align="left">
              {datasetModel?.mtsKoNm}
            </TD>
          </TR>
          <TR>
            <TH required colSpan={1} align="right">
              테이블 정의
            </TH>
            <TD colSpan={5} align="left">
              {datasetModel?.mtsDef}
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} required align="right">
              컬럼 정의
            </TH>
            <TD colSpan={5} align="left" className="height-300 overflow-auto">
              <Stack gap="SM" className="width-100 height-100" direction="Vertical" alignItems="Start">
                <VerticalTable columns={columns} rows={rows} />
              </Stack>
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">
              원천시스템
            </TH>
            <TD colSpan={5} align="left">
              {datasetModel?.srcSys}
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">
              원천테이블명
            </TH>
            <TD colSpan={5} align="left">
              {datasetModel?.srcTbNm}
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">
              DB명
            </TH>
            <TD colSpan={5} align="left">
              {datasetModel?.srcDbCd}
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="right">
              비고
            </TH>
            <TD colSpan={5} align="left">
              {datasetModel?.mtsDsc}
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
    </Stack>
  );
};
export default Detail;
