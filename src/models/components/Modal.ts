import { ReactNode } from 'react';

export enum ModalType {
  NORMAL = 'NORMAL',
  CONFIRM = 'CONFIRM',
  NOTICE = 'NOTICE',
}

export interface ModalInfo {
  type?: ModalType;
  isOpen?: boolean;
  autoClose?: boolean;
  title: string;
  content: ReactNode;
  onConfirm?: Function;
  onCancle?: Function;
  onClose?: (isOpen: boolean) => void;
  btnType?: string
}
