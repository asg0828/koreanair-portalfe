import { ReactNode } from 'react';
import { Modal, Button } from '@components/ui';

export interface Props {
  isOpen?: boolean;
  onClose: (isOpen: boolean) => void;
  title: string;
  content: ReactNode;
  onConfirm?: Function;
  onCancle?: Function;
}

const ConfirmModal = ({ isOpen, onClose, title, content, onConfirm, onCancle }: Props) => {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm() && onClose(false);
    } else {
      onClose(false);
    }
  };

  const handleCancle = () => {
    onCancle && onCancle();
    onClose(false);
  };

  return (
    <Modal open={isOpen} onClose={onClose} size="SM">
      <Modal.Header>{title}</Modal.Header>
      <Modal.Body>{content}</Modal.Body>
      <Modal.Footer>
        <Button priority="Primary" appearance="Contained" onClick={handleConfirm}>
          확인
        </Button>
        <Button priority="Normal" appearance="Outline" onClick={handleCancle}>
          취소
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
