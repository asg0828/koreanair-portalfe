import { KeyboardDoubleArrowDownIcon, KeyboardDoubleArrowUpIcon } from '@/assets/icons';
import { useAppDispatch } from '@/hooks/useRedux';
import { ModalInfo } from '@/models/components/Modal';
import { closeModal } from '@/reducers/modalSlice';
import DeptTree from '@components/Tree/DeptTree';
import VerticalTable from '@components/table/VerticalTable';
import { Button, Modal, Stack, TextField } from '@components/ui';

const columns = [
  { headerName: '직원명', field: 'column1', colSpan: 4 },
  { headerName: '부서', field: 'column2', colSpan: 4 },
];

const rows = [
  {
    column1: '홍길동',
    column2: '서비스개발본부',
  },
  {
    column1: '관리자',
    column2: '서비스개발본부',
  },
];

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

  const handleConfirm = () => {
    onConfirm && onConfirm();
    onClose && onClose(false);
  };

  const handleClose = () => {
    dispatch(closeModal());
  };

  const rowSelection = () => {};

  return (
    <Modal open={isOpen} onClose={handleClose} size="LG">
      <Modal.Header>사용자 선택</Modal.Header>
      <Modal.Body>
        <Stack className="width-100" alignItems="Start">
          <Stack className="tree-wrap width-100">
            <DeptTree isChecked={false} />
          </Stack>
          <Stack direction="Vertical" justifyContent="Start" className="user-seleted">
            <Stack direction="Vertical" className="user-search">
              <Stack className="search-wrap">
                <TextField className="width-100" autoFocus />
                <Button>검색</Button>
              </Stack>
              <VerticalTable columns={columns} rows={rows} rowSelection={rowSelection} />
            </Stack>
            <Stack alignItems="Center" direction="Horizontal" justifyContent="Center" className="updown-btns">
              <Button size="LG" appearance="Unfilled" iconOnly>
                <KeyboardDoubleArrowDownIcon />
              </Button>
              <Button size="LG" appearance="Unfilled" iconOnly>
                <KeyboardDoubleArrowUpIcon />
              </Button>
            </Stack>
            <VerticalTable columns={columns} rows={rows} rowSelection={rowSelection} />
          </Stack>
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button priority="Primary" appearance="Contained" onClick={handleConfirm}>
          확인
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserSelectModal;
