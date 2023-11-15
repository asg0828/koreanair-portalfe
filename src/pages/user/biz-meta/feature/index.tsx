import SearchForm from '@/components/form/SearchForm';
import DataGrid from '@/components/grid/DataGrid';
import { useFeatureList } from '@/hooks/queries/useFeatureQueries';
import { FeatureModel } from '@/models/model/FeatureModel';
import { SearchKey, StringValue, ValidType, View } from '@/models/common/Constants';
import { PageModel, initPage } from '@/models/model/PageModel';
import { RowsInfo } from '@/models/components/Table';
import { getDateString } from '@/utils/DateUtil';
import { Button, Select, SelectOption, Stack, TD, TH, TR, TextField, useToast, Checkbox } from '@components/ui';
import AddIcon from '@mui/icons-material/Add';
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

const List = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchKey, setSearchKey] = useState<SearchKey>(SearchKey.ALL);
  const [searchValue, setSearchValue] = useState<string>(StringValue.DEFAULT);
  const [page, setPage] = useState<PageModel>(initPage);
  const [isChanged, setIsChanged] = useState(false);
  const [rows, setRows] = useState<Array<FeatureModel>>([]);
  const { refetch, data: response, isError } = useFeatureList(searchKey, searchValue, page);

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

  const handleChangeSearchKey = (e: any, value: any) => {
    if (!value) {
      value = SearchKey.ALL;
    }
    setSearchKey(value);
  };

  const handleChangeSearchValue = (value: any) => {
    setSearchValue(value);
  };

  const handleSearch = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleClear = () => {
    setSearchKey(SearchKey.ALL);
    setSearchValue('');
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePage = (page: PageModel) => {
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
        type: ValidType.ERROR,
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (response?.data) {
        response.data.page.page = response.data.page.page - 1;
        response.data.contents.forEach((item: FeatureModel) => {
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
            대구분
          </TH>
          <TD colSpan={2}>
            <Select appearance="Outline" placeholder="전체" className="width-100">
              <SelectOption value={1}>테스트</SelectOption>
            </Select>
          </TD>
          <TH colSpan={1} align="right">
            중구분
          </TH>
          <TD colSpan={2}>
            <Select appearance="Outline" placeholder="전체" className="width-100">
              <SelectOption value={1}>테스트</SelectOption>
            </Select>
          </TD>
        </TR>
        <TR>
          <TH colSpan={1} align="right">
            검색 Feature
          </TH>
          <TD colSpan={5.01} align="left">
            <TextField className="width-100" size="MD" />
          </TD>
        </TR>
        <TR>
          <TH colSpan={1} align="right">
            검색 조건
          </TH>
          <TD colSpan={5.01} align="left">
            <Checkbox label="Feature 한글명" />
            <Checkbox label="Feature 영문명" />
            <Checkbox label="정의" />
          </TD>
        </TR>
        <TR>
          <TH colSpan={1} align="right">
            Feature 신청자
          </TH>
          <TD colSpan={2}>
            <Stack gap="SM" className="width-100">
              <TextField className="width-100" size="MD" />
              <Button appearance="Contained" priority="Normal" shape="Square" size="MD">
                <span className="searchIcon"></span>
              </Button>
            </Stack>
          </TD>
          <TH colSpan={1} align="right">
            신청부서
          </TH>
          <TD colSpan={2}>
            <Stack gap="SM" className="width-100">
              <TextField className="width-100" size="MD" />
              <Button appearance="Contained" priority="Normal" shape="Square" size="MD">
                <span className="searchIcon"></span>
              </Button>
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
