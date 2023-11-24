import { KeyboardDoubleArrowDownIcon, KeyboardDoubleArrowUpIcon } from '@/assets/icons';
import { useAppDispatch } from '@/hooks/useRedux';
import { ModalInfo } from '@/models/components/Modal';
import { closeModal } from '@/reducers/modalSlice';
import DeptTree from '@components/Tree/DeptTree';
import VerticalTable from '@components/table/VerticalTable';
import { Button, Modal, Stack, TextField } from '@components/ui';

const columns = [{ headerName: '부서명', field: 'column1', colSpan: 10 }];

const rows = [
  {
    column1: '서비스개발본부',
  },
  {
    column1: '서비스개발본부',
  },
];

const DeptSelectModal = ({
  isOpen = false,
  autoClose = true,
  title = '부서 선택',
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

  const handleRemove = () => {
    onClose && onClose(false);
  };

  const handleClose = () => {
    dispatch(closeModal());
  };

  const rowSelection = () => {};

  return (
    <Modal open={isOpen} onClose={handleClose} size="LG">
      <Modal.Header>부서 선택</Modal.Header>
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
        <Button priority="Primary" appearance="Contained" onClick={handleRemove}>
          삭제
        </Button>
        <Button onClick={handleConfirm}>확인</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeptSelectModal;
