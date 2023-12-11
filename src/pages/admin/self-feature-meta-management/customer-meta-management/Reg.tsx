import SearchForm from '@/components/form/SearchForm';
import HorizontalTable from '@/components/table/HorizontalTable';
import { Select, SelectOption, TD, TH, TR, TextField, useToast, Stack } from '@components/ui';
import { useEffect, useState } from 'react';
import { SelectValue } from '@mui/base/useSelect';
import { customerMetaInfoColumn, customerMetaTableColumn, initTbCoMetaTblInfo } from './data';
import DataGrid from '@/components/grid/DataGrid';
import {
  useMetaTableDetail,
  useSchemaList,
  useTableColumns,
  useTableInfo,
} from '@/hooks/queries/self-feature/useSelfFeatureAdmQueries';
import DataGridMeta from '@/components/grid/DataGridMeta';
import DataGridTblColumn from '@/components/grid/DataGridTblColumn';
import { TbCoMetaTbInfo } from '@/models/selfFeature/FeatureAdmModel';

const CustomerMetaManagementReg = () => {
  const [tbCoMetaTbInfo, setTbCoMetaTbInfo] = useState<TbCoMetaTbInfo>(initTbCoMetaTblInfo);
  const [searchInfo, setSearchInfo] = useState<any>({
    metaTblPhysNm: '',
    dbNm: '',
    metaTblDesc: '',
    metaTblLogiNm: '',
    metaTblDvCd: 'ATTR',
    metaTblUseYn: 'Y',
    rtmTblYn: 'N',
  });
  const { toast } = useToast();
  const [rows, setRows] = useState<any>([]);
  const [dbNames, setDbNames] = useState<any>([]);
  const [tablePhyList, setTablePhyList] = useState<Array<any>>([]);

  // 메타 테이블 컬럼 검색 조회
  const { data: response, isError, refetch } = useMetaTableDetail(dbNames);

  //
  const { data: responseSchema, isError: isErrorSchema, refetch: refetchSchema } = useSchemaList();
  const {
    data: responseTblInfo,
    isError: isErrorTblInfo,
    refetch: refetchTblInfo,
  } = useTableInfo(searchInfo.dbNm, 'Y');
  const {
    data: responseTblColumn,
    isError: isErrorTblColumn,
    refetch: refetchTblColumn,
  } = useTableColumns(searchInfo.dbNm, searchInfo.metaTblPhysNm);
  const [tblColumns, setTblColumns] = useState<Array<any>>([]);

  // 초기화 버튼
  const onClear = () => {
    setSearchInfo({
      ...searchInfo,
      metaTblPhysNm: '',
      dbNm: '',
      metaTblDesc: '',
      metaTblLogiNm: '',
      metaTblDvCd: 'ATTR',
      metaTblUseYn: 'Y',
      rtmTblYn: 'N',
    });
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

  const searchTblColumns = () => {
    refetchTblColumn();
    refetch();
  };

  // 테이블 리스트 조회
  useEffect(() => {
    if (searchInfo.dbNm !== (null || '')) {
      refetchTblInfo();
    }
  }, [searchInfo.dbNm]);

  // 테이블 물리명 조회
  useEffect(() => {
    if (isErrorTblInfo || responseTblInfo?.successOrNot === 'N') {
      toast({
        type: 'Error',
        content: '조회 중 에러가 발생했습니다.2',
      });
    } else {
      if (responseTblInfo?.result) {
        setTablePhyList(responseTblInfo?.result);
      }
    }
  }, [responseTblInfo, isErrorTblInfo, toast]);

  // 데이터 베이스명
  useEffect(() => {
    if (isErrorSchema || responseSchema?.successOrNot === 'N') {
      toast({
        type: 'Error',
        content: '조회 중 에러가 발생했습니다.1',
      });
    } else {
      if (responseSchema?.result) {
        setDbNames(responseSchema?.result);
      }
    }
  }, [responseSchema, isErrorSchema, toast]);

  // 테이블 컬럼 리스트
  useEffect(() => {
    if (isErrorTblColumn || responseTblColumn?.successOrNot === 'N') {
      toast({
        type: 'Error',
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (responseTblColumn?.result) {
        setTblColumns(responseTblColumn?.result);
      }
    }
  }, [responseTblColumn, isErrorTblColumn, toast]);

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: 'Error',
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (response?.result) {
        // setRows(response?.result.tbCoMetaTblClmnInfoList);
        // setTbCoMetaTbInfo(response?.result.tbCoMetaTbInfo);
      }
    }
  }, [response, isError, toast]);

  return (
    <Stack direction="Vertical">
      <SearchForm onSearch={searchTblColumns} onClear={onClear}>
        <HorizontalTable>
          <TR>
            <TH colSpan={0.11} align="right">
              데이터베이스명
            </TH>
            <TD colSpan={0.22}>
              <Select
                id="dbNm"
                key="dbNm"
                appearance="Outline"
                placeholder="전체"
                className="width-100"
                value={searchInfo.dbNm}
                onChange={(
                  e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                  value: SelectValue<{}, false>
                ) => {
                  onchangeSelectHandler(e, value, 'dbNm');
                }}
              >
                {dbNames.map((dbName: string) => (
                  <SelectOption value={dbName}>{dbName}</SelectOption>
                ))}
              </Select>
            </TD>
            <TH colSpan={0.11} align="right">
              테이블 물리명
            </TH>
            <TD colSpan={0.22}>
              <Select
                key="metaTblPhysNm"
                style={{ textOverflow: 'ellipsis' }}
                id="metaTblPhysNm"
                appearance="Outline"
                placeholder="전체"
                className="width-100"
                value={searchInfo.metaTblPhysNm}
                onChange={(
                  e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                  value: SelectValue<{}, false>
                ) => {
                  onchangeSelectHandler(e, value, 'metaTblPhysNm');
                }}
              >
                {tablePhyList?.map((tablePhy: any) => (
                  <SelectOption value={tablePhy.tableName}>{tablePhy.tableName}</SelectOption>
                ))}
              </Select>
            </TD>
            <TH colSpan={0.11} align="right">
              테이블 논리명
            </TH>
            <TD colSpan={0.23}>
              <TextField
                key="metaTblLogiNm"
                className="width-100"
                onChange={onSearchChangeHandler}
                value={searchInfo.metaTblLogiNm}
                placeholder="검색어를 입력하세요."
                id="metaTblLogiNm"
              />
            </TD>
          </TR>
          <TR>
            <TH colSpan={searchInfo.rtmTblYn === 'Y' ? 0.199 : 0.123} align="right">
              테이블설명
            </TH>
            <TD>
              <TextField
                className="width-100"
                onChange={onSearchChangeHandler}
                value={searchInfo.metaTblDesc}
                placeholder="검색어를 입력하세요."
                id="metaTblDesc"
                key="metaTblDesc"
              />
            </TD>
            {searchInfo.rtmTblYn === 'Y' ? (
              <>
                <TH align="right" colSpan={0.2004}>
                  Topic
                </TH>
                <TD colSpan={0.416}>
                  <Select
                    id="metaTblDvCd"
                    key="metaTblDvCd"
                    appearance="Outline"
                    className="width-100"
                    value={searchInfo.metaTblDvCd}
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
                key="metaTblDvCd"
                appearance="Outline"
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
            <TH colSpan={0.11} align="right">
              사용여부
            </TH>
            <TD colSpan={0.22}>
              <Select
                id="metaTblUseYn"
                key="metaTblUseYn"
                appearance="Outline"
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
            </TD>{' '}
            <TH colSpan={0.11} align="right">
              실시간여부
            </TH>
            <TD colSpan={0.23}>
              <Select
                style={{ width: '100%' }}
                id="rtmTblYn"
                key="rtmTblYn"
                appearance="Outline"
                className="width-100"
                value={searchInfo.rtmTblYn}
                onChange={(
                  e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                  value: SelectValue<{}, false>
                ) => {
                  onchangeSelectHandler(e, value, 'rtmTblYn');
                }}
              >
                <SelectOption defaultChecked value={'N'}>
                  No
                </SelectOption>
                <SelectOption value={'Y'}>YES</SelectOption>
              </Select>
            </TD>
          </TR>
        </HorizontalTable>
      </SearchForm>
      <DataGridTblColumn
        props={searchInfo}
        list={tbCoMetaTbInfo}
        columns={customerMetaTableColumn}
        rows={tblColumns}
      ></DataGridTblColumn>
    </Stack>
  );
};

export default CustomerMetaManagementReg;
