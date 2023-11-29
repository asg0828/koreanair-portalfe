import SearchForm from '@/components/form/SearchForm';
import DataGrid from '@/components/grid/DataGrid';
import { useUserList } from '@/hooks/queries/useUserQueries';
import useDidMountEffect from '@/hooks/useDidMountEffect';
import { ValidType, View } from '@/models/common/Constants';
import { PageModel, initPage } from '@/models/model/PageModel';
import { UserModel, UserParams } from '@/models/model/UserModel';
import { getAddedRownum } from '@/utils/PagingUtil';
import { Radio, Select, Stack, TD, TH, TR, TextField, useToast } from '@components/ui';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const columns = [
  { headerName: 'No', field: 'rownum', colSpan: 1 },
  { headerName: '이메일', field: 'userEmail', colSpan: 1.5 },
  { headerName: '성명', field: 'userNm', colSpan: 1 },
  { headerName: '사번', field: 'userId', colSpan: 1 },
  { headerName: '부서명', field: 'deptNm', colSpan: 1 },
  { headerName: '사용자권한', field: 'apldUserAuthNm', colSpan: 1 },
  { headerName: '관리자권한', field: 'apldMgrAuthNm', colSpan: 1 },
  { headerName: '최종접속시간', field: 'lastLogDt', colSpan: 1 },
  { headerName: '재직구분', field: 'useYnNm', colSpan: 0.5 },
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
  const [params, setParams] = useState<UserParams>(initParams);
  const [page, setPage] = useState<PageModel>(initPage);
  const [rows, setRows] = useState<Array<UserModel>>([]);
  const { data: response, isError, refetch } = useUserList(params, page);

  const goToDetail = (row: UserModel, index: number) => {
    navigate(View.DETAIL, {
      state: {
        userId: row.userId,
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
        const addedRownum = getAddedRownum(response.data.page);
        response.data.contents.forEach((item: UserModel, index: number) => {
          item.rownum = index + addedRownum;
          item.useYnNm = item.useYn === 'Y' ? '예' : '아니오';
        });
        setRows(response.data.contents);
        setPage(response.data.page);
      }
    }
  }, [response, isError, toast]);

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
            <Select appearance="Outline" placeholder="전체" className="width-100"></Select>
          </TD>
          <TH colSpan={1} align="right">
            사용자권한
          </TH>
          <TD colSpan={2} align="left">
            <Select appearance="Outline" placeholder="전체" className="width-100"></Select>
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
                label="사용"
                checked={params.useYn === 'Y'}
                value="Y"
                onChange={(e) => handleChangeParams('useYn', e.target.value)}
              />
              <Radio
                label="미사용"
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
