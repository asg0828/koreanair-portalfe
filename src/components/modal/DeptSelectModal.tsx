import { KeyboardDoubleArrowDownIcon, KeyboardDoubleArrowUpIcon } from '@/assets/icons';
import { useDeptAllList } from '@/hooks/queries/useDeptQueries';
import { useAppDispatch } from '@/hooks/useRedux';
import { ValidType } from '@/models/common/Constants';
import { ModalInfo } from '@/models/components/Modal';
import { DeptModel } from '@/models/model/DeptModel';
import { UserModel } from '@/models/model/UserModel';
import { closeModal } from '@/reducers/modalSlice';
import { convertToHierarchy } from '@/utils/ArrayUtil';
import DeptTree from '@components/Tree/DeptTree';
import VerticalTable from '@components/table/VerticalTable';
import { Button, Modal, Stack, TextField, useToast } from '@components/ui';
import { useEffect, useState } from 'react';

const columns = [{ headerName: '부서명', field: 'column1', colSpan: 10 }];

const UserSelectModal = ({
  isOpen = false,
  autoClose = true,
  title = '사용자 선택',
  content,
  onConfirm,
  onCancle,
  onClose,
  btnType,
}: ModalInfo) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [keyword, setKeyword] = useState<string>('');
  const [deptData, setDeptData] = useState<Array<any>>([]);
  const [prevRows, setPrevRows] = useState<Array<UserModel>>([]);
  const [nextRows, setNextRows] = useState<Array<UserModel>>([]);
  const [initPrevRows, setInitPrevRows] = useState<Array<UserModel>>([]);
  const [prevCheckedList, setPrevCheckedList] = useState<Array<UserModel>>([]);
  const [nextCheckedList, setNextCheckedList] = useState<Array<UserModel>>([]);
  const { data: response, isError, refetch } = useDeptAllList();

  const handleSearch = () => {
    if (keyword) {
      setPrevRows(initPrevRows.filter((item) => item.userNm.includes(keyword) || item.deptNm.includes(keyword)));
    } else {
      setPrevRows(initPrevRows);
    }
  };

  const handleChangeKeyword = (keyword: string) => {
    setKeyword(keyword);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePrevRowSelection = (prevCheckedList: Array<any>) => {
    setPrevCheckedList(prevRows.filter((item, index) => prevCheckedList.some((index2) => index === index2)));
  };

  const handleNextRowSelection = (nextCheckedList: Array<any>) => {
    setNextCheckedList(nextRows.filter((item, index) => nextCheckedList.some((index2) => index === index2)));
  };

  const handleClickFile = (deptItem: any) => {
    const prevDepts = deptData.filter((item: UserModel) => item.deptCode === deptItem.deptCode);
    setInitPrevRows(prevDepts);
    setPrevRows(prevDepts);

    if (prevDepts.length === 0) {
      toast({
        type: ValidType.INFO,
        content: '조회된 부서가 없습니다.',
      });
    }
  };

  const handleAddUsers = () => {
    setNextRows((prevState) => {
      const addList = prevCheckedList.filter(
        (item) => !prevState.some((nextItem: UserModel) => nextItem.userId === item.userId)
      );

      return prevState.concat(addList);
    });
    setNextCheckedList([]);
  };

  const handleRemoveUsers = () => {
    setNextRows((prevState) => {
      const filterList = prevState.filter(
        (item) => !nextCheckedList.some((nextItem: UserModel) => nextItem.userId === item.userId)
      );

      return filterList;
    });
    setNextCheckedList([]);
  };

  const handleRemove = () => {};

  const handleConfirm = () => {
    onConfirm && onConfirm(nextRows);
    autoClose && handleClose();
  };

  const handleClose = () => {
    dispatch(closeModal());
  };

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '부서 목록 조회 중 에러가 발생했습니다.',
      });
    } else {
      if (response?.data) {
        const list = response.data.contents.map((item: DeptModel) => ({
          ...item,
          id: item.deptCode,
          name: item.deptNm,
          parentId: item.upDeptCode || 'root',
        }));
        const hierarchyList = convertToHierarchy(list);
        const root = {
          id: 'root',
          name: '대한항공',
          isChecked: false,
          children: hierarchyList,
        };
        setDeptData([root]);
      }
    }
  }, [response, isError, toast]);

  return (
    <Modal open={isOpen} onClose={handleClose} size="LG">
      <Modal.Header>부서 선택</Modal.Header>
      <Modal.Body>
        <Stack className="width-100" alignItems="Start">
          <Stack className="tree-wrap width-100">
            <DeptTree data={deptData} onClickFile={handleClickFile} />
          </Stack>
          <Stack direction="Vertical" justifyContent="Start" className="user-seleted">
            <Stack direction="Vertical" className="user-search">
              <Stack className="search-wrap">
                <TextField
                  className="width-100"
                  autoFocus
                  onKeyDown={handleKeyDown}
                  onChange={(e) => handleChangeKeyword(e.target.value)}
                />
                <Button onClick={handleSearch}>검색</Button>
              </Stack>
              <VerticalTable columns={columns} rows={prevRows} rowSelection={handlePrevRowSelection} />
            </Stack>
            <Stack alignItems="Center" direction="Horizontal" justifyContent="Center" className="updown-btns">
              <Button size="LG" appearance="Unfilled" iconOnly onClick={handleAddUsers}>
                <KeyboardDoubleArrowDownIcon />
              </Button>
              <Button size="LG" appearance="Unfilled" iconOnly onClick={handleRemoveUsers}>
                <KeyboardDoubleArrowUpIcon />
              </Button>
            </Stack>
            <VerticalTable columns={columns} rows={nextRows} rowSelection={handleNextRowSelection} />
          </Stack>
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button priority="Primary" appearance="Contained" onClick={handleRemove}>
          삭제
        </Button>
        <Button onClick={handleConfirm}>확인</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserSelectModal;
