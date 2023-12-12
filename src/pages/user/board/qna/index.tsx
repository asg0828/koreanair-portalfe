import { AddIcon } from '@/assets/icons';
import SearchForm from '@/components/form/SearchForm';
import DataGrid from '@/components/grid/DataGrid';
import { useQnaList } from '@/hooks/queries/useQnaQueries';
import useDidMountEffect from '@/hooks/useDidMountEffect';
import { useAppSelector } from '@/hooks/useRedux';
import { ContextPath, GroupCodeType, ValidType, View } from '@/models/common/Constants';
import { ColumnsInfo, RowsInfo } from '@/models/components/Table';
import { PageModel, initPage } from '@/models/model/PageModel';
import { QnaModel, QnaParams } from '@/models/model/QnaModel';
import { selectContextPath } from '@/reducers/authSlice';
import { getCode } from '@/reducers/codeSlice';
import { getDateString } from '@/utils/DateUtil';
import { Button, Select, SelectOption, Stack, TD, TH, TR, TextField, useToast } from '@components/ui';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const columns: Array<ColumnsInfo> = [
  { headerName: 'No', field: 'rownum', colSpan: 0.5 },
  { headerName: '분류', field: 'clCodeNm', colSpan: 1 },
  { headerName: '제목', field: 'sj', colSpan: 3, align: 'left' },
  { headerName: '상태', field: 'qnaStatNm', colSpan: 1.5 },
  { headerName: '등록자', field: 'rgstNm', colSpan: 2 },
  { headerName: '등록일', field: 'rgstDt', colSpan: 1 },
  { headerName: '조회수', field: 'viewCnt', colSpan: 1 },
];

const searchInfoList = [
  { key: 'sj', value: '제목' },
  { key: 'cn', value: '내용' },
];

export const initQnaParams: QnaParams = {
  searchConditions: 'all',
  searchTable: '',
};

const List = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const contextPath = useAppSelector(selectContextPath());
  const [params, setParams] = useState(initQnaParams);
  const [page, setPage] = useState<PageModel>(initPage);
  const [rows, setRows] = useState<Array<QnaModel>>([]);
  const { data: response, isError, refetch } = useQnaList(params, page);

  const goToReg = () => {
    navigate(View.REG);
  };

  const goToDetail = (row: RowsInfo, index: number) => {
    navigate(View.DETAIL, {
      state: {
        qnaId: row.qnaId,
        rows: rows,
      },
    });
  };

  const handleSearch = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleClear = () => {
    setParams(initQnaParams);
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
        response.data.contents.forEach((item: QnaModel) => {
          item.rgstNm = `${item.rgstDeptNm || ''} ${item.rgstNm || ''}`;
          item.rgstDt = getDateString(item.rgstDt, '-');
          item.useYn = item.useYn === 'Y' ? '예' : '아니오';
          item.clCodeNm = getCode(GroupCodeType.QNA_TYPE, item.clCode)?.codeNm || '';
          item.qnaStatNm = getCode(GroupCodeType.QNA_STAT, item.qnaStat)?.codeNm || '';
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
                onChange={(e, value) => value && handleChangeParams('searchConditions', value || 'all')}
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
