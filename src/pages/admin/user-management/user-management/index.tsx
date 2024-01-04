import SearchForm from '@/components/form/SearchForm';
import DataGrid from '@/components/grid/DataGrid';
import { useAdminAuthAllList, useUserAuthAllList } from '@/hooks/queries/useAuthQueries';
import { useUserList } from '@/hooks/queries/useUserQueries';
import useDidMountEffect from '@/hooks/useDidMountEffect';
import { ValidType, View } from '@/models/common/Constants';
import { AuthModel } from '@/models/model/AuthModel';
import { PageModel, initPage } from '@/models/model/PageModel';
import { UserModel, UserParams } from '@/models/model/UserModel';
import { Radio, Select, SelectOption, Stack, TD, TH, TR, TextField, useToast } from '@components/ui';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

const initParams: UserParams = {
  userNm: '',
  deptNm: '',
  userAuthId: '',
  mgrAuthId: '',
  useYn: '',
};

const List = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const beforeParams: UserParams = location?.state?.params;
  const beforePage: PageModel = location?.state?.page;
  const [userAuthList, setUserAuthList] = useState<Array<AuthModel>>();
  const [adminAuthList, setAdminAuthList] = useState<Array<AuthModel>>();
  const [params, setParams] = useState<UserParams>(beforeParams || initParams);
  const [page, setPage] = useState<PageModel>(beforePage || initPage);
  const [rows, setRows] = useState<Array<UserModel>>([]);
  const { data: response, isError, refetch } = useUserList(params, page);
  const { data: uaResponse, isError: uaIsError } = useUserAuthAllList();
  const { data: aaResponse, isError: aaIsError } = useAdminAuthAllList();

  const columns = [
    { headerName: 'No', field: 'rownum', colSpan: 0.5 },
    { headerName: t('management:label.userEmail'), field: 'userEmail', colSpan: 1.5 },
    { headerName: t('management:label.userNm'), field: 'userNm', colSpan: 1 },
    { headerName: t('management:label.userId'), field: 'userId', colSpan: 1 },
    { headerName: t('management:label.deptNm'), field: 'deptNm', colSpan: 1 },
    { headerName: t('management:label.userAuthNm'), field: 'apldUserAuthNm', colSpan: 1 },
    { headerName: t('management:label.mgrAuthNm'), field: 'apldMgrAuthNm', colSpan: 1 },
    { headerName: t('management:label.lastLogDt'), field: 'lastLogDt', colSpan: 1 },
    { headerName: t('management:label.employmentYn'), field: 'useYn', colSpan: 1 },
  ];

  const goToDetail = (row: UserModel, index: number) => {
    navigate(View.DETAIL, {
      state: {
        userId: row.userId,
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
    setParams(initParams);
  };

  const handlePage = (page: PageModel) => {
    setPage(page);
  };

  const handleChangeParams = (name: string, value: any) => {
    setParams((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useDidMountEffect(() => {
    refetch();
  }, [page.page, page.pageSize]);

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('management:toast.error.menuList'),
      });
    } else {
      if (response?.data) {
        setRows(response.data.contents);
        setPage(response.data.page);
      }
    }
  }, [response, isError, toast]);

  useEffect(() => {
    if (uaIsError || uaResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('management:toast.error.userAuthList'),
      });
    } else {
      if (uaResponse?.data) {
        setUserAuthList(uaResponse.data);
      }
    }
  }, [uaResponse, uaIsError, toast]);

  useEffect(() => {
    if (aaIsError || aaResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('management:toast.error.mgmtAuthList'),
      });
    } else {
      if (aaResponse?.data) {
        setAdminAuthList(aaResponse.data);
      }
    }
  }, [aaResponse, aaIsError, toast]);

  return (
    <>
      <SearchForm onSearch={handleSearch} onClear={handleClear}>
        <TR>
          <TH colSpan={1} align="right">
            {t('management:label.userNm')}
          </TH>
          <TD colSpan={2} align="left">
            <TextField
              className="width-100"
              size="MD"
              onChange={(e) => handleChangeParams('userNm', e.target.value)}
              value={params.userNm}
            />
          </TD>
          <TH colSpan={1} align="right">
            {t('management:label.deptNm')}
          </TH>
          <TD colSpan={2} align="left">
            <TextField
              className="width-100"
              size="MD"
              onChange={(e) => handleChangeParams('deptNm', e.target.value)}
              value={params.deptNm}
            />
          </TD>
        </TR>
        <TR>
          <TH colSpan={1} align="right">
            {t('management:label.mgrAuthNm')}
          </TH>
          <TD colSpan={2} align="left">
            <Select
              appearance="Outline"
              placeholder="전체"
              className="width-100"
              onChange={(e, value) => value && handleChangeParams('mgrAuthId', value === 'all' ? null : value)}
              value={params.mgrAuthId || 'all'}
            >
              <SelectOption value="all">{t('common.label.all')}</SelectOption>
              {adminAuthList?.map((item, index) => (
                <SelectOption key={index} value={item.authId}>
                  {item.authNm}
                </SelectOption>
              ))}
            </Select>
          </TD>
          <TH colSpan={1} align="right">
            {t('management:label.userAuthNm')}
          </TH>
          <TD colSpan={2} align="left">
            <Select
              appearance="Outline"
              placeholder={t('common.placeholder.all')}
              className="width-100"
              onChange={(e, value) => value && handleChangeParams('userAuthId', value === 'all' ? null : value)}
              value={params.userAuthId || 'all'}
            >
              <SelectOption value="all">{t('common.label.all')}</SelectOption>
              {userAuthList?.map((item, index) => (
                <SelectOption key={index} value={item.authId}>
                  {item.authNm}
                </SelectOption>
              ))}
            </Select>
          </TD>
        </TR>
        <TR>
          <TH colSpan={1} align="right">
            {t('management:label.employmentYn')}
          </TH>
          <TD colSpan={5} align="left">
            <Stack gap="LG" className="width-100">
              <Radio
                label={t('management:label.all')}
                checked={!params.useYn}
                value={''}
                onChange={(e) => handleChangeParams('useYn', e.target.value)}
              />
              <Radio
                label="Y"
                checked={params.useYn === 'Y'}
                value="Y"
                onChange={(e) => handleChangeParams('useYn', e.target.value)}
              />
              <Radio
                label="N"
                checked={params.useYn === 'N'}
                value="N"
                onChange={(e) => handleChangeParams('useYn', e.target.value)}
              />
            </Stack>
          </TD>
        </TR>
      </SearchForm>

      <DataGrid
        enableSort={false}
        clickable={true}
        columns={columns}
        rows={rows}
        page={page}
        onClick={goToDetail}
        onChange={handlePage}
      />
    </>
  );
};
export default List;
