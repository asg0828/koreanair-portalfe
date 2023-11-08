import { useSelector } from 'react-redux';
import { ReducerType } from '@reducers';
import { ModalType } from '@/models/components/Modal';
import ConfirmModal from './ConfirmModal';
import { useDispatch } from 'react-redux';
import { modalSlice } from '@/reducers';
import { ModalInfo } from '@/models/components/Modal';

const ModalContainer = () => {
  const dispatch = useDispatch();
  const modal = useSelector((state: ReducerType) => state.modal);

  const closeModal = () => {
    dispatch(modalSlice.actions.closeModal());
  };

  if (modal?.type === ModalType.CONFIRM) {
    return <ConfirmModal {...modal} onClose={closeModal} />;
  }

  return <></>;
};

export default ModalContainer;
