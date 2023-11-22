import { useCallback, useEffect, useState } from 'react';
import { SelectValue } from '@mui/base/useSelect';
import { Column } from '@/models/customer-info/CustomerInfo';
import SearchForm from '@/components/form/SearchForm';
import HorizontalTable from '@/components/table/HorizontalTable';
import { Button, Select, SelectOption, Stack, TD, TH, TR, TextField, useToast } from '@components/ui';
import { ValidType } from '@/models/common/Constants';
import { useYn } from '@/pages/user/self-feature/data';
import DataGrid from '@/components/grid/DataGrid';
import { PageModel, initPage } from '@/models/model/PageModel';
import { PagingUtil } from '@/utils/self-feature/PagingUtil';
import { useColAndCmmtList, useMetaTableList } from '@/hooks/queries/self-feature/useSelfFeatureAdmQueries';
import useDidMountEffect from '@/hooks/useDidMountEffect';

export interface CmSrchInfo {
  [key: string]: string;
  item: string;
  searchWord: string;
  metaTblUseYn: string;
}

export interface MetaTableData {
  dataClaCd: string;
  dataSrcDvCd: string;
  dbNm: string;
  frstRegDttm: string;
  frstRegUserId: string;
  keepCylcCd: string;
  lastUpdDttm: string;
  lastUpdUserId: string;
  metaTblDesc: string;
  metaTblDvCd: string;
  metaTblId: string;
  metaTblLogiNm: string;
  metaTblPhysNm: string;
  metaTblUseYn: string;
  rtmTblYn: string;
  topicId: string;
}
const metaTableColumn: Column[] = [
  { headerName: 'dataClaCd', field: 'dataClaCd' },
  { headerName: 'NO', field: 'dataSrcDvCd' },
  { headerName: 'NO', field: 'dbNm' },
  { headerName: 'NO', field: 'frstRegDttm' },
  { headerName: 'NO', field: 'frstRegUserId' },
  { headerName: 'NO', field: 'keepCylcCd' },
  { headerName: 'NO', field: 'lastUpdDttm' },
  { headerName: 'NO', field: 'lastUpdUserId' },
  { headerName: 'NO', field: 'metaTblDesc' },
  { headerName: 'NO', field: 'metaTblDvCd' },
  { headerName: 'NO', field: 'metaTblId' },
  { headerName: 'NO', field: 'metaTblLogiNm' },
  { headerName: 'NO', field: 'metaTblPhysNm' },
  { headerName: 'NO', field: 'metaTblUseYn' },
  { headerName: 'NO', field: 'rtmTblYn' },
  { headerName: 'NO', field: 'topicId' },
];
const CustomerMetaManagement = () => {
  const [page, setPage] = useState<PageModel>(initPage);
  const [rows, setRows] = useState<Array<MetaTableData>>([]);
  const { toast } = useToast();
  const [searchInfo, setSearchInfo] = useState<CmSrchInfo>({
    item: '',
    searchWord: '',
    metaTblUseYn: '',
  });
  const { data: metaTableRes, isError: metaTableErr, refetch: metaTableRefetch } = useMetaTableList(searchInfo);
  const { data: colCmmtRes, isError: colCmmtErr, refetch: colCmmtRefetch } = useColAndCmmtList();
  const [list, setList] = useState<Array<MetaTableData>>([]);
  useEffect(() => {
    colCmmtRefetch();
  }, []);

  const handleSearch = useCallback(() => {
    metaTableRefetch();
  }, [metaTableRefetch]);

  useEffect(() => {
    if (colCmmtErr || colCmmtRes?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (colCmmtRes) {
        console.log(colCmmtRes.result);
      }
    }
  }, [colCmmtRes, colCmmtErr, toast]);

  useEffect(() => {
    if (metaTableErr || metaTableRes?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (metaTableRes) {
        setRows(metaTableRes.result);
        PagingUtil(metaTableRes.result, page);
      }
    }
  }, [metaTableRes, metaTableErr, toast]);

  const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSearchInfo({ ...searchInfo, [id]: value });
  };

  const onchangeSelectHandler = (
    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
    value: SelectValue<{}, false>,
    id?: String
  ) => {
    setSearchInfo({ ...searchInfo, [`${id}`]: String(value) });
  };

  const handlePage = (page: PageModel) => {
    setPage(PagingUtil(rows, page));
  };

  const setRetrieveList = (page: PageModel) => {
    let pageStart = page.pageSize * page.page;

    if (pageStart < 0) {
      pageStart = 0;
    }
    let pageEnd = pageStart + page.pageSize;
    if (pageEnd > page.totalCount) {
      pageEnd = page.totalCount;
    }
    const newRows = rows.slice(pageStart, pageEnd);
    setList(newRows);
  };

  useDidMountEffect(() => {
    setRetrieveList(page);
    // console.log(page);
  }, [page.page, page.pageSize, setRetrieveList]);

  return (
    <>
      <SearchForm
        onSearch={handleSearch}
        //onClear={onClear}
      >
        <HorizontalTable>
          <TR>
            <TH colSpan={1} align="right">
              사용여부
            </TH>
            <TD colSpan={3}>
              <Select
                appearance="Outline"
                placeholder="선택"
                className="width-100"
                onChange={(
                  e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                  value: SelectValue<{}, false>
                ) => {
                  onchangeSelectHandler(e, value, 'metaTblUseYn');
                }}
              >
                {useYn.map((item, index) => (
                  <SelectOption key={index} value={item.value}>
                    {item.text}
                  </SelectOption>
                ))}
              </Select>
            </TD>
            <TH colSpan={1} align="right">
              검색어 기준
            </TH>
            <TD colSpan={3}>
              <Select
                appearance="Outline"
                placeholder="전체"
                className="width-100"
                //value={searchInfo.oneidChgRsnCd}
                onChange={(
                  e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                  value: SelectValue<{}, false>
                ) => {
                  onchangeSelectHandler(e, value, 'item');
                }}
              >
                <SelectOption value="선택"></SelectOption>
                {/* {reason.map((item, index) => (
                            <SelectOption key={index} value={item.value}>
                            {item.text}
                            </SelectOption>
                            ))} */}
              </Select>
            </TD>
            <TD colSpan={4}>
              <TextField
                className="width-100"
                onChange={onchangeInputHandler}
                value={searchInfo.searchWord}
                placeholder="검색어를 입력하세요."
                id="searchWord"
              />
            </TD>
          </TR>
        </HorizontalTable>
      </SearchForm>

      <DataGrid
        columns={metaTableColumn}
        rows={list}
        enableSort={true}
        clickable={true}
        page={page}
        onChange={handlePage}
      />

      <Stack gap="SM" justifyContent="End">
        <Button priority="Normal" appearance="Outline" size="LG">
          삭제
        </Button>
        <Button priority="Primary" appearance="Contained" size="LG">
          신규등록
        </Button>
      </Stack>
    </>
  );
};

export default CustomerMetaManagement;
