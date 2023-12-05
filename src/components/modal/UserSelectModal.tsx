import DataTree from '@/components/Tree/DataTree';
import { useDeptAllList } from '@/hooks/queries/useDeptQueries';
import { useUserAllList } from '@/hooks/queries/useUserQueries';
import { useAppDispatch } from '@/hooks/useRedux';
import { HierarchyInfo } from '@/models/common/CommonInfo';
import { ValidType } from '@/models/common/Constants';
import { ModalInfo } from '@/models/components/Modal';
import { DeptModel } from '@/models/model/DeptModel';
import { UserModel } from '@/models/model/UserModel';
import { closeModal } from '@/reducers/modalSlice';
import { convertToHierarchyInfo } from '@/utils/ArrayUtil';
import VerticalTable from '@components/table/VerticalTable';
import { Button, Modal, Stack, TextField, useToast } from '@components/ui';
import { useEffect, useState } from 'react';

const columns = [
  { headerName: '직원명', field: 'userNm', colSpan: 4 },
  { headerName: '부서', field: 'deptNm', colSpan: 4 },
];

const defaultResultInfo = {
  userId: '',
  userNm: '',
};

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
  const [deptTreeData, setDeptTreeData] = useState<Array<any>>([]);
  const [userData, setUsetData] = useState<Array<any>>([]);
  const [prevRows, setPrevRows] = useState<Array<UserModel>>([]);
  const [prevCheckedList, setPrevCheckedList] = useState<Array<UserModel>>([]);
  const { data: response, isError, refetch } = useDeptAllList();
  const { data: uResponse, isError: uIsError, refetch: uRefetch } = useUserAllList();

  const handleSearch = () => {
    if (keyword) {
      setPrevRows(userData.filter((item) => item.userNm?.includes(keyword)));
    } else {
      setPrevRows(userData);
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

  const handlePrevRowSelection = (prevCheckedIndexList: Array<number>, prevCheckedList: Array<any>) => {
    setPrevCheckedList(prevCheckedList);
  };

  const handleClickFile = (deptItem: any) => {
    const prevUsers = userData.filter((item: UserModel) => item.deptCode === deptItem.deptCode);
    setPrevRows(prevUsers);

    if (prevUsers.length === 0) {
      toast({
        type: ValidType.INFO,
        content: '조회된 사용자가 없습니다.',
      });
    }
  };

  const handleConfirm = () => {
    onConfirm && onConfirm(prevCheckedList.length === 0 ? defaultResultInfo : prevCheckedList[0]);
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
        const hierarchyList: Array<HierarchyInfo> = [];
        hierarchyList.push({
          id: 'root',
          parentId: '',
          name: '대한항공',
          children: convertToHierarchyInfo(list),
        });
        setDeptTreeData(hierarchyList);
      }
    }
  }, [response, isError, toast]);

  useEffect(() => {
    if (uIsError || uResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: '사용자 목록 조회 중 에러가 발생했습니다.',
      });
    } else {
      if (uResponse?.data) {
        setUsetData(uResponse.data.contents);
      }
    }
  }, [uResponse, uIsError, toast]);

  return (
    <Modal open={isOpen} onClose={handleClose} size="LG">
      <Modal.Header>사용자 선택</Modal.Header>
      <Modal.Body>
        <Stack className="width-100" alignItems="Start">
          <Stack className="tree-wrap width-100">
            <DataTree treeData={deptTreeData} onClick={handleClickFile} />
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
              <VerticalTable
                isMultiSelected={false}
                columns={columns}
                rows={prevRows}
                rowSelection={handlePrevRowSelection}
              />
            </Stack>
          </Stack>
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button size="LG" priority="Primary" appearance="Contained" onClick={handleConfirm}>
          확인
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserSelectModal;
