import { AddIcon } from '@/assets/icons';
import SearchForm from '@/components/form/SearchForm';
import DataGrid from '@/components/grid/DataGrid';
import { useDataroomList } from '@/hooks/queries/useDataroomQueries';
import useDidMountEffect from '@/hooks/useDidMountEffect';
import { useAppSelector } from '@/hooks/useRedux';
import { ContextPath, ValidType, View } from '@/models/common/Constants';
import { ColumnsInfo } from '@/models/components/Table';
import { DataroomModel, DataroomParams } from '@/models/model/DataroomModel';
import { NoticeParams } from '@/models/model/NoticeModel';
import { PageModel, initPage } from '@/models/model/PageModel';
import { selectContextPath } from '@/reducers/authSlice';
import { getDateString } from '@/utils/DateUtil';
import { htmlSpeReg, htmlTagReg } from '@/utils/RegularExpression';
import { Button, Select, SelectOption, Stack, TD, TH, TR, TextField, useToast } from '@components/ui';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const columns: Array<ColumnsInfo> = [
  { headerName: 'No', field: 'rownum', colSpan: 0.5 },
  { headerName: '제목', field: 'sj', colSpan: 5.5, align: 'left' },
  { headerName: '등록자', field: 'rgstNm', colSpan: 2 },
  { headerName: '등록일', field: 'rgstDt', colSpan: 1 },
  { headerName: '조회수', field: 'viewCnt', colSpan: 1 },
];

const searchInfoList = [
  { key: 'sj', value: '제목' },
  { key: 'cn', value: '내용' },
];

const initParams: DataroomParams = {
  searchConditions: 'all',
  searchTable: '',
};

const List = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const contextPath = useAppSelector(selectContextPath());
  const location = useLocation();
  const beforeParams: DataroomParams = location?.state?.params;
  const [params, setParams] = useState(beforeParams || initParams);
  const [page, setPage] = useState<PageModel>(initPage);
  const [rows, setRows] = useState<Array<DataroomModel>>([]);
  const { data: response, isError, refetch } = useDataroomList(params, page);

  const goToReg = () => {
    navigate(View.REG, {
      state: {
        params: params,
      },
    });
  };

  const goToDetail = (row: DataroomModel) => {
    navigate(View.DETAIL, {
      state: {
        dataId: row.dataId,
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

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleChangeParams = (name: string, value: any) => {
    setParams((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

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
        response.data.contents.forEach((item: DataroomModel) => {
          item.rgstDt = getDateString(item.rgstDt, '-');
          item.cn = item.cn.replace(htmlTagReg, '').replace(htmlSpeReg, '');
          item.rgstNm = `${item.rgstDeptNm || ''} ${item.rgstNm || ''}`;
          item.useYn = item.useYn === 'Y' ? '예' : '아니오';
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
            검색
          </TH>
          <TD colSpan={5} align="left">
            <Stack gap="SM" className="width-100">
              <Select
                appearance="Outline"
                placeholder="전체"
                className="select-basic"
                onChange={(e, value) => handleChangeParams('searchConditions', value || 'all')}
                value={params.searchConditions}
              >
                {searchInfoList.map((searchInfo) => (
                  <SelectOption value={searchInfo.key}>{searchInfo.value}</SelectOption>
                ))}
              </Select>
              <TextField
                className="width-100"
                onKeyDown={handleKeyDown}
                onChange={(e) => handleChangeParams('searchTable', e.target.value)}
                value={params.searchTable}
              />
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
