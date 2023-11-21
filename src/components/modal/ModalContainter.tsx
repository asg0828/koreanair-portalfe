import CalculationLogicModal from '@/components/modal/CalculationLogicModal';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { ModalType } from '@/models/common/Constants';
import { closeModal } from '@/reducers/modalSlice';
import ConfirmModal from './ConfirmModal';

const ModalContainer = () => {
  const dispatch = useAppDispatch();
  const modal = useAppSelector((state) => state.modal);

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  if (modal?.type === ModalType.CONFIRM) {
    return <ConfirmModal {...modal} onClose={handleCloseModal} />;
  } else if (modal?.type === ModalType.CALCULATION_LOGIC) {
    return <CalculationLogicModal {...modal} onClose={handleCloseModal} />;
  }

  return <></>;
};

export default ModalContainer;
