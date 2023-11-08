import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ModalType, ModalInfo } from '@/models/components/Modal';

const initialState: ModalInfo = {
  type: ModalType.NORMAL,
  isOpen: false,
  autoClose: true,
  title: '',
  content: '',
  onConfirm: undefined,
  onCancle: undefined,
  onClose: undefined,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal(state: ModalInfo, action: PayloadAction<ModalInfo>) {
      return action.payload;
    },
    closeModal(state: ModalInfo) {
      return initialState;
    },
  },
});
export default modalSlice;
