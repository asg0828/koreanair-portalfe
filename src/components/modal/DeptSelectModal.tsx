import { KeyboardDoubleArrowDownIcon, KeyboardDoubleArrowUpIcon } from '@/assets/icons';
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

export interface props {
  isOpen: boolean;
  onClose: (isOpen: boolean) => void;
  onRemove?: Function;
  onConfirm?: Function;
}

const DeptSelect = ({ isOpen, onClose, onRemove, onConfirm }: props) => {
  const handleRemove = () => {
    onRemove && onRemove();
    onClose(false);
  };

  const handleConfirm = () => {
    onConfirm && onConfirm();
    onClose(false);
  };

  const rowSelection = () => {};

  return (
    <Modal open={isOpen} onClose={onClose} size="LG">
      <Modal.Header>부서 선택</Modal.Header>
      <Modal.Body>
        <Stack className="width-100" alignItems="Start">
          <Stack className="tree-wrap width-100">
            <DeptTree isChecked={false} />
          </Stack>
          <Stack direction="Vertical" justifyContent="Start" className="user-seleted">
            <Stack direction="Vertical" className="user-search">
              <Stack className="search-wrap">
                <TextField className="width-100" />
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

export default DeptSelect;
