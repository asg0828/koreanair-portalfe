import SearchForm from '@/components/form/SearchForm';
import DataGrid from '@/components/grid/DataGrid';
import { useNoticeList } from '@/hooks/queries/useNoticeQueries';
import useDidMountEffect from '@/hooks/useDidMountEffect';
import { ValidType, View } from '@/models/common/Constants';
import { RowsInfo } from '@/models/components/Table';
import { NoticeModel, NoticeParams } from '@/models/model/NoticeModel';
import { PageModel, initPage } from '@/models/model/PageModel';
import { getDateString } from '@/utils/DateUtil';
import { Button, Select, SelectOption, Stack, TD, TH, TR, TextField, useToast } from '@components/ui';
import { AddIcon } from '@/assets/icons';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const columns = [
  { headerName: 'No', field: 'rownum', colSpan: 1 },
  { headerName: '제목', field: 'sj', colSpan: 6 },
  { headerName: '등록일', field: 'rgstDt', colSpan: 1 },
  { headerName: '조회수', field: 'viewCnt', colSpan: 1 },
];

const searchInfoList = [
  { key: 'sj', value: '제목' },
  { key: 'cn', value: '내용' },
];

const initParams: NoticeParams = {
  searchConditions: 'all',
  searchTable: '',
};

const List = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [params, setParams] = useState(initParams);
  const [page, setPage] = useState<PageModel>(initPage);
  const [rows, setRows] = useState<Array<NoticeModel>>([]);
  const { data: response, isError, refetch } = useNoticeList(params, page);

  const goToReg = () => {
    navigate(View.REG);
  };

  const goToDetail = (row: RowsInfo, index: number) => {
    navigate(View.DETAIL, {
      state: {
        noticeId: row.noticeId,
        rows: rows,
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
        response.data.contents.forEach((item: NoticeModel) => {
          item.rgstDt = getDateString(item.rgstDt, '-');
          item.rgstNm = `${item.rgstDeptNm || ''} ${item.rgstNm || ''}`;
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
          <TD colSpan={3}>
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
        enableSort={true}
        clickable={true}
        page={page}
        onClick={goToDetail}
        onChange={handlePage}
        buttonChildren={
          <Button priority="Primary" appearance="Contained" size="LG" onClick={goToReg}>
            <AddIcon />
            등록
          </Button>
        }
      />
    </>
  );
};
export default List;
