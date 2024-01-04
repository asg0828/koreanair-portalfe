import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cloneDeep } from 'lodash';
import { SelectValue } from '@mui/base/useSelect';

import { Button, Select, SelectOption, TD, TH, TR, useToast } from '@components/ui';
import SearchForm from '@/components/form/SearchForm';
import HorizontalTable from '@/components/table/HorizontalTable';
import DataGrid from '@/components/grid/DataGrid';
import ConfirmModal from '@/components/modal/ConfirmModal';

import { PageModel, initPage } from '@/models/model/PageModel';
import { MstrProfDelProps, MstrProfSearchInfoProps, TbRsMstrSgmtRule } from '@/models/selfFeature/FeatureAdmModel';
import { initMstrProfDelProps, initMstrProfSearchInfoProps, mstrProfListColumns } from './data';
import { ModalTitCont, ModalType, useYn } from '@/models/selfFeature/FeatureCommon';
import { ValidType, View } from '@/models/common/Constants';

import { PagingUtil, setPageList } from '@/utils/self-feature/PagingUtil';

import { useMstrProfList } from '@/hooks/queries/self-feature/useSelfFeatureAdmQueries';
import { useDeleteMstrProfInfo } from '@/hooks/mutations/self-feature/useSelfFeatureAdmMutations';

const MasterProfileManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [page, setPage] = useState<PageModel>(cloneDeep(initPage));
  const [rows, setRows] = useState<Array<TbRsMstrSgmtRule>>([]);
  const [searchInfo, setSearchInfo] = useState<MstrProfSearchInfoProps>(cloneDeep(initMstrProfSearchInfoProps));
  const [oriList, setOriList] = useState<Array<TbRsMstrSgmtRule>>([]);
  const { data: mstrProfListRes, isError: mstrProfListErr, refetch: mstrProfListRefetch } = useMstrProfList(searchInfo);
  const [mstrProfDelList, setMstrProfDelList] = useState<MstrProfDelProps>(cloneDeep(initMstrProfDelProps));
  const {
    data: delMstrProfRes,
    isSuccess: delMstrProfSucc,
    isError: delMstrProfErr,
    mutate: delMstrProfMutate,
  } = useDeleteMstrProfInfo(mstrProfDelList);
  // 모달, 버튼 클릭 종류
  const [btnClickType, setBtnClickType] = useState<string>('');
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false);
  const [confirmModalTit, setConfirmModalTit] = useState<string>('');
  const [confirmModalCont, setConfirmModalCont] = useState<string>('');
  const [modalType, setModalType] = useState<string>('');
  // modal 확인/취소 이벤트
  const onConfirm = () => {
    if (modalType === ModalType.CONFIRM) {
      if (btnClickType === 'delete') {
        if (mstrProfDelList.mstrSgmtRuleIds.length < 1) {
          setModalType(ModalType.ALERT);
          setConfirmModalTit('Master Profile 삭제');
          setConfirmModalCont(ModalTitCont.DEL_VALID.context);
          setIsOpenConfirmModal(true);
          return;
        }
        delMstrProfMutate();
      }
    }
    setIsOpenConfirmModal(false);
  };
  const onCancel = () => {
    setIsOpenConfirmModal(false);
  };
  // 검색 버튼 클릭시 목록 refetch
  const handleSearch = () => {
    mstrProfListRefetch();
  };
  // 초기화 버튼
  const onClear = () => {
    setSearchInfo(cloneDeep(initMstrProfSearchInfoProps));
  };
  const handlePage = (page: PageModel) => {
    setPage(PagingUtil(oriList, page));
  };
  // 목록 조회시 리스트 값 설정
  useEffect(() => {
    if (mstrProfListErr || mstrProfListRes?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '조회 중 에러가 발생했습니다.',
      });
    } else {
      if (mstrProfListRes) {
        setOriList(mstrProfListRes.result);
        PagingUtil(mstrProfListRes.result, page);
      }
    }
  }, [mstrProfListRes, mstrProfListErr, toast]);
  useEffect(() => {
    setPageList(page, oriList, setRows);
  }, [page.page, page.pageSize, oriList]);
  // const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const { id, value } = e.target;
  //     setSearchInfo({ ...searchInfo, [id]: value })
  // }
  const onchangeSelectHandler = (
    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
    value: SelectValue<{}, false>,
    id?: String
  ) => {
    setSearchInfo({ ...searchInfo, [`${id}`]: String(value) });
  };
  // 체크 목록 생성
  const getCheckList = (checkedList: Array<number>) => {
    setMstrProfDelList((prevState: MstrProfDelProps) => {
      let rtn = cloneDeep(prevState);
      rtn.mstrSgmtRuleIds = checkedList.map((index) => rows[index].mstrSgmtRuleId);
      return rtn;
    });
  };
  const goToDetail = (row: MstrProfSearchInfoProps) => {
    navigate(
      `${View.DETAIL}?rslnRuleId=${row.rslnRuleId}&mstrSgmtRuleId=${row.mstrSgmtRuleId}`,
      {
        state: {
          //row,
        },
      });
  };
  // 메타테이블 컬럼 신규 등록 페이지 이동버튼
  const goToReg = () => {
    navigate(View.REG);
  };
  // 메타테이블컬럼 삭제 버튼
  const deleteMetaTableColumn = () => {
    // 삭제 처리
    setModalType(ModalType.CONFIRM);
    setBtnClickType('delete');
    setConfirmModalTit(ModalTitCont.DELETE.title);
    setConfirmModalCont(ModalTitCont.DELETE.context);
    setIsOpenConfirmModal(true);
  };
  // 삭제 처리 API Callback
  useEffect(() => {
    if (delMstrProfErr || delMstrProfRes?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '삭제 중 에러가 발생했습니다',
      });
    } else if (delMstrProfSucc) {
      toast({
        type: ValidType.CONFIRM,
        content: '삭제 되었습니다.',
      });
      handleSearch();
    }
  }, [delMstrProfRes, delMstrProfSucc, delMstrProfErr]);

  return (
    <>
      <SearchForm onSearch={handleSearch} onClear={onClear}>
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
                value={searchInfo.useYn}
                onChange={(
                  e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                  value: SelectValue<{}, false>
                ) => {
                  onchangeSelectHandler(e, value, 'useYn');
                }}
              >
                {useYn.map((item, index) => (
                  <SelectOption key={index} value={item.value}>
                    {item.text}
                  </SelectOption>
                ))}
              </Select>
            </TD>
            <TD colSpan={8}></TD>
          </TR>
        </HorizontalTable>
      </SearchForm>

      <DataGrid
        columns={mstrProfListColumns}
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
      {/* Confirm 모달 */}
      <ConfirmModal
        isOpen={isOpenConfirmModal}
        onClose={(isOpen) => setIsOpenConfirmModal(isOpen)}
        title={confirmModalTit}
        content={confirmModalCont}
        onConfirm={onConfirm}
        onCancle={onCancel}
        btnType={modalType}
      />
    </>
  );
};

export default MasterProfileManagement;
