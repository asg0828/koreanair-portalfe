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
import { useLocation, useNavigate } from 'react-router-dom';

const columns = [
  { headerName: 'No', field: 'rownum', colSpan: 0.5 },
  { headerName: '이메일', field: 'userEmail', colSpan: 1.5 },
  { headerName: '성명', field: 'userNm', colSpan: 1 },
  { headerName: '사번', field: 'userId', colSpan: 1 },
  { headerName: '부서명', field: 'deptNm', colSpan: 1 },
  { headerName: '사용자권한', field: 'userAuthNm', colSpan: 1 },
  { headerName: '관리자권한', field: 'mgrAuthNm', colSpan: 1 },
  { headerName: '최종접속시간', field: 'lastLogDt', colSpan: 1 },
  { headerName: '재직구분', field: 'useYn', colSpan: 1 },
];

const initParams: UserParams = {
  userNm: '',
  deptNm: '',
  userAuthId: '',
  mgrAuthId: '',
  useYn: '',
};

const List = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const beforeParams: UserParams = location?.state?.params;
  const [params, setParams] = useState<UserParams>(beforeParams || initParams);
  const [userAuthList, setUserAuthList] = useState<Array<AuthModel>>();
  const [adminAuthList, setAdminAuthList] = useState<Array<AuthModel>>();
  const [page, setPage] = useState<PageModel>(initPage);
  const [rows, setRows] = useState<Array<UserModel>>([]);
  const { data: response, isError, refetch } = useUserList(params, page);
  const { data: uaResponse, isError: uaIsError, refetch: uaRefetch } = useUserAuthAllList();
  const { data: aaResponse, isError: aaIsError, refetch: aaUreftch } = useAdminAuthAllList();

  const goToDetail = (row: UserModel, index: number) => {
    navigate(View.DETAIL, {
      state: {
        userId: row.userId,
        params: params,
      },
    });
  };

  const handleSearch = useCallback(() => {
    refetch();
  }, [refetch]);

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
    if (uaIsError || uaResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '사용자 권한그룹 조회 중 에러가 발생했습니다.',
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
        content: '관리자 권한그룹 조회 중 에러가 발생했습니다.',
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
            성명
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
            부서명
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
            관리자권한
          </TH>
          <TD colSpan={2} align="left">
            <Select
              appearance="Outline"
              placeholder="전체"
              className="width-100"
              onChange={(e, value) => value && handleChangeParams('mgrAuthId', value)}
              value={params.mgrAuthId}
            >
              {adminAuthList?.map((item, index) => (
                <SelectOption key={index} value={item.authId}>
                  {item.authNm}
                </SelectOption>
              ))}
            </Select>
          </TD>
          <TH colSpan={1} align="right">
            사용자권한
          </TH>
          <TD colSpan={2} align="left">
            <Select
              appearance="Outline"
              placeholder="전체"
              className="width-100"
              onChange={(e, value) => value && handleChangeParams('userAuthId', value)}
              value={params.userAuthId}
            >
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
            재직구분
          </TH>
          <TD colSpan={5} align="left">
            <Stack gap="LG" className="width-100">
              <Radio
                label="전체"
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
        enableSort={true}
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
