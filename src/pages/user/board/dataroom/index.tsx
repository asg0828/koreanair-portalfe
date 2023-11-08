import SearchForm, { SearchKey, SearchInfo } from '@/components/form/SearchForm';
import DataGrid from '@/components/grid/DataGrid';
import { useDataroomList } from '@/hooks/queries/useDataroomQueries';
import { DataroomInfo } from '@/models/Board/Dataroom';
import { RowsInfo } from '@/models/components/Table';
import { PageInfo, initPage } from '@/models/components/Page';
import { Button, Select, SelectOption, Stack, TD, TH, TR, TextField, useToast } from '@components/ui';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDateString } from '@/utils/FuncUtil';
import { htmlTagReg, htmlSpeReg } from '@/utils/Constants';

const columns = [
  { headerName: 'No', field: 'rownum', colSpan: 1 },
  { headerName: '제목', field: 'sj', colSpan: 2 },
  { headerName: '내용', field: 'cn', colSpan: 4 },
  { headerName: '게시여부', field: 'useYn', colSpan: 1 },
  { headerName: '등록자', field: 'rgstNm', colSpan: 2 },
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
  const [rows, setRows] = useState<Array<DataroomInfo>>([]);
  const { refetch, data: response, isError } = useDataroomList(searchKey, searchValue, page);

  const goToReg = () => {
    navigate('reg');
  };

  const goToDetail = (row: RowsInfo, index: number) => {
    navigate('detail', {
      state: {
        dataId: row.dataId,
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
        response.data.contents.forEach((item: DataroomInfo) => {
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
            등록
          </Button>
        }
      />
    </>
  );
};
export default List;
