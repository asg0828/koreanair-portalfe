import DataTree from '@/components/Tree/DataTree';
import { useDeptAllList } from '@/hooks/queries/useDeptQueries';
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
  deptCode: '',
  deptNm: '',
};

const UserSelectModal = ({
  isOpen = false,
  autoClose = true,
  title,
  content,
  onConfirm,
  onCancle,
  onClose,
  btnType,
}: ModalInfo) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [keyword, setKeyword] = useState<string>('');
  const [deptData, setDeptData] = useState<Array<any>>([]);
  const [deptTreeData, setDeptTreeData] = useState<Array<any>>([]);
  const [prevRows, setPrevRows] = useState<Array<UserModel>>([]);
  const [prevCheckedList, setPrevCheckedList] = useState<Array<UserModel>>([]);
  const { data: response, isError } = useDeptAllList();

  const columns = [{ headerName: t('management:label.deptNm'), field: 'deptNm', colSpan: 10 }];

  const handleSearch = () => {
    if (keyword) {
      setPrevRows(deptData.filter((item) => item.deptNm?.includes(keyword)));
    } else {
      setPrevRows(deptData);
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
        setDeptData(response.data.contents);
        setDeptTreeData(convertToHierarchyInfo(list));
      }
    }
  }, [response, isError, toast]);

  return (
    <Modal open={isOpen} onClose={handleClose} size="LG">
      <Modal.Header>{t('management:header.selectDept')}</Modal.Header>
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
                <Button onClick={handleSearch}>{t('common.button.search')}</Button>
              </Stack>
              <VerticalTable
                className="RightScrollTable"
                isMultiSelected={false}
                clickable={true}
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
          {t('common.button.reg')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserSelectModal;
