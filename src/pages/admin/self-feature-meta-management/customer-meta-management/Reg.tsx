import SearchForm from '@/components/form/SearchForm';
import HorizontalTable from '@/components/table/HorizontalTable';
import { Select, SelectOption, TD, TH, TR, TextField, useToast, Stack, Modal, Button } from '@components/ui';
import { useCallback, useEffect, useState } from 'react';
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
import { ModalType } from '@/models/common/Constants';
import { openModal } from '@/reducers/modalSlice';
import { useAppDispatch } from '@/hooks/useRedux';

const CustomerMetaManagementReg = () => {
  // 테이블 정보
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
  const [isOpen, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  // 메타 테이블 컬럼 검색 조회
  const { data: response, isError, refetch } = useMetaTableDetail(dbNames);

  //
  const { data: responseSchema, isError: isErrorSchema, refetch: refetchSchema } = useSchemaList();

  const {
    data: responseTblInfo,
    isError: isErrorTblInfo,
    refetch: refetchTblInfo,
  } = useTableInfo(searchInfo.dbNm, 'Y');

  // 메타 테이블 컬럼 조회
  const {
    data: responseTblColumn,
    isError: isErrorTblColumn,
    refetch: refetchTblColumn,
  } = useTableColumns(searchInfo.dbNm, searchInfo.metaTblPhysNm);

  // 메타 테이블 컬럼 리스트
  const [tblColumns, setTblColumns] = useState<Array<any>>([]);

  const tblLogicList = useCallback(() => refetchTblColumn(), responseTblColumn?.result);
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
    if (value !== null && id === 'metaTblPhysNm' && searchInfo.metaTblPhysNm !== 'null') {
      dispatch(
        openModal({
          type: ModalType.CONFIRM,
          title: '알림',
          content: '입력중인 data가 있습니다. 테이블을 변경하시겠습니까?',
          onConfirm: () => {
            setSearchInfo({ ...searchInfo, [`${id}`]: String(value) });
          },
        })
      );
    } else if (value !== null && id === 'dbNm' && searchInfo.dbNm !== 'null' && searchInfo.metaTblPhysNm !== 'null') {
      if (searchInfo.dbNm !== value) {
        dispatch(
          openModal({
            type: ModalType.CONFIRM,
            title: '알림',
            content: '입력중인 data가 있습니다. 데이터 베이스를 변경하시겠습니까?',
            onConfirm: () => {
              setSearchInfo({ ...searchInfo, [`${id}`]: String(value) });
            },
          })
        );
      }
    } else {
      setSearchInfo({ ...searchInfo, [`${id}`]: String(value) });
    }
  };

  /* input state관리 */
  function onSearchChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setSearchInfo({ ...searchInfo, [id]: value });
  }
  const metaDetail = useCallback(() => refetch(), response?.result);
  const searchTblColumns = () => {
    // refetchTblColumn();
    // refetch();
    tblLogicList();
    metaDetail();
  };

  // 테이블 리스트 조회
  const tblList = useCallback(() => refetchTblInfo(), responseTblInfo?.result);

  useEffect(() => {
    if (searchInfo.dbNm !== (null || '')) {
      tblList();
    }
  }, [searchInfo.dbNm]);

  // 테이블 물리명 조회
  useEffect(() => {
    if (isErrorTblInfo || responseTblInfo?.successOrNot === 'N') {
      toast({
        type: 'Error',
        content: '조회 중 에러가 발생했습니다.',
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
      }
    }
  }, [responseTblColumn?.result, isErrorTblColumn, toast]);

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
                  <SelectOption key={dbName} value={dbName}>
                    {dbName}
                  </SelectOption>
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
                  <SelectOption key={`option-${tablePhy.tableName}`} value={tablePhy.tableName}>
                    {tablePhy.tableName}
                  </SelectOption>
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
      <Modal open={isOpen} onClose={() => setOpen(false)}>
        <Modal.Header>오류</Modal.Header>
        <Modal.Body>작성중인 Data가 있습니다. 작성을 취소하고 이동하시겠습니까? </Modal.Body>
        <Modal.Footer>
          <Button
            priority="Primary"
            appearance="Contained"
            onClick={() => {
              setOpen(false);
              return false;
            }}
          >
            확인
          </Button>
          <Button
            priority="Normal"
            appearance="Outline"
            onClick={() => {
              setOpen(false);
              return true;
            }}
          >
            취소
          </Button>
        </Modal.Footer>
      </Modal>
    </Stack>
  );
};

export default CustomerMetaManagementReg;
