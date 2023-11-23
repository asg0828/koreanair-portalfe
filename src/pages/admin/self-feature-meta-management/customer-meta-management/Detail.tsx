import { Button, Select, SelectOption, Stack, TD, TH, TR, TextField } from '@components/ui';
import SearchForm from '@/components/form/SearchForm';
import HorizontalTable from '@/components/table/HorizontalTable';
import { useState } from 'react';
import { SelectValue } from '@mui/base/useSelect';
import DataGrid from '@/components/grid/DataGrid';
import { customerMetaInfoColumn } from './data';

const CustomerMetaManagementDetail = () => {
  const [searchInfo, setSearchInfo] = useState<any>({});

  /* input state관리 */
  function onSearchChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setSearchInfo({ ...searchInfo, [id]: value });
  }

  /* select 입력 함수 */
  const onchangeSelectHandler = (
    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
    value: SelectValue<{}, false>,
    id?: String
  ) => {
    setSearchInfo({ ...searchInfo, [`${id}`]: value });
  };

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
                value={searchInfo.oneidNum}
                placeholder="검색어를 입력하세요."
                id="oneidNum"
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
                value={searchInfo.oneidNum}
                placeholder="검색어를 입력하세요."
                id="oneidNum"
              />
            </TD>
            <TH colSpan={1} align="right">
              테이블 논리명
            </TH>
            <TD colSpan={3}>
              <TextField
                className="width-100"
                onChange={onSearchChangeHandler}
                value={searchInfo.oneidNum}
                placeholder="검색어를 입력하세요."
                id="oneidNum"
              />
            </TD>
            <TH colSpan={1} align="right">
              테이블설명
            </TH>
            <TD colSpan={3}>
              <TextField
                className="width-100"
                onChange={onSearchChangeHandler}
                value={searchInfo.oneidNum}
                placeholder="검색어를 입력하세요."
                id="oneidNum"
              />
            </TD>
          </TR>

          <TR>
            <TH colSpan={1} align="right">
              메타테이블 구분
            </TH>
            <TD colSpan={3}>
              <Select
                appearance="Outline"
                placeholder="전체"
                className="width-100"
                value={searchInfo.oneidChgRsnCd}
                onChange={(
                  e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                  value: SelectValue<{}, false>
                ) => {
                  onchangeSelectHandler(e, value, 'oneidChgRsnCd');
                }}
              >
                {/* {reason.map((item, index) => (
                  <SelectOption key={index} value={item.value}>
                    {item.text}
                  </SelectOption>
                ))} */}
              </Select>
            </TD>
            <TH colSpan={1} align="right">
              사용여부
            </TH>
            <TD colSpan={3}>
              <Select
                appearance="Outline"
                placeholder="전체"
                className="width-100"
                value={searchInfo.oneidChgRsnCd}
                onChange={(
                  e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                  value: SelectValue<{}, false>
                ) => {
                  onchangeSelectHandler(e, value, 'oneidChgRsnCd');
                }}
              >
                {/* {reason.map((item, index) => (
                  <SelectOption key={index} value={item.value}>
                    {item.text}
                  </SelectOption>
                ))} */}
              </Select>
            </TD>{' '}
            <TH colSpan={1} align="right">
              실시간여부
            </TH>
            <TD colSpan={3}>
              <Select
                appearance="Outline"
                placeholder="전체"
                className="width-100"
                value={searchInfo.oneidChgRsnCd}
                onChange={(
                  e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                  value: SelectValue<{}, false>
                ) => {
                  onchangeSelectHandler(e, value, 'oneidChgRsnCd');
                }}
              >
                {/* {reason.map((item, index) => (
                  <SelectOption key={index} value={item.value}>
                    {item.text}
                  </SelectOption>
                ))} */}
              </Select>
            </TD>
          </TR>
        </HorizontalTable>
      </SearchForm>

      <DataGrid columns={customerMetaInfoColumn} rows={[]}></DataGrid>
    </Stack>
  );
};

export default CustomerMetaManagementDetail;
