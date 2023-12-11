import { FavoriteBorderIcon, FavoriteIcon } from '@/assets/icons';
import DataGrid from '@/components/grid/DataGrid';
import { useCreateInterestFeature, useDeleteInterestFeature } from '@/hooks/mutations/useUserFeatureMutations';
import { usePopularFeatureList } from '@/hooks/queries/useFeatureQueries';
import { useAppSelector } from '@/hooks/useRedux';
import { ValidType } from '@/models/common/Constants';
import { ColumnsInfo } from '@/models/components/Table';
import { FeatureModel } from '@/models/model/FeatureModel';
import { PageModel, initPage } from '@/models/model/PageModel';
import { selectContextPath, selectSessionInfo } from '@/reducers/authSlice';
import { Stack, useToast } from '@components/ui';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const List = () => {
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
    { headerName: '대구분', field: 'featureSeGrpNm', colSpan: 1 },
    { headerName: '중구분', field: 'featureSeNm', colSpan: 1 },
    { headerName: 'Feature 영문명', field: 'featureEnNm', colSpan: 1.8, align: 'left' },
    { headerName: 'Feature 한글명', field: 'featureKoNm', colSpan: 1.8, align: 'left' },
    { headerName: '정의', field: 'featureDef', colSpan: 1.9, align: 'left' },
    { headerName: 'Feature 신청자', field: 'enrUserNm', colSpan: 1 },
    { headerName: '신청부서', field: 'enrDeptNm', colSpan: 1 },
  ];
  const [rows, setRows] = useState<Array<FeatureModel>>([]);
  const { data: response, isError, refetch } = usePopularFeatureList();
  const { data: cResponse, isSuccess: cIsSuccess, isError: cIsError, mutate: cMutate } = useCreateInterestFeature();
  const { data: dResponse, isSuccess: dIsSuccess, isError: dIsError, mutate: dMutate } = useDeleteInterestFeature();

  const goToDetail = (row: FeatureModel, index: number) => {
    const path = contextPath === '/admin' ? '/biz-meta-management/feature/detail' : '/biz-meta/feature/detail';
    navigate(`${contextPath}${path}`, {
      state: {
        featureId: row.featureId,
      },
    });
  };

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '조회 중 에러가 발생했습니다.',
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
        content: '관심 Feature 추가 중 에러가 발생했습니다.',
      });
    } else if (cIsSuccess) {
      toast({
        type: ValidType.CONFIRM,
        content: '관심 Feature에 추가되었습니다.',
      });
      refetch();
    }
  }, [cResponse, cIsSuccess, cIsError, toast, refetch]);

  useEffect(() => {
    if (dIsError || dResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '관심 Feature 삭제 중 에러가 발생했습니다.',
      });
    } else if (dIsSuccess) {
      toast({
        type: ValidType.CONFIRM,
        content: '관심 Feature에서 삭제되었습니다.',
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
