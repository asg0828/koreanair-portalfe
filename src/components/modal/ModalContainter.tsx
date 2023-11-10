import { ModalType } from '@/models/common/Constants';
import { modalSlice, ReducerType } from '@reducers';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmModal from './ConfirmModal';

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
