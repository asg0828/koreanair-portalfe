import { Select, SelectOption, Stack, TD, TH, TR, TextField, useToast } from '@components/ui';
import SearchForm from '@/components/form/SearchForm';
import HorizontalTable from '@/components/table/HorizontalTable';
import { useEffect, useState } from 'react';
import { SelectValue } from '@mui/base/useSelect';
import { customerMetaInfoColumn } from './data';
import DataGridMeta from '@/components/grid/DataGridMeta';
import { useMetaTableDetail } from '@/hooks/queries/self-feature/useSelfFeatureAdmQueries';
import { useLocation } from 'react-router-dom';
import { RowsInfo } from '@/models/components/Table';

const CustomerMetaManagementDetail = () => {
  const location = useLocation();
  const [tbCoMetaTbInfo, setTbCoMetaTbInfo] = useState<Array<RowsInfo>>([]);
  const [searchInfo, setSearchInfo] = useState<any>({
    metaTblId: location?.state?.metaTblId || '',
    metaTblLogiNm: location?.state?.metaTblLogiNm || '',
    rtmTblYn: location?.state?.rtmTblYn || '',
  });

  // const [rows, setRows] = useState<Array<CustMetaDetailInfo>>(initCustMetaDetailInfo);
  const [rows, setRows] = useState<any>([]);
  const { data: response, isError, refetch } = useMetaTableDetail(searchInfo.metaTblId);
  const { toast } = useToast();

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

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: 'Error',
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (response?.result) {
        // console.log(response?.result.tbCoMetaTblClmnInfoList);

        setRows(response?.result.tbCoMetaTblClmnInfoList);
        setTbCoMetaTbInfo(response?.result.tbCoMetaTbInfo);
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
                <SelectOption defaultChecked value={undefined}>
                  속성
                </SelectOption>

                <SelectOption value={undefined}>행동</SelectOption>
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
                <SelectOption defaultChecked value={undefined}>
                  사용
                </SelectOption>

                <SelectOption value={undefined}>미사용</SelectOption>
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
                <SelectOption defaultChecked value={undefined}>
                  NO
                </SelectOption>

                <SelectOption value={undefined}>Yes</SelectOption>
              </Select>
            </TD>
          </TR>
        </HorizontalTable>
      </SearchForm>

      <DataGridMeta
        props={searchInfo}
        list={tbCoMetaTbInfo}
        columns={customerMetaInfoColumn}
        rows={rows}
      ></DataGridMeta>
    </Stack>
  );
};

export default CustomerMetaManagementDetail;
