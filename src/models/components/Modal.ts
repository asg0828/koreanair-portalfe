import { ReactNode } from 'react';
import { ModalType } from '@models/common/Constants';

export interface ModalInfo {
  type?: ModalType;
  isOpen?: boolean;
  autoClose?: boolean;
  title: string;
  content: ReactNode;
  onConfirm?: Function;
  onCancle?: Function;
  onClose?: (isOpen: boolean) => void;
  btnType?: string;
}
