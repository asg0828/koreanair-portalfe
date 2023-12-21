import '@/assets/styles/Board.scss';
import { useAppDispatch } from '@/hooks/useRedux';
import { CheckedState } from '@/models/common/Design';
import { closeModal } from '@/reducers/modalSlice';
import HorizontalTable from '@components/table/HorizontalTable';
import { Button, Checkbox, Modal, Stack, TD, TH, TR, Typography } from '@components/ui';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export interface Props {
  isOpen?: boolean;
  onClose?: (isOpen: boolean) => void;
}

const NoticeModal = ({ isOpen = false, onClose }: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const hasVisited = localStorage.getItem('hasVisited');

  const handleClose = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  const handleConfirm = () => {
    handleClose();
  };

  const handleChecked = (checked: CheckedState) => {
    if (checked) {
      const hasVisited = new Date().setHours(23, 59, 59, 0).toString();
      localStorage.setItem('hasVisited', hasVisited);
      handleClose();
    }
  };

  useEffect(() => {
    if (!hasVisited || hasVisited < new Date().getTime().toString()) {
      handleClose();
    }
  }, [hasVisited, handleClose]);

  return (
    <Modal open={isOpen} onClose={handleClose} size="LG">
      <Modal.Header>{t('board:label.notice')}</Modal.Header>
      <Modal.Body>
        <Stack direction="Vertical" gap="MD" className="height-100 width-100">
          <HorizontalTable className="height-100">
            <TR>
              <TH colSpan={4} className="headerName">
                <Typography variant="h3"></Typography>
              </TH>
            </TR>
            <TR className="height-100">
              <TD colSpan={4} className="content"></TD>
            </TR>
            <TR>
              <TH colSpan={1} className="attachFile">
                {t('board:label.attachedFile')}
              </TH>
              <TD colSpan={3}></TD>
            </TR>
            <TR>
              <TH colSpan={1}>{t('board:label.next')}</TH>
              <TD colSpan={3}></TD>
            </TR>
            <TR>
              <TH colSpan={1}>{t('board:label.prev')}</TH>
              <TD colSpan={3}></TD>
            </TR>
          </HorizontalTable>
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Stack className="width-100">
          <Checkbox label={t('board:label.noView')} onCheckedChange={handleChecked} />
          <Stack justifyContent="End" className="width-100">
            <Button priority="Primary" appearance="Contained" onClick={handleConfirm}>
              {t('common.button.reg')}
            </Button>
          </Stack>
        </Stack>
      </Modal.Footer>
    </Modal>
  );
};

export default NoticeModal;
