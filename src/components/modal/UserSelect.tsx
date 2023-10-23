import DeptTree from '@components/Tree/DeptTree';
import { Modal, Button, Stack, TextField } from '@components/ui';
import VerticalTable from '@components/table/VerticalTable';

const columns = [
  { headerName: '직원명', field: 'column1' },
  { headerName: '부서', field: 'column2' },
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

export interface props {
  isOpen: boolean;
  onClose: (isOpen: boolean) => void;
  onConfirm?: Function;
}

const UserSelect = ({ isOpen, onClose, onConfirm }: props) => {
  const handleConfirm = () => {
    onConfirm && onConfirm();
    onClose(false);
  };

  const rowSelection = () => {

  }

  return (
    <Modal open={isOpen} onClose={onClose} size="LG">
      <Modal.Header>사용자 선택</Modal.Header>
      <Modal.Body>
        <Stack className="width-100">
          <DeptTree isChecked={false} />
          <Stack>
            <Stack direction="Vertical">
              <Stack>
                <TextField />
                <Button>검색</Button>
              </Stack>
              <VerticalTable columns={columns} rows={rows} rowSelection={rowSelection} />
            </Stack>
            <VerticalTable columns={columns} rows={rows} rowSelection={rowSelection} />
          </Stack>
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button priority="Normal" appearance="Contained" onClick={handleConfirm}>
          확인
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserSelect;
