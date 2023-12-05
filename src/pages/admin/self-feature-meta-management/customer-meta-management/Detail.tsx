import { Select, SelectOption, Stack, TD, TH, TR, TextField, useToast } from '@components/ui';
import SearchForm from '@/components/form/SearchForm';
import HorizontalTable from '@/components/table/HorizontalTable';
import { useEffect, useState } from 'react';
import { SelectValue } from '@mui/base/useSelect';
import { customerMetaInfoColumn, initTbCoMetaTblInfo } from './data';
import DataGridMeta from '@/components/grid/DataGridMeta';
import { useMetaTableDetail } from '@/hooks/queries/self-feature/useSelfFeatureAdmQueries';
import { useLocation } from 'react-router-dom';
import { TbCoMetaTbInfo } from '@/models/selfFeature/FeatureAdmModel';

const CustomerMetaManagementDetail = () => {
  const location = useLocation();
  const [tbCoMetaTbInfo, setTbCoMetaTbInfo] = useState<TbCoMetaTbInfo>(initTbCoMetaTblInfo);
  const [searchInfo, setSearchInfo] = useState<any>({
    metaTblId: location?.state?.metaTblId || '',
    metaTblLogiNm: location?.state?.metaTblLogiNm || '',
    rtmTblYn: location?.state?.rtmTblYn || '',
  });

  const [rows, setRows] = useState<any>([]);
  const { data: response, isError, refetch } = useMetaTableDetail(searchInfo.metaTblId);
  const { toast } = useToast();

  /* input state관리 */
  function onSearchChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setTbCoMetaTbInfo({ ...searchInfo, [id]: value });
  }

  /* select 입력 함수 */
  const onchangeSelectHandler = (
    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
    value: SelectValue<{}, false>,
    id?: String
  ) => {
    setTbCoMetaTbInfo({ ...tbCoMetaTbInfo, [`${id}`]: value });
  };

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: 'Error',
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (response?.result) {
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
            <TH colSpan={0.11} align="right">
              데이터베이스명
            </TH>
            <TD colSpan={0.22}>
              <TextField
                disabled
                className="width-100"
                onChange={onSearchChangeHandler}
                value={tbCoMetaTbInfo.dbNm}
                placeholder="검색어를 입력하세요."
                id="dbNm"
              />
            </TD>
            <TH colSpan={0.11} align="right">
              테이블 물리명
            </TH>
            <TD colSpan={0.22}>
              <TextField
                disabled
                className="width-100"
                onChange={onSearchChangeHandler}
                value={tbCoMetaTbInfo.metaTblPhysNm}
                placeholder="검색어를 입력하세요."
                id="metaTblPhysNm"
              />
            </TD>
            <TH colSpan={0.11} align="right">
              테이블 논리명
            </TH>
            <TD colSpan={0.23}>
              <TextField
                className="width-100"
                onChange={onSearchChangeHandler}
                value={tbCoMetaTbInfo.metaTblLogiNm}
                placeholder="검색어를 입력하세요."
                id="metaTblLogiNm"
              />
            </TD>
          </TR>
          <TR>
            <TH colSpan={tbCoMetaTbInfo.rtmTblYn === 'Y' ? 0.199 : 0.123} align="right">
              테이블설명
            </TH>
            <TD>
              <TextField
                className="width-100"
                onChange={onSearchChangeHandler}
                value={tbCoMetaTbInfo.metaTblDesc}
                placeholder="검색어를 입력하세요."
                id="metaTblDesc"
              />
            </TD>
            {tbCoMetaTbInfo.rtmTblYn === 'Y' ? (
              <>
                <TH colSpan={0.2005}>Topic</TH>
                <TD colSpan={0.416}>
                  <Select
                    id="metaTblDvCd"
                    appearance="Outline"
                    placeholder="전체"
                    className="width-100"
                    value={tbCoMetaTbInfo.metaTblDvCd}
                    onChange={(
                      e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                      value: SelectValue<{}, false>
                    ) => {
                      onchangeSelectHandler(e, value, 'metaTblDvCd');
                    }}
                  >
                    <SelectOption value={'ATTR'}>??</SelectOption>
                    <SelectOption value={'BEHV'}>???</SelectOption>
                  </Select>
                </TD>
              </>
            ) : (
              <></>
            )}
          </TR>
          <TR>
            <TH colSpan={0.11} align="right">
              메타테이블구분
            </TH>
            <TD colSpan={0.22}>
              <Select
                id="metaTblDvCd"
                appearance="Outline"
                placeholder="전체"
                className="width-100"
                value={tbCoMetaTbInfo.metaTblDvCd}
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
            <TH colSpan={0.11} align="right">
              사용여부
            </TH>
            <TD colSpan={0.22}>
              <Select
                id="metaTblUseYn"
                appearance="Outline"
                placeholder="전체"
                className="width-100"
                value={tbCoMetaTbInfo.metaTblUseYn}
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
            <TH colSpan={0.11} align="right">
              실시간여부
            </TH>
            <TD colSpan={0.23}>
              <Select
                style={{ width: '100%' }}
                id="rtmTblYn"
                appearance="Outline"
                placeholder="전체"
                className="width-100"
                value={tbCoMetaTbInfo.rtmTblYn}
                onChange={(
                  e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                  value: SelectValue<{}, false>
                ) => {
                  onchangeSelectHandler(e, value, 'rtmTblYn');
                }}
              >
                <SelectOption value={'N'}>NO</SelectOption>
                <SelectOption value={'Y'}>YES</SelectOption>
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
