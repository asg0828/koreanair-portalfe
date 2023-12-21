import DataGrid from '@/components/grid/DataGrid';
import { useDeleteMultipleInterestFeature } from '@/hooks/mutations/useUserFeatureMutations';
import { useInterestFeatureList } from '@/hooks/queries/useFeatureQueries';
import useDidMountEffect from '@/hooks/useDidMountEffect';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { ContextPath, ModalType, ValidType } from '@/models/common/Constants';
import { ColumnsInfo } from '@/models/components/Table';
import { FeatureModel } from '@/models/model/FeatureModel';
import { PageModel, initPage } from '@/models/model/PageModel';
import { selectContextPath, selectSessionInfo } from '@/reducers/authSlice';
import { openModal } from '@/reducers/modalSlice';
import { Button, useToast } from '@components/ui';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const List = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const contextPath = useAppSelector(selectContextPath());
  const userId = useAppSelector(selectSessionInfo()).userId || '';
  const [featureIds, setFeatureIds] = useState<Array<string>>([]);
  const [page, setPage] = useState<PageModel>(initPage);
  const [rows, setRows] = useState<Array<FeatureModel>>([]);
  const { data: response, isError, refetch } = useInterestFeatureList(userId, page);
  const {
    data: dmResponse,
    isSuccess: dmIsSuccess,
    isError: dmIsError,
    mutate: dmMutate,
  } = useDeleteMultipleInterestFeature(userId, featureIds);

  const columns: Array<ColumnsInfo> = [
    { headerName: t('bizMeta:label.featureSeGrp'), field: 'featureSeGrpNm', colSpan: 1 },
    { headerName: t('bizMeta:label.featureSe'), field: 'featureSeNm', colSpan: 1 },
    { headerName: t('bizMeta:label.featureEnNm'), field: 'featureEnNm', colSpan: 1.8, align: 'left' },
    { headerName: t('bizMeta:label.featureKoNm'), field: 'featureKoNm', colSpan: 1.8, align: 'left' },
    { headerName: t('bizMeta:label.def'), field: 'featureDef', colSpan: 1.9, align: 'left' },
    { headerName: t('bizMeta:label.enrUserNm'), field: 'enrUserNm', colSpan: 1 },
    { headerName: t('bizMeta:label.enrDeptNm'), field: 'enrDeptNm', colSpan: 1 },
  ];

  const goToDetail = (row: FeatureModel, index: number) => {
    const path = contextPath === ContextPath.ADMIN ? '/biz-meta-management/feature/detail' : '/biz-meta/feature/detail';
    navigate(`${contextPath}${path}`, {
      state: {
        featureId: row.featureId,
      },
    });
  };

  const handleRemoveInterestFeature = () => {
    if (featureIds.length === 0) {
      toast({
        type: ValidType.INFO,
        content: t('bizMeta:toast.info.notCheckedFeature'),
      });
    } else {
      dispatch(
        openModal({
          type: ModalType.CONFIRM,
          title: t('common.modal.title.delete'),
          content: t('common.modal.message.deleteFeatureConfirm'),
          onConfirm: dmMutate,
        })
      );
    }
  };

  const handleSearch = useCallback(() => {
    refetch();
  }, [refetch]);

  const handlePage = (page: PageModel) => {
    setPage(page);
  };

  useDidMountEffect(() => {
    handleSearch();
  }, [page.page, page.pageSize, handleSearch]);

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('common.toast.error.list'),
      });
    } else {
      if (response?.data) {
        setRows(response.data.contents);
        setPage(response.data.page);
      }
    }
  }, [response, isError, toast]);

  useEffect(() => {
    if (dmIsError || dmResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('bizMeta:toast.error.deletedInterestFeature'),
      });
    } else if (dmIsSuccess) {
      toast({
        type: ValidType.CONFIRM,
        content: t('bizMeta:toast.success.deletedInterestFeature'),
      });
      handleSearch();
    }
  }, [dmResponse, dmIsSuccess, dmIsError, toast, handleSearch]);

  return (
    <>
      <DataGrid
        clickable={true}
        columns={columns}
        rows={rows}
        page={page}
        onChange={handlePage}
        onClick={goToDetail}
        rowSelection={(list: Array<number>) => {
          setFeatureIds(list.map((index) => rows[index].featureId));
        }}
        buttonChildren={
          <Button priority="Primary" appearance="Contained" size="LG" onClick={handleRemoveInterestFeature}>
            {t('common.button.cancelInterestFeature')}
          </Button>
        }
      />
    </>
  );
};
export default List;
