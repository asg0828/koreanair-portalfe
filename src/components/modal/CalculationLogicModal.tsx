import { useAppDispatch } from '@/hooks/useRedux';
import { ModalInfo } from '@/models/components/Modal';
import { closeModal } from '@/reducers/modalSlice';
import { Button, Modal, Stack, TextField } from '@components/ui';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const CalculationLogicModal = ({
  isOpen = false,
  autoClose = true,
  disabled = false,
  title,
  content,
  onConfirm,
  onCancle,
  onClose,
}: ModalInfo) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [value, setValue] = useState<any>('');

  const handleClose = () => {
    dispatch(closeModal());
  };

  const handleConfirm = () => {
    onConfirm && onConfirm(value);
    autoClose && handleClose();
  };

  const handleCancle = () => {
    onCancle && onCancle();
    autoClose && handleClose();
  };

  const handleChange = (nValue: string) => {
    setValue(nValue);
  };

  const handleInputTab = (e: any) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      setValue(value + '\t');
    }
  };

  useEffect(() => {
    content && setValue(content);
  }, [content]);

  return (
    <Stack>
      <Modal open={isOpen} onClose={handleClose} size="LG">
        <Modal.Header>{title}</Modal.Header>
        <Modal.Body>
          <TextField
            multiline
            autoFocus
            disabled={disabled}
            className="width-100 height-300"
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleInputTab}
            value={value}
          />
        </Modal.Body>
        <Modal.Footer>
          {disabled ? (
            <Button priority="Primary" appearance="Contained" size="LG" onClick={handleConfirm}>
              {t('common.button.confirm')}
            </Button>
          ) : (
            <>
              <Button priority="Primary" appearance="Contained" size="LG" onClick={handleConfirm}>
                {t('common.button.save')}
              </Button>
              <Button priority="Normal" appearance="Outline" size="LG" onClick={handleCancle}>
                {t('common.button.cancel')}
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </Stack>
  );
};

export default CalculationLogicModal;
