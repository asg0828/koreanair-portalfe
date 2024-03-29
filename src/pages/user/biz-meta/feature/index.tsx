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
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

export const initFeatureParams: FeatureParams = {
  featureSeGrp: '',
  featureSe: '',
  searchFeature: '',
  searchConditions: ['featureKoNm', 'featureEnNm', 'featureDef'],
  enrUserId: '',
  enrUserNm: '',
  enrDeptCode: '',
  enrDeptNm: '',
};

const List = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const contextPath = useAppSelector(selectContextPath());
  const userId = useAppSelector(selectSessionInfo()).userId || '';
  const location = useLocation();
  const beforeParams: FeatureParams = location?.state?.params;
  const beforePage: PageModel = location?.state?.page;
  const [featureTypList, setFeatureTypList] = useState<Array<FeatureSeparatesModel>>();
  const [featureSeList, setFeatureSeList] = useState<Array<FeatureSeparatesModel>>([]);
  const [params, setParams] = useState<FeatureParams>(beforeParams || initFeatureParams);
  const [page, setPage] = useState<PageModel>(beforePage || initPage);
  const [rows, setRows] = useState<Array<FeatureModel>>([]);
  const { data: response, isError, refetch } = useFeatureList(params, page);
  const { data: tResponse, isError: tIsError } = useFeatureTypList();
  const { data: sResponse, isError: sIsError, refetch: sRefetch } = useFeatureSeList(params.featureSeGrp);
  const { data: cResponse, isSuccess: cIsSuccess, isError: cIsError, mutate: cMutate } = useCreateInterestFeature();
  const { data: dResponse, isSuccess: dIsSuccess, isError: dIsError, mutate: dMutate } = useDeleteInterestFeature();

  const columns: Array<ColumnsInfo> = [
    {
      headerName: '',
      field: 'isUserFeature',
      colSpan: 0.4,
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
    { headerName: t('bizMeta:label.featureSeGrp'), field: 'featureSeGrpNm', colSpan: 0.8 },
    { headerName: t('bizMeta:label.featureSe'), field: 'featureSeNm', colSpan: 0.8 },
    { headerName: t('bizMeta:label.featureKoNm'), field: 'featureKoNm', colSpan: 1.9, align: 'left' },
    { headerName: t('bizMeta:label.featureEnNm'), field: 'featureEnNm', colSpan: 1.9, align: 'left' },
    { headerName: t('bizMeta:label.def'), field: 'featureDef', colSpan: 2, align: 'left', isTooltip: true },
    { headerName: t('bizMeta:label.enrDeptNm'), field: 'enrDeptNm', colSpan: 1.2 },
    { headerName: t('bizMeta:label.enrUserNm'), field: 'enrUserNm', colSpan: 1 },
  ];

  const goToReg = () => {
    navigate(View.REG, {
      state: {
        params: params,
        page: page,
      },
    });
  };

  const goToDetail = (row: FeatureModel) => {
    navigate(`${View.DETAIL}?featureId=${row.featureId}`, {
      state: {
        params: params,
        page: page,
      },
    });
  };

  const handleSearch = useCallback(() => {
    page.page = 0;
    refetch();
  }, [page, refetch]);

  const handleClear = () => {
    setParams(initFeatureParams);
    setFeatureSeList([]);
  };

  const handlePage = (nPage: PageModel) => {
    setPage(nPage);
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
    if (params.featureSeGrp) {
      sRefetch();
    }
  }, [params.featureSeGrp, sRefetch]);

  useDidMountEffect(() => {
    refetch();
  }, [page.page, page.pageSize]);

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
    if (tIsError || tResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('bizMeta:toast.error.featureSeGrpList'),
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
        content: t('bizMeta:toast.error.featureSeList'),
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
        content: t('bizMeta:toast.error.deletedInterestFeature'),
      });
    } else if (dIsSuccess) {
      toast({
        type: ValidType.CONFIRM,
        content: t('bizMeta:toast.success.deletedInterestFeature'),
      });
      refetch();
    }
  }, [dResponse, dIsSuccess, dIsError, toast, refetch]);

  return (
    <>
      <SearchForm onSearch={handleSearch} onClear={handleClear}>
        <TR>
          <TH colSpan={1} align="right">
            {t('bizMeta:label.featureSeGrp')}
          </TH>
          <TD colSpan={2}>
            <Select
              appearance="Outline"
              placeholder={t('common.placeholder.all')}
              className="width-100"
              onChange={(e, value) => value && handleChangeParams('featureSeGrp', value === 'all' ? null : value)}
              value={params.featureSeGrp || 'all'}
            >
              <SelectOption value="all">{t('common.label.all')}</SelectOption>
              {featureTypList?.map((item) => (
                <SelectOption value={item.seId}>{item.seNm}</SelectOption>
              ))}
            </Select>
          </TD>
          <TH colSpan={1} align="right">
            {t('bizMeta:label.featureSe')}
          </TH>
          <TD colSpan={2}>
            <Select
              appearance="Outline"
              placeholder={t('common.placeholder.all')}
              className="width-100"
              onChange={(e, value) => value && handleChangeParams('featureSe', value === 'all' ? null : value)}
              value={params.featureSe || 'all'}
            >
              <SelectOption value="all">{t('common.label.all')}</SelectOption>
              {featureSeList.map((item) => (
                <SelectOption value={item.seId}>{item.seNm}</SelectOption>
              ))}
            </Select>
          </TD>
        </TR>
        <TR>
          <TH colSpan={1} align="right">
            {t('bizMeta:label.searchFeature')}
          </TH>
          <TD colSpan={5} align="left">
            <TextField
              autoFocus
              className="width-100"
              size="MD"
              onChange={(e) => handleChangeParams('searchFeature', e.target.value)}
              value={params.searchFeature}
            />
          </TD>
        </TR>
        <TR>
          <TH colSpan={1} align="right">
            {t('bizMeta:label.searchCondition')}
          </TH>
          <TD colSpan={5} align="left">
            <Checkbox
              label={t('bizMeta:label.featureKoNm')}
              onCheckedChange={(checked) => handleChangeSearchConditions('featureKoNm', checked)}
              checked={params.searchConditions.includes('featureKoNm')}
            />
            <Checkbox
              label={t('bizMeta:label.featureEnNm')}
              onCheckedChange={(checked) => handleChangeSearchConditions('featureEnNm', checked)}
              checked={params.searchConditions.includes('featureEnNm')}
            />
            <Checkbox
              label={t('bizMeta:label.def')}
              onCheckedChange={(checked) => handleChangeSearchConditions('featureDef', checked)}
              checked={params.searchConditions.includes('featureDef')}
            />
          </TD>
        </TR>
        <TR>
          <TH colSpan={1} align="right">
            {t('bizMeta:label.enrDeptNm')}
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
          <TH colSpan={1} align="right">
            {t('bizMeta:label.enrUserNm')}
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
              {t('common.button.reg')}
            </Button>
          )
        }
      />
    </>
  );
};
export default List;
