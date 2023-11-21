import DataGrid from '@/components/grid/DataGrid';
import { useDeleteMultipleUserFeature } from '@/hooks/mutations/useUserFeatureMutations';
import { useUserFeatureList } from '@/hooks/queries/useUserFeatureQueries';
import useDidMountEffect from '@/hooks/useDidMountEffect';
import { useAppSelector } from '@/hooks/useRedux';
import { ValidType, View } from '@/models/common/Constants';
import { FeatureModel } from '@/models/model/FeatureModel';
import { PageModel, initPage } from '@/models/model/PageModel';
import { selectSessionInfo } from '@/reducers/authSlice';
import { Button, useToast } from '@components/ui';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const columns = [
  { headerName: '대구분', field: 'featureSeGrpNm', colSpan: 1 },
  { headerName: '중구분', field: 'featureSeNm', colSpan: 1 },
  { headerName: 'Feature 한글명', field: 'featureKoNm', colSpan: 1 },
  { headerName: 'Feature 영문명', field: 'featureEnNm', colSpan: 1 },
  { headerName: '정의', field: 'featureDef', colSpan: 2 },
  { headerName: 'Feature 신청자', field: 'enrUserNm', colSpan: 1 },
  { headerName: '신청부서', field: 'enrDeptNm', colSpan: 1 },
];

const List = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const userId = useAppSelector(selectSessionInfo()).employeeNumber || '';
  const [featureIds, setFeatureIds] = useState<Array<string>>([]);
  const [page, setPage] = useState<PageModel>(initPage);
  const [rows, setRows] = useState<Array<FeatureModel>>([]);
  const { data: response, isError, refetch } = useUserFeatureList(userId, page);
  const {
    data: dmResponse,
    isSuccess: dmIsSuccess,
    isError: dmIsError,
    mutate: dmMutate,
  } = useDeleteMultipleUserFeature(userId, featureIds);

  const goToDetail = (row: FeatureModel, index: number) => {
    navigate(View.DETAIL, {
      state: {
        featureId: row.featureId,
      },
    });
  };

  const handleRemoveUserFeature = () => {
    dmMutate();
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
        content: '조회 중 에러가 발생했습니다.',
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
        content: '삭제 중 에러가 발생했습니다.',
      });
    } else if (dmIsSuccess) {
      toast({
        type: ValidType.CONFIRM,
        content: '삭제되었습니다.',
      });
      handleSearch();
    }
  }, [dmResponse, dmIsSuccess, dmIsError, toast, handleSearch]);

  return (
    <>
      <DataGrid
        columns={columns}
        rows={rows}
        enableSort={true}
        clickable={true}
        page={page}
        onClick={goToDetail}
        onChange={handlePage}
        rowSelection={(list: Array<number>) => {
          setFeatureIds(list.map((index) => rows[index].featureId));
        }}
        buttonChildren={
          <Button priority="Primary" appearance="Contained" size="LG" onClick={handleRemoveUserFeature}>
            관심 해제
          </Button>
        }
      />
    </>
  );
};
export default List;
