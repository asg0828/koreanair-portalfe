import { ModalInfo } from '@/models/components/Modal';
import { modalSlice } from '@/reducers';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

const useModal = () => {
  const dispatch = useDispatch();

  const openModal = useCallback(
    (props: ModalInfo) => {
      props.isOpen = true;
      dispatch(modalSlice.actions.openModal(props));
    },
    [dispatch]
  );

  const closeModal = useCallback(() => {
    dispatch(modalSlice.actions.closeModal());
  }, [dispatch]);

  return {
    openModal,
    closeModal,
  };
};

export default useModal;
