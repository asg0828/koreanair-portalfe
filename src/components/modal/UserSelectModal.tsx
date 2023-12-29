import { KeyboardDoubleArrowDownIcon, KeyboardDoubleArrowUpIcon } from '@/assets/icons';
import DataTree from '@/components/tree/DataTree';
import { useDeptAllList } from '@/hooks/queries/useDeptQueries';
import { useUserAllList } from '@/hooks/queries/useUserQueries';
import { useAppDispatch } from '@/hooks/useRedux';
import { ValidType } from '@/models/common/Constants';
import { ModalInfo } from '@/models/components/Modal';
import { DeptModel } from '@/models/model/DeptModel';
import { UserModel } from '@/models/model/UserModel';
import { closeModal } from '@/reducers/modalSlice';
import { convertToHierarchyInfo, getNodeChildrenDeptCodeRecursive } from '@/utils/ArrayUtil';
import VerticalTable from '@components/table/VerticalTable';
import { Button, Modal, Stack, TextField, useToast } from '@components/ui';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const defaultResultInfo = {
  userId: '',
  userNm: '',
};

export interface UserSelectModalProps extends ModalInfo {
  isMultiSelected?: boolean;
  userIdList?: Array<string>;
}

const UserSelectModal = ({
  isOpen = false,
  autoClose = true,
  isMultiSelected = false,
  userIdList = [],
  title,
  content,
  onConfirm,
  onCancle,
  onClose,
  btnType,
}: UserSelectModalProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [keyword, setKeyword] = useState<string>('');
  const [deptTreeData, setDeptTreeData] = useState<Array<any>>([]);
  const [userData, setUserData] = useState<Array<any>>([]);
  const [prevRows, setPrevRows] = useState<Array<UserModel>>([]);
  const [prevCheckedList, setPrevCheckedList] = useState<Array<UserModel>>([]);
  const [nextRows, setNextRows] = useState<Array<UserModel>>([]);
  const [nextCheckedList, setNextCheckedList] = useState<Array<UserModel>>([]);
  const { data: response, isError } = useDeptAllList();
  const { data: uResponse, isError: uIsError } = useUserAllList();

  const columns = [
    { headerName: t('management:label.userNm'), field: 'userNm', colSpan: 4 },
    { headerName: t('management:label.deptNm'), field: 'deptNm', colSpan: 4 },
  ];

  const handleSearch = () => {
    if (keyword) {
      setPrevRows(userData.filter((item) => item.userNm?.includes(keyword)));
    } else {
      setPrevRows(userData);
    }
  };

  const handleChangeKeyword = (nKeyword: string) => {
    setKeyword(nKeyword);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePrevRowSelection = (prevCheckedIndexList: Array<number>, nPrevCheckedList: Array<any>) => {
    setPrevCheckedList(nPrevCheckedList);
  };

  const handleNextRowSelection = (nextCheckedIndexList: Array<number>, nNextCheckedList: Array<any>) => {
    setNextCheckedList(nNextCheckedList);
  };

  const handleClickFile = (deptItem: any) => {
    const deptItemList = Array.from(getNodeChildrenDeptCodeRecursive(deptItem));
    const prevUsers = userData.filter((item: UserModel) => deptItemList.includes(item.deptCode));
    setPrevRows(prevUsers);
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

  const handleConfirm = () => {
    if (isMultiSelected) {
      onConfirm && onConfirm(nextRows);
    } else {
      onConfirm && onConfirm(prevCheckedList.length === 0 ? defaultResultInfo : prevCheckedList[0]);
    }
    autoClose && handleClose();
  };

  const handleClose = () => {
    dispatch(closeModal());
  };

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('management:toast.error.deptList'),
      });
    } else {
      if (response?.data) {
        const list = response.data.contents.map((item: DeptModel) => ({
          ...item,
          id: item.deptCode,
          name: item.deptNm,
          parentId: item.upDeptCode || 'root',
        }));
        setDeptTreeData(convertToHierarchyInfo(list));
      }
    }
  }, [response, isError, toast]);

  useEffect(() => {
    if (uIsError || uResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('management:toast.error.userList'),
      });
    } else {
      if (uResponse?.data) {
        const userList = uResponse.data.contents;
        setUserData(userList);
        setPrevRows(userList);
        setNextRows(userList.filter((item: UserModel) => userIdList.includes(item.userId)));
      }
    }
  }, [uResponse, uIsError, toast]);

  return (
    <Modal open={isOpen} onClose={handleClose} size="LG">
      <Modal.Header>{t('management:header.selectUser')}</Modal.Header>
      <Modal.Body>
        <Stack className="width-100" alignItems="Start">
          <Stack className="tree-wrap width-100">
            <DataTree treeHeight={isMultiSelected ? 630 : 500} treeData={deptTreeData} onClick={handleClickFile} />
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
                <Button onClick={handleSearch}>{t('common.button.search')}</Button>
              </Stack>
              <VerticalTable
                className={isMultiSelected ? 'multiSelectTable' : 'RightScrollTable'}
                isMultiSelected={isMultiSelected}
                clickable={true}
                columns={columns}
                rows={prevRows}
                rowSelection={handlePrevRowSelection}
              />
            </Stack>
            {isMultiSelected && (
              <>
                <Stack alignItems="Center" direction="Horizontal" justifyContent="Center" className="updown-btns">
                  <Button size="LG" appearance="Unfilled" iconOnly onClick={handleAddUsers}>
                    <KeyboardDoubleArrowDownIcon />
                  </Button>
                  <Button size="LG" appearance="Unfilled" iconOnly onClick={handleRemoveUsers}>
                    <KeyboardDoubleArrowUpIcon />
                  </Button>
                </Stack>
                <VerticalTable
                  className="multiSelectTable"
                  clickable={true}
                  columns={columns}
                  rows={nextRows}
                  rowSelection={handleNextRowSelection}
                />
              </>
            )}
          </Stack>
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button size="LG" priority="Primary" appearance="Contained" onClick={handleConfirm}>
          {t('common.button.confirm')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserSelectModal;
