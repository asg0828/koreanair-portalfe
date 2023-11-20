import { ModalInfo } from '@/models/components/Modal';
import { Button, Modal, Stack } from '@components/ui';
import { useEffect, useState } from 'react';

const CalculationLogicModal = ({
  isOpen = false,
  autoClose = true,
  title,
  content,
  onConfirm,
  onCancle,
  onClose,
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

  return (
    <Stack>
      <Modal open={isOpenModal} onClose={handleClose} size="LG">
        <Modal.Header>{title}</Modal.Header>
        <Modal.Body>{content}</Modal.Body>
        <Modal.Footer>
          <Button priority="Primary" appearance="Contained" onClick={handleConfirm}>
            저장
          </Button>
          <Button priority="Normal" appearance="Outline" onClick={handleCancle}>
            취소
          </Button>
        </Modal.Footer>
      </Modal>
    </Stack>
  );
};

export default CalculationLogicModal;
