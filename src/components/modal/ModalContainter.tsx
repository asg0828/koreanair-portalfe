import { ModalType } from '@/models/common/Constants';
import ConfirmModal from './ConfirmModal';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { closeModal } from '@/reducers/modalSlice';

const ModalContainer = () => {
  const dispatch = useAppDispatch();
  const modal = useAppSelector((state) => state.modal);

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  if (modal?.type === ModalType.CONFIRM) {
    return <ConfirmModal {...modal} onClose={handleCloseModal} />;
  }

  return <></>;
};

export default ModalContainer;
