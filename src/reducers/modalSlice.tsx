import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ModalInfo } from '@/models/components/Modal';
import { ModalType } from '@/models/common/Constants';

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
      state = action.payload;
      return state;
    },
    closeModal(state: ModalInfo) {
      return initialState;
    },
  },
});

export default modalSlice;
