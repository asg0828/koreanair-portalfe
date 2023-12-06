import DataGrid from '@/components/grid/DataGrid';
import { useDeleteMultipleInterestFeature } from '@/hooks/mutations/useUserFeatureMutations';
import { useInterestFeatureList } from '@/hooks/queries/useFeatureQueries';
import useDidMountEffect from '@/hooks/useDidMountEffect';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { ModalType, ValidType } from '@/models/common/Constants';
import { FeatureModel } from '@/models/model/FeatureModel';
import { PageModel, initPage } from '@/models/model/PageModel';
import { selectSessionInfo } from '@/reducers/authSlice';
import { openModal } from '@/reducers/modalSlice';
import { Button, useToast } from '@components/ui';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const columns = [
  { headerName: '대구분', field: 'featureSeGrpNm', colSpan: 1 },
  { headerName: '중구분', field: 'featureSeNm', colSpan: 1 },
  { headerName: 'Feature 영문명', field: 'featureEnNm', colSpan: 1 },
  { headerName: 'Feature 한글명', field: 'featureKoNm', colSpan: 1 },
  { headerName: '정의', field: 'featureDef', colSpan: 2 },
  { headerName: 'Feature 신청자', field: 'enrUserNm', colSpan: 1 },
  { headerName: '신청부서', field: 'enrDeptNm', colSpan: 1 },
];

const List = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
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

  const handleRemoveInterestFeature = () => {
    if (featureIds.length === 0) {
      toast({
        type: ValidType.INFO,
        content: '선택된 대상이 없습니다.',
      });
    } else {
      dispatch(
        openModal({
          type: ModalType.CONFIRM,
          title: '삭제',
          content: '관심 Feature를 삭제하시겠습니까?',
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
        content: '관심 Feature 삭제 중 에러가 발생했습니다.',
      });
    } else if (dmIsSuccess) {
      toast({
        type: ValidType.CONFIRM,
        content: '관심 Feature에서 삭제되었습니다.',
      });
      handleSearch();
    }
  }, [dmResponse, dmIsSuccess, dmIsError, toast, handleSearch]);

  return (
    <>
      <DataGrid
        columns={columns}
        rows={rows}
        clickable={true}
        page={page}
        onChange={handlePage}
        rowSelection={(list: Array<number>) => {
          setFeatureIds(list.map((index) => rows[index].featureId));
        }}
        buttonChildren={
          <Button priority="Primary" appearance="Contained" size="LG" onClick={handleRemoveInterestFeature}>
            관심 해제
          </Button>
        }
      />
    </>
  );
};
export default List;
