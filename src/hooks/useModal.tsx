import { useDispatch } from 'react-redux';
import { modalSlice } from '@/reducers';
import { ModalInfo } from '@/models/components/Modal';

const useModal = () => {
  const dispatch = useDispatch();

  const openModal = (props: ModalInfo) => {
    props.isOpen = true;
    dispatch(modalSlice.actions.openModal(props));
  };

  const closeModal = () => {
    dispatch(modalSlice.actions.closeModal());
  };

  return {
    openModal,
    closeModal,
  };
};

export default useModal;
