import SearchForm, { SearchKey, SearchInfo } from '@/components/form/SearchForm';
import DataGrid from '@/components/grid/DataGrid';
import { useNoticeList } from '@/hooks/queries/useNoticeQueries';
import { NoticeInfo } from '@/models/Board/Notice';
import { PageInfo, initPage } from '@/models/components/Page';
import { RowsInfo } from '@/models/components/Table';
import { htmlTagReg } from '@/utils/Constants';
import { getDateString } from '@/utils/FuncUtil';
import { Button, Select, SelectOption, Stack, TD, TH, TR, TextField, useToast } from '@components/ui';
import AddIcon from '@mui/icons-material/Add';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const columns = [
  { headerName: 'No', field: 'rownum', colSpan: 1 },
  { headerName: '제목', field: 'sj', colSpan: 6 },
  { headerName: '등록일', field: 'rgstDt', colSpan: 1 },
  { headerName: '조회수', field: 'viewCnt', colSpan: 1 },
];

const searchInfoList: SearchInfo[] = [
  { key: 'sj', value: '제목' },
  { key: 'cn', value: '내용' },
];

const List = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchKey, setSearchKey] = useState<SearchKey>('all');
  const [searchValue, setSearchValue] = useState<string>('');
  const [page, setPage] = useState<PageInfo>(initPage);
  const [isChanged, setIsChanged] = useState(false);
  const [rows, setRows] = useState<Array<NoticeInfo>>([]);
  const { refetch, data: response, isError } = useNoticeList(searchKey, searchValue, page);

  const goToReg = () => {
    navigate('reg');
  };

  const goToDetail = (row: RowsInfo, index: number) => {
    navigate('detail', {
      state: {
        noticeId: row.noticeId,
        rows: rows,
      },
    });
  };

  const handleChangeSearchKey = (e: any, value: any) => {
    setSearchKey(value);
  };

  const handleChangeSearchValue = (value: any) => {
    setSearchValue(value);
  };

  const handleSearch = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleClear = () => {
    setSearchKey('all');
    setSearchValue('');
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePage = (page: PageInfo) => {
    setPage(page);
    setIsChanged(true);
  };

  useEffect(() => {
    isChanged && handleSearch();

    return () => {
      setIsChanged(false);
    };
  }, [isChanged, handleSearch]);

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: 'Error',
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (response?.data) {
        response.data.page.page = response.data.page.page - 1;
        response.data.contents.forEach((item: NoticeInfo) => {
          item.rgstDt = getDateString(item.rgstDt, '-');
          item.cn = item.cn.replace(htmlTagReg, '');
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
              <Select appearance="Outline" placeholder="전체" className="select-basic" onChange={handleChangeSearchKey}>
                {searchInfoList.map((searchInfo) => (
                  <SelectOption value={searchInfo.key}>{searchInfo.value}</SelectOption>
                ))}
              </Select>
              <TextField
                className="width-100"
                onKeyDown={handleKeyDown}
                value={searchValue}
                onChange={(e) => handleChangeSearchValue(e.target.value)}
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
