import { ModalInfo } from '@/models/components/Modal';
import { Button, Modal, Stack, TextField } from '@components/ui';
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
  const [value, setValue] = useState<any>('');

  useEffect(() => {
    setIsOpenModal(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpenModal(false);
    onClose && onClose(false);
  };

  const handleConfirm = () => {
    onConfirm && onConfirm(value);
    autoClose && handleClose();
  };

  const handleCancle = () => {
    onCancle && onCancle();
    autoClose && handleClose();
  };

  const handleChange = (value: string) => {
    setValue(value);
  };

  useEffect(() => {
    content && setValue(content);
  }, [content]);

  return (
    <Stack>
      <Modal open={isOpenModal} onClose={handleClose} size="LG">
        <Modal.Header>{title}</Modal.Header>
        <Modal.Body>
          <TextField
            multiline
            autoFocus
            className="width-100 height-300"
            onChange={(e) => handleChange(e.target.value)}
            value={value}
          />
        </Modal.Body>
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
