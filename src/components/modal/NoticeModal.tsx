import { useState, useEffect, useCallback } from 'react';
import HorizontalTable from '@components/table/HorizontalTable';
import { CheckedState } from '@/models/common/Design';
import { Modal, Button, Stack, TR, TH, TD, Typography, Checkbox } from '@components/ui';
import '@/assets/styles/Board.scss';

export interface Props {
  isOpen?: boolean;
  onClose?: (isOpen: boolean) => void;
}

const NoticeModal = ({ isOpen = false, onClose }: Props) => {
  const hasVisited = localStorage.getItem('hasVisited');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const handleClose = useCallback(
    (isOpenModal: boolean) => {
      if (onClose) {
        onClose(isOpenModal);
      } else {
        setIsOpenModal(isOpenModal);
      }
    },
    [onClose]
  );

  const handleConfirm = () => {
    handleClose(false);
  };

  const handleChecked = (checked: CheckedState) => {
    if (checked) {
      const hasVisited = new Date().setHours(23, 59, 59, 0).toString();
      localStorage.setItem('hasVisited', hasVisited);
      handleClose(false);
    }
  };

  useEffect(() => {
    setIsOpenModal(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (onClose) {
      return;
    } else if (!hasVisited || hasVisited < new Date().getTime().toString()) {
      handleClose(true);
    }
  }, [hasVisited, handleClose, onClose]);

  return (
    <Modal open={isOpenModal} onClose={handleClose} size="LG">
      <Modal.Header>공지사항</Modal.Header>
      <Modal.Body>
        <Stack direction="Vertical" gap="MD" className="height-100 width-100">
          <HorizontalTable className="height-100">
            <TR>
              <TH colSpan={4} className="headerName">
                <Typography variant="h3">공지사항 테스트</Typography>
              </TH>
            </TR>
            <TR className="height-100">
              <TD colSpan={4} className="content"></TD>
            </TR>
            <TR>
              <TH colSpan={1} className="attachFile">
                첨부파일
              </TH>
              <TD colSpan={3}></TD>
            </TR>
            <TR>
              <TH colSpan={1}>다음</TH>
              <TD colSpan={3}></TD>
            </TR>
            <TR>
              <TH colSpan={1}>이전</TH>
              <TD colSpan={3}></TD>
            </TR>
          </HorizontalTable>
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Stack className="width-100">
          <Checkbox label="오늘 하루 보지 않음" onCheckedChange={handleChecked} />
          <Stack justifyContent="End" className="width-100">
            <Button priority="Normal" appearance="Contained" onClick={handleConfirm}>
              확인
            </Button>
          </Stack>
        </Stack>
      </Modal.Footer>
    </Modal>
  );
};

export default NoticeModal;
