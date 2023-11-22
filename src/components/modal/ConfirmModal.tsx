import { useState, useEffect } from 'react';
import { ModalInfo } from '@/models/components/Modal';
import { Modal, Button, Stack } from '@components/ui';

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
  const [isOpenModal, setIsOpenModal] = useState(isOpen);

  useEffect(() => {
    setIsOpenModal(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpenModal(false);
    onClose && onClose(false);
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
      <Modal open={isOpenModal} onClose={handleClose} size="SM">
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
