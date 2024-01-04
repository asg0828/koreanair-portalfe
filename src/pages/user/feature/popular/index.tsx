import { FavoriteBorderIcon, FavoriteIcon } from '@/assets/icons';
import DataGrid from '@/components/grid/DataGrid';
import { useCreateInterestFeature, useDeleteInterestFeature } from '@/hooks/mutations/useUserFeatureMutations';
import { usePopularFeatureList } from '@/hooks/queries/useFeatureQueries';
import { useAppSelector } from '@/hooks/useRedux';
import { ContextPath, ValidType } from '@/models/common/Constants';
import { ColumnsInfo } from '@/models/components/Table';
import { FeatureModel } from '@/models/model/FeatureModel';
import { PageModel, initPage } from '@/models/model/PageModel';
import { selectContextPath, selectSessionInfo } from '@/reducers/authSlice';
import { Stack, useToast } from '@components/ui';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const List = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const contextPath = useAppSelector(selectContextPath());
  const userId = useAppSelector(selectSessionInfo()).userId || '';
  const [page, setPage] = useState<PageModel>(initPage);
  const columns: Array<ColumnsInfo> = [
    {
      headerName: '',
      field: 'isUserFeature',
      colSpan: 0.5,
      render: (rowIndex: number) => {
        const isUserFeature = rows[rowIndex]?.isUserFeature;
        const featureId = rows[rowIndex]?.featureId;

        return (
          <Stack
            className="width-100 height-100"
            justifyContent="Center"
            onClick={(e) => {
              e.stopPropagation();
              const interestFeatureParams = {
                userId: userId,
                featureId: featureId,
              };

              if (isUserFeature) {
                dMutate(interestFeatureParams);
              } else {
                cMutate(interestFeatureParams);
              }
            }}
          >
            {isUserFeature ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon color="action" />}
          </Stack>
        );
      },
    },
    { headerName: t('bizMeta:label.featureSeGrp'), field: 'featureSeGrpNm', colSpan: 1 },
    { headerName: t('bizMeta:label.featureSe'), field: 'featureSeNm', colSpan: 1 },
    { headerName: t('bizMeta:label.featureEnNm'), field: 'featureEnNm', colSpan: 2.4, align: 'left' },
    { headerName: t('bizMeta:label.featureKoNm'), field: 'featureKoNm', colSpan: 2.4, align: 'left' },
    { headerName: t('bizMeta:label.def'), field: 'featureDef', colSpan: 2.4, align: 'left' },
    { headerName: t('bizMeta:label.userFeatureCnt'), field: 'userFeatureCnt', colSpan: 0.8 },
  ];
  const [rows, setRows] = useState<Array<FeatureModel>>([]);
  const { data: response, isError, refetch } = usePopularFeatureList();
  const { data: cResponse, isSuccess: cIsSuccess, isError: cIsError, mutate: cMutate } = useCreateInterestFeature();
  const { data: dResponse, isSuccess: dIsSuccess, isError: dIsError, mutate: dMutate } = useDeleteInterestFeature();

  const goToDetail = (row: FeatureModel) => {
    const path =
      contextPath === ContextPath.ADMIN
        ? `/biz-meta-management/feature/detail?featureId=${row.featureId}`
        : `/biz-meta/feature/detail?featureId=${row.featureId}`;
    navigate(`${contextPath}${path}`);
  };

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('common.toast.error.list'),
      });
    } else {
      if (response?.data) {
        setRows(response.data);
        setPage((prevState) => ({
          ...prevState,
          totalCount: response.data.length,
        }));
      }
    }
  }, [response, isError, toast]);

  useEffect(() => {
    if (cIsError || cResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('bizMeta:toast.error.addedInterestFeature'),
      });
    } else if (cIsSuccess) {
      toast({
        type: ValidType.CONFIRM,
        content: t('bizMeta:toast.success.addedInterestFeature'),
      });
      refetch();
    }
  }, [cResponse, cIsSuccess, cIsError, toast, refetch]);

  useEffect(() => {
    if (dIsError || dResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('bizMeta:toast.error.addedInterestFeature'),
      });
    } else if (dIsSuccess) {
      toast({
        type: ValidType.CONFIRM,
        content: t('bizMeta:toast.success.addedInterestFeature'),
      });
      refetch();
    }
  }, [dResponse, dIsSuccess, dIsError, toast, refetch]);

  return (
    <>
      <DataGrid
        isMultiSelected={false}
        clickable={true}
        showPagination={false}
        columns={columns}
        rows={rows}
        page={page}
        onClick={goToDetail}
      />
    </>
  );
};
export default List;
