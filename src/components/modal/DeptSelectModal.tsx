import DataTree from '@/components/Tree/DataTree';
import { useDeptAllList } from '@/hooks/queries/useDeptQueries';
import { useAppDispatch } from '@/hooks/useRedux';
import { HierarchyInfo } from '@/models/common/CommonInfo';
import { ValidType } from '@/models/common/Constants';
import { ModalInfo } from '@/models/components/Modal';
import { DeptModel } from '@/models/model/DeptModel';
import { UserModel } from '@/models/model/UserModel';
import { closeModal } from '@/reducers/modalSlice';
import { convertToHierarchyInfo, getNodeChildrenDeptCodeRecursive } from '@/utils/ArrayUtil';
import VerticalTable from '@components/table/VerticalTable';
import { Button, Modal, Stack, TextField, useToast } from '@components/ui';
import { useEffect, useState } from 'react';

const columns = [{ headerName: '부서명', field: 'deptNm', colSpan: 10 }];

const defaultResultInfo = {
  deptCode: '',
  deptNm: '',
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
  const [deptData, setDeptData] = useState<Array<any>>([]);
  const [deptTreeData, setDeptTreeData] = useState<Array<any>>([]);
  const [prevRows, setPrevRows] = useState<Array<UserModel>>([]);
  const [prevCheckedList, setPrevCheckedList] = useState<Array<UserModel>>([]);
  const { data: response, isError, refetch } = useDeptAllList();

  const handleSearch = () => {
    if (keyword) {
      setPrevRows(deptData.filter((item) => item.deptNm?.includes(keyword)));
    } else {
      setPrevRows(deptData);
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
    const deptItemList = Array.from(getNodeChildrenDeptCodeRecursive(deptItem));
    const prevDepts = deptData.filter((item: UserModel) => deptItemList.includes(item.deptCode));
    setPrevRows(prevDepts);
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
        setDeptData(response.data.contents);
        setDeptTreeData(hierarchyList);
      }
    }
  }, [response, isError, toast]);

  return (
    <Modal open={isOpen} onClose={handleClose} size="LG">
      <Modal.Header>부서 선택</Modal.Header>
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
