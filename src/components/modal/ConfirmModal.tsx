import { useAppDispatch } from '@/hooks/useRedux';
import { ModalInfo } from '@/models/components/Modal';
import { closeModal } from '@/reducers/modalSlice';
import { Button, Modal, Stack } from '@components/ui';

const ConfirmModal = ({
  isOpen = false,
  autoClose = true,
  title,
  content,
  onConfirm,
  onCancle,
  onClose,
  btnType,
}: ModalInfo) => {
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(closeModal());
  };

  const handleConfirm = () => {
    onConfirm && onConfirm();
    autoClose && handleClose();
  };

  const handleCancle = () => {
    onCancle && onCancle();
    autoClose && handleClose();
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleConfirm();
    }
  };

  const BtnComponent = () => {
    if (btnType === 'alert') {
      return (
        <>
          <Button priority="Primary" appearance="Contained" onClick={handleCancle}>
            확인
          </Button>
        </>
      );
    } else {
      return (
        <>
          <Button autoFocus priority="Primary" appearance="Contained" onClick={handleConfirm}>
            확인
          </Button>
          <Button priority="Normal" appearance="Outline" onClick={handleCancle}>
            취소
          </Button>
        </>
      );
    }
  };

  return (
    <Stack onKeyDown={handleKeyDown}>
      <Modal open={isOpen} onClose={handleClose} size="SM">
        <Modal.Header>{title}</Modal.Header>
        <Modal.Body>{content}</Modal.Body>
        <Modal.Footer>
          <BtnComponent />
        </Modal.Footer>
      </Modal>
    </Stack>
  );
};

export default ConfirmModal;
