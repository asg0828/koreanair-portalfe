import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import { SelectValue } from '@mui/base/useSelect';
import SearchForm from '@/components/form/SearchForm';
import HorizontalTable from '@/components/table/HorizontalTable';
import { Button, Select, SelectOption, Stack, TD, TH, TR, TextField, useToast } from '@components/ui';
import { ModalType, ValidType, View } from '@/models/common/Constants';
import DataGrid from '@/components/grid/DataGrid';
import { PageModel, initPage } from '@/models/model/PageModel';
import { PagingUtil, setPageList } from '@/utils/self-feature/PagingUtil';
import { useColAndCmmtList, useMetaTableList } from '@/hooks/queries/self-feature/useSelfFeatureAdmQueries';
import { CustMetaSrchItem, CustMetaTableData, CustMetaListSrchInfo } from '@/models/selfFeature/FeatureAdmModel';
import { initCustMetaSrchItem, initCustMetaListSrchInfo, metaTableColumn } from './data';
import { useYn } from '@/models/selfFeature/FeatureCommon';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useRedux';
import { openModal } from '@/reducers/modalSlice';
import { useDeleteMetaTable } from '@/hooks/mutations/self-feature/useSelfFeatureAdmMutations';

const CustomerMetaManagement = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [page, setPage] = useState<PageModel>(initPage);
  const [rows, setRows] = useState<Array<CustMetaTableData>>([]);
  const { toast } = useToast();
  const tableName = 'tb_co_meta_tbl_info';
  const [searchInfo, setSearchInfo] = useState<CustMetaListSrchInfo>(cloneDeep(initCustMetaListSrchInfo));
  const { data: metaTableRes, isError: metaTableErr, refetch: metaTableRefetch } = useMetaTableList(searchInfo);
  const { data: colCmmtRes, isError: colCmmtErr, refetch: colCmmtRefetch } = useColAndCmmtList(tableName);
  const [oriList, setOriList] = useState<Array<CustMetaTableData>>([]);
  const [srchItemListOption, setSrchItemListOption] = useState<Array<CustMetaSrchItem>>([]);
  const [metaTblIds, setMetaTblsId] = useState<Array<string>>([]);
  const { mutate, data: dResponse, isSuccess: dIsSuccess, isError: dIsError } = useDeleteMetaTable(metaTblIds);

  // 검색 버튼 클릭시 목록 refetch
  const handleSearch = () => {
    metaTableRefetch();
  };

  // 페이지당 목록 수, 페이지 번호 바뀔 경우
  const handlePage = (page: PageModel) => {
    setPage(PagingUtil(oriList, page));
  };

  // 목록 조회시 리스트 값 설정
  useEffect(() => {
    if (metaTableErr || metaTableRes?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (metaTableRes) {
        setOriList(metaTableRes.result);
        PagingUtil(metaTableRes.result, page);
      }
    }
  }, [metaTableRes, metaTableErr, toast]);

  useEffect(() => {
    setPageList(page, oriList, setRows);
  }, [page.page, page.pageSize, oriList]);

  // 검색어 기준 select option 공통코드 사용 설정
  useEffect(() => {
    if (colCmmtErr || colCmmtRes?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (colCmmtRes) {
        setSrchItemListOption(() => {
          return cloneDeep([...[initCustMetaSrchItem], ...colCmmtRes.result]);
        });
      }
    }
  }, [colCmmtRes, colCmmtErr, toast]);

  // 검색어 기준 변경시 검색어 입력값 초기화
  useEffect(() => {
    setSearchInfo((prevState: CustMetaListSrchInfo) => {
      let rtn = cloneDeep(prevState);
      rtn.searchWord = '';
      return rtn;
    });
  }, [searchInfo.item]);

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

  // 초기화 버튼
  const onClear = () => {
    setSearchInfo(cloneDeep(initCustMetaListSrchInfo));
  };

  // 체크 목록 생성
  const getCheckList = (checkedList: Array<number>) => {
    setMetaTblsId(checkedList.map((index) => rows[index].metaTblId));
  };

  const goToDetail = (row: CustMetaTableData, index: number) => {
    navigate(View.DETAIL, {
      state: {
        metaTblId: row.metaTblId,
        metaTblLogiNm: row.metaTblLogiNm,
        rtmTblYn: row.rtmTblYn,
      },
    });
  };

  // 메타테이블 컬럼 신규 등록 페이지 이동버튼
  const goToReg = () => {
    navigate(View.REG);
  };

  // 메타테이블컬럼 삭제 버튼
  const deleteMetaTableColumn = () => {
    dispatch(
      openModal({
        type: ModalType.CONFIRM,
        title: '삭제',
        content: '삭제하시겠습니까?',
        onConfirm: mutate,
      })
    );
  };

  return (
    <>
      <SearchForm onSearch={handleSearch} onClear={onClear}>
        <HorizontalTable>
          <TR>
            <TH colSpan={1} align="right">
              메타구분
            </TH>
            <TD colSpan={3}>
              <Select
                appearance="Outline"
                placeholder="전체"
                className="width-100"
                value={searchInfo.item}
                onChange={(
                  e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                  value: SelectValue<{}, false>
                ) => {
                  onchangeSelectHandler(e, value, 'item');
                }}
              >
                {srchItemListOption.map((item, index) => (
                  <SelectOption key={index} value={item.columnName}>
                    {item.columnComment}
                  </SelectOption>
                ))}
              </Select>
            </TD>
            <TH colSpan={1} align="right">
              사용여부
            </TH>
            <TD colSpan={3}>
              <Select
                appearance="Outline"
                placeholder="선택"
                className="width-100"
                value={searchInfo.metaTblUseYn}
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
        rows={rows}
        enableSort={false}
        clickable={true}
        page={page}
        onChange={handlePage}
        onClick={goToDetail}
        rowSelection={(checkedList: Array<number>) => getCheckList(checkedList)}
        buttonChildren={
          <>
            <Button onClick={deleteMetaTableColumn} priority="Normal" appearance="Outline" size="LG">
              삭제
            </Button>
            <Button onClick={goToReg} priority="Primary" appearance="Contained" size="LG">
              신규등록
            </Button>
          </>
        }
      />
    </>
  );
};

export default CustomerMetaManagement;
function setPage(arg0: PageModel) {
  throw new Error('Function not implemented.');
}
