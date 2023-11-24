import CalculationLogicModal from '@/components/modal/CalculationLogicModal';
import DeptSelectModal from '@/components/modal/DeptSelectModal';
import UserSelectModal from '@/components/modal/UserSelectModal';
import { useAppSelector } from '@/hooks/useRedux';
import { ModalType } from '@/models/common/Constants';
import ConfirmModal from './ConfirmModal';

const ModalContainer = () => {
  const modal = useAppSelector((state) => state.modal);

  if (modal?.type === ModalType.CONFIRM) {
    return <ConfirmModal {...modal} />;
  } else if (modal?.type === ModalType.CALCULATION_LOGIC) {
    return <CalculationLogicModal {...modal} />;
  } else if (modal?.type === ModalType.USER_SELECT) {
    return <UserSelectModal {...modal} />;
  } else if (modal?.type === ModalType.DEPT_SELECT) {
    return <DeptSelectModal {...modal} />;
  }

  return <></>;
};

export default ModalContainer;
