import SearchForm from '@/components/form/SearchForm';
import HorizontalTable from '@/components/table/HorizontalTable';
import { Button, Select, SelectOption, TD, TH, TR, TextField, useToast, Stack } from '@components/ui';
import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import { SelectValue } from '@mui/base/useSelect';
import DataGridMeta from '@/components/grid/DataGridMeta';
import { customerMetaInfoColumn } from './data';
import DataGrid from '@/components/grid/DataGrid';
import { useMetaTableDetail } from '@/hooks/queries/self-feature/useSelfFeatureAdmQueries';

const CustomerMetaManagementReg = () => {
  const [searchInfo, setSearchInfo] = useState<any>({});
  const { toast } = useToast();
  const [rows, setRows] = useState<any>([]);
  const { data: response, isError, refetch } = useMetaTableDetail(searchInfo.metaTblId);
  // const{ data: retrieve}
  // 초기화 버튼
  const onClear = () => {
    // setSearchInfo(cloneDeep(initCustMetaListSrchInfo));
  };

  // 검색 버튼 클릭시 목록 refetch
  const handleSearch = () => {
    // metaTableRefetch();
  };

  // select state 관리
  const onchangeSelectHandler = (
    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
    value: SelectValue<{}, false>,
    id?: String
  ) => {
    setSearchInfo({ ...searchInfo, [`${id}`]: String(value) });
  };

  /* input state관리 */
  function onSearchChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setSearchInfo({ ...searchInfo, [id]: value });
  }

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: 'Error',
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (response?.result) {
        //setRows(response?.result.);
      }
    }
  }, [response, isError, toast]);

  return (
    <Stack direction="Vertical">
      <SearchForm>
        <HorizontalTable>
          <TR>
            <TH colSpan={1} align="right">
              데이터베이스명
            </TH>
            <TD colSpan={3}>
              <TextField
                disabled
                className="width-100"
                onChange={onSearchChangeHandler}
                value={searchInfo.dbNm}
                placeholder="검색어를 입력하세요."
                id="dbNm"
              />
            </TD>
            <TH colSpan={1} align="right">
              테이블 물리명
            </TH>
            <TD colSpan={3}>
              <TextField
                disabled
                className="width-100"
                onChange={onSearchChangeHandler}
                value={searchInfo.metaTblPhysNm}
                placeholder="검색어를 입력하세요."
                id="metaTblPhysNm"
              />
            </TD>
            <TH colSpan={1} align="right">
              테이블 논리명
            </TH>
            <TD colSpan={3}>
              <TextField
                className="width-100"
                onChange={onSearchChangeHandler}
                value={searchInfo.metaTblLogiNm}
                placeholder="검색어를 입력하세요."
                id="metaTblLogiNm"
              />
            </TD>
            <TH colSpan={1} align="right">
              테이블설명
            </TH>
            <TD colSpan={3}>
              <TextField
                className="width-100"
                onChange={onSearchChangeHandler}
                value={searchInfo.metaTblDesc}
                placeholder="검색어를 입력하세요."
                id="metaTblDesc"
              />
            </TD>
          </TR>

          <TR>
            <TH colSpan={1} align="right">
              메타테이블 구분
            </TH>
            <TD colSpan={3}>
              <Select
                id="metaTblDvCd"
                appearance="Outline"
                placeholder="전체"
                className="width-100"
                value={searchInfo.metaTblDvCd}
                onChange={(
                  e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                  value: SelectValue<{}, false>
                ) => {
                  onchangeSelectHandler(e, value, 'metaTblDvCd');
                }}
              >
                <SelectOption value={'ATTR'}>속성</SelectOption>
                <SelectOption value={'BEHV'}>행동</SelectOption>
              </Select>
            </TD>
            <TH colSpan={1} align="right">
              사용여부
            </TH>
            <TD colSpan={3}>
              <Select
                id="metaTblUseYn"
                appearance="Outline"
                placeholder="전체"
                className="width-100"
                value={searchInfo.metaTblUseYn}
                onChange={(
                  e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                  value: SelectValue<{}, false>
                ) => {
                  onchangeSelectHandler(e, value, 'metaTblUseYn');
                }}
              >
                <SelectOption value={'Y'}>사용</SelectOption>
                <SelectOption value={'N'}>미사용</SelectOption>
              </Select>
            </TD>
            <TH colSpan={1} align="right">
              실시간여부
            </TH>
            <TD colSpan={3}>
              <Select
                id="rtmTblYn"
                appearance="Outline"
                placeholder="전체"
                className="width-100"
                value={searchInfo.rtmTblYn}
                onChange={(
                  e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                  value: SelectValue<{}, false>
                ) => {
                  onchangeSelectHandler(e, value, 'rtmTblYn');
                }}
              >
                <SelectOption value={'N'}>NO</SelectOption>
                <SelectOption value={'Y'}>Yes</SelectOption>
              </Select>
            </TD>
          </TR>
        </HorizontalTable>
      </SearchForm>

      <DataGrid
        // props={searchInfo}
        // list={searchInfo}
        columns={customerMetaInfoColumn}
        rows={rows}
      ></DataGrid>
    </Stack>
  );
};

export default CustomerMetaManagementReg;
