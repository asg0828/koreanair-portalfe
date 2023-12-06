import SearchForm from '@/components/form/SearchForm';
import HorizontalTable from '@/components/table/HorizontalTable';
import { Select, SelectOption, TD, TH, TR, TextField, useToast, Stack } from '@components/ui';
import { useEffect, useState } from 'react';
import { SelectValue } from '@mui/base/useSelect';
import { customerMetaInfoColumn, customerMetaTableColumn } from './data';
import DataGrid from '@/components/grid/DataGrid';
import { useSchemaList, useTableColumns, useTableInfo } from '@/hooks/queries/self-feature/useSelfFeatureAdmQueries';
import DataGridMeta from '@/components/grid/DataGridMeta';
import DataGridTblColumn from '@/components/grid/DataGridTblColumn';

const CustomerMetaManagementReg = () => {
  const [searchInfo, setSearchInfo] = useState<any>({
    metaTblPhysNm: '',
    dbNm: '',
    metaTblDesc: '',
    metaTblLogiNm: '',
  });
  const { toast } = useToast();
  const [rows, setRows] = useState<any>([]);
  const [dbNames, setDbNames] = useState<any>([]);
  const [tablePhyList, setTablePhyList] = useState<Array<any>>([]);
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

  const searchTblColumns = () => {
    refetchTblColumn();
  };

  // 테이블 물리명 조회
  useEffect(() => {
    refetchTblInfo();
    if (isErrorTblInfo || responseTblInfo?.successOrNot === 'N') {
      toast({
        type: 'Error',
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (responseTblInfo?.result) {
        setTablePhyList(responseTblInfo?.result);
        console.log(responseTblInfo?.result);
      }
    }
  }, [responseTblInfo, isErrorTblInfo, toast, searchInfo.dbName]);

  //데이터 베이스명
  useEffect(() => {
    if (isErrorSchema || responseSchema?.successOrNot === 'N') {
      toast({
        type: 'Error',
        content: '조회 중 에러가 발생했습니다.',
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
        console.log(responseTblColumn?.result);
      }
    }
  }, [responseTblColumn, isErrorTblColumn, toast]);

  return (
    <Stack direction="Vertical">
      <SearchForm onSearch={searchTblColumns}>
        <HorizontalTable>
          <TR>
            <TH colSpan={0.11} align="right">
              데이터베이스명
            </TH>
            <TD colSpan={0.22}>
              <Select
                id="dbNm"
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
              />
            </TD>
            {searchInfo.rtmTblYn === 'Y' ? (
              <>
                <TH colSpan={0.2005}>Topic</TH>
                <TD colSpan={0.416}>
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
            </TD>{' '}
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
                value={searchInfo.rtmTblYn}
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
      <DataGridTblColumn columns={customerMetaTableColumn} rows={tblColumns}></DataGridTblColumn>
    </Stack>
  );
};

export default CustomerMetaManagementReg;
