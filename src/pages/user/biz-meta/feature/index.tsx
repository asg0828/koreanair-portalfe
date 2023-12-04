import { AddIcon, FavoriteBorderIcon, FavoriteIcon } from '@/assets/icons';
import SearchForm from '@/components/form/SearchForm';
import DataGrid from '@/components/grid/DataGrid';
import { useCreateInterestFeature, useDeleteInterestFeature } from '@/hooks/mutations/useUserFeatureMutations';
import { useFeatureList, useFeatureSeList, useFeatureTypList } from '@/hooks/queries/useFeatureQueries';
import useDidMountEffect from '@/hooks/useDidMountEffect';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { ContextPath, ModalType, ValidType, View } from '@/models/common/Constants';
import { ColumnsInfo } from '@/models/components/Table';
import { DeptModel } from '@/models/model/DeptModel';
import { FeatureModel, FeatureParams, FeatureSeparatesModel } from '@/models/model/FeatureModel';
import { PageModel, initPage } from '@/models/model/PageModel';
import { UserModel } from '@/models/model/UserModel';
import { selectContextPath, selectSessionInfo } from '@/reducers/authSlice';
import { openModal } from '@/reducers/modalSlice';
import { Button, Checkbox, Select, SelectOption, Stack, TD, TH, TR, TextField, useToast } from '@components/ui';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initParams: FeatureParams = {
  featureSeGrp: '',
  featureSe: '',
  searchFeature: '',
  searchConditions: [],
  enrUserId: '',
  enrUserNm: '',
  enrDeptCode: '',
  enrDeptNm: '',
};

const List = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const contextPath = useAppSelector(selectContextPath());
  const userId = useAppSelector(selectSessionInfo()).employeeNumber || '';
  const [createdFeatureId, setCreatedFeatureId] = useState<string>('');
  const [deletedFeatureId, setDeletedFeatureId] = useState<string>('');
  const [featureTypList, setFeatureTypList] = useState<Array<FeatureSeparatesModel>>();
  const [featureSeList, setFeatureSeList] = useState<Array<FeatureSeparatesModel>>([]);
  const [params, setParams] = useState<FeatureParams>(initParams);
  const [page, setPage] = useState<PageModel>(initPage);
  const columns: Array<ColumnsInfo> = [
    {
      headerName: '',
      field: 'isInterestFeature',
      colSpan: 0.5,
      render: (rowIndex: number) => {
        const isInterestFeature = rows[rowIndex]?.isInterestFeature;
        const featureId = rows[rowIndex]?.featureId;

        return (
          <Stack
            className="width-100 height-100"
            justifyContent="Center"
            onClick={(e) => {
              e.stopPropagation();

              if (isInterestFeature) {
                handleRemoveInterestFeature(featureId);
              } else {
                handleAddInterestFeature(featureId);
              }
            }}
          >
            {isInterestFeature ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon color="action" />}
          </Stack>
        );
      },
    },
    { headerName: '대구분', field: 'featureSeGrpNm', colSpan: 1 },
    { headerName: '중구분', field: 'featureSeNm', colSpan: 1 },
    { headerName: 'Feature 영문명', field: 'featureEnNm', colSpan: 1 },
    { headerName: 'Feature 한글명', field: 'featureKoNm', colSpan: 1 },
    { headerName: '정의', field: 'featureDef', colSpan: 2 },
    { headerName: 'Feature 신청자', field: 'enrUserNm', colSpan: 1 },
    { headerName: '신청부서', field: 'enrDeptNm', colSpan: 1 },
  ];
  const [rows, setRows] = useState<Array<FeatureModel>>([]);
  const { data: response, isError, refetch } = useFeatureList(params, page);
  const { data: tResponse, isError: tIsError, refetch: tRefetch } = useFeatureTypList();
  const { data: sResponse, isError: sIsError, refetch: sRefetch } = useFeatureSeList(params.featureSeGrp);
  const {
    data: cResponse,
    isSuccess: cIsSuccess,
    isError: cIsError,
    mutate: cMutate,
  } = useCreateInterestFeature(userId, createdFeatureId);
  const {
    data: dResponse,
    isSuccess: dIsSuccess,
    isError: dIsError,
    mutate: dMutate,
  } = useDeleteInterestFeature(userId, deletedFeatureId);

  const goToReg = () => {
    navigate(View.REG);
  };

  const goToDetail = (row: FeatureModel, index: number) => {
    navigate(View.DETAIL, {
      state: {
        featureId: row.featureId,
      },
    });
  };

  const handleAddInterestFeature = (featureId: string) => {
    setCreatedFeatureId(featureId);
  };

  const handleRemoveInterestFeature = (featureId: string) => {
    setDeletedFeatureId(featureId);
  };

  const handleSearch = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleClear = () => {
    setParams(initParams);
    setFeatureSeList([]);
  };

  const handlePage = (page: PageModel) => {
    setPage(page);
  };

  const handleChangeParams = (name: string, value: any) => {
    setParams((prevState) => ({
      ...prevState,
      [name]: value,
      enrUserId: '',
      enrDeptCode: '',
    }));
  };

  const handleChangeSearchConditions = (name: string, checked: any) => {
    setParams((prevState) => {
      let newSearchConditions = [...prevState.searchConditions];

      if (checked) {
        newSearchConditions.push(name);
      } else {
        newSearchConditions = newSearchConditions.filter((itemName) => itemName !== name);
      }

      return {
        ...prevState,
        searchConditions: newSearchConditions,
      };
    });
  };

  const handleUserSelectModal = () => {
    dispatch(
      openModal({
        type: ModalType.USER_SELECT,
        onConfirm: (users: UserModel) => {
          setParams((prevState) => ({
            ...prevState,
            enrUserId: users.userId,
            enrUserNm: users.userNm,
          }));
        },
      })
    );
  };

  const handleDeptSelectModal = () => {
    dispatch(
      openModal({
        type: ModalType.DEPT_SELECT,
        onConfirm: (depts: DeptModel) => {
          setParams((prevState) => ({
            ...prevState,
            enrDeptCode: depts.deptCode,
            enrDeptNm: depts.deptNm,
          }));
        },
      })
    );
  };

  useEffect(() => {
    createdFeatureId && cMutate();
  }, [createdFeatureId, cMutate]);

  useEffect(() => {
    deletedFeatureId && dMutate();
  }, [deletedFeatureId, dMutate]);

  useEffect(() => {
    if (params.featureSeGrp) {
      sRefetch();
    }
  }, [params.featureSeGrp, sRefetch]);

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
    if (tIsError || tResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (tResponse?.data) {
        setFeatureTypList(tResponse.data);
      }
    }
  }, [tResponse, tIsError, toast]);

  useEffect(() => {
    if (sIsError || sResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (sResponse?.data) {
        setFeatureSeList(sResponse.data);
      }
    }
  }, [sResponse, sIsError, toast]);

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
      <SearchForm onSearch={handleSearch} onClear={handleClear}>
        <TR>
          <TH colSpan={1} align="right">
            대구분
          </TH>
          <TD colSpan={2}>
            <Select
              appearance="Outline"
              placeholder="전체"
              className="width-100"
              onChange={(e, value) => value && handleChangeParams('featureSeGrp', value)}
              value={params.featureSeGrp}
            >
              {featureTypList?.map((item) => (
                <SelectOption value={item.seId}>{item.seNm}</SelectOption>
              ))}
            </Select>
          </TD>
          <TH colSpan={1} align="right">
            중구분
          </TH>
          <TD colSpan={2}>
            <Select
              appearance="Outline"
              placeholder="전체"
              className="width-100"
              onChange={(e, value) => value && handleChangeParams('featureSe', value)}
              value={params.featureSe}
            >
              {featureSeList.map((item) => (
                <SelectOption value={item.seId}>{item.seNm}</SelectOption>
              ))}
            </Select>
          </TD>
        </TR>
        <TR>
          <TH colSpan={1} align="right">
            검색 Feature
          </TH>
          <TD colSpan={5} align="left">
            <TextField
              className="width-100"
              size="MD"
              onChange={(e) => handleChangeParams('searchFeature', e.target.value)}
              value={params.searchFeature}
            />
          </TD>
        </TR>
        <TR>
          <TH colSpan={1} align="right">
            검색 조건
          </TH>
          <TD colSpan={5} align="left">
            <Checkbox
              label="Feature 영문명"
              onCheckedChange={(checked) => handleChangeSearchConditions('featureEnNm', checked)}
              checked={params.searchConditions.includes('featureEnNm')}
            />
            <Checkbox
              label="Feature 한글명"
              onCheckedChange={(checked) => handleChangeSearchConditions('featureKoNm', checked)}
              checked={params.searchConditions.includes('featureKoNm')}
            />
            <Checkbox
              label="정의"
              onCheckedChange={(checked) => handleChangeSearchConditions('featureDef', checked)}
              checked={params.searchConditions.includes('featureDef')}
            />
          </TD>
        </TR>
        <TR>
          <TH colSpan={1} align="right">
            Feature 신청자
          </TH>
          <TD colSpan={2}>
            <Stack gap="SM" className="width-100">
              <TextField
                className="width-100"
                size="MD"
                onChange={(e) => handleChangeParams('enrUserNm', e.target.value)}
                value={params.enrUserNm}
                disabled
              />
              <Button appearance="Contained" priority="Normal" shape="Square" size="MD" onClick={handleUserSelectModal}>
                <span className="searchIcon"></span>
              </Button>
            </Stack>
          </TD>
          <TH colSpan={1} align="right">
            {`신청부서(팀)`}
          </TH>
          <TD colSpan={2}>
            <Stack gap="SM" className="width-100">
              <TextField
                className="width-100"
                size="MD"
                onChange={(e) => handleChangeParams('enrDeptNm', e.target.value)}
                value={params.enrDeptNm}
                disabled
              />
              <Button appearance="Contained" priority="Normal" shape="Square" size="MD" onClick={handleDeptSelectModal}>
                <span className="searchIcon"></span>
              </Button>
            </Stack>
          </TD>
        </TR>
      </SearchForm>

      <DataGrid
        columns={columns}
        rows={rows}
        clickable={true}
        page={page}
        onClick={goToDetail}
        onChange={handlePage}
        buttonChildren={
          contextPath === ContextPath.ADMIN && (
            <Button priority="Primary" appearance="Contained" size="LG" onClick={goToReg}>
              <AddIcon />
              등록
            </Button>
          )
        }
      />
    </>
  );
};
export default List;
