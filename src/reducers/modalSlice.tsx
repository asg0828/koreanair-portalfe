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
    openModal(state: ModalInfo, action) {
      state = action.payload;
      state.isOpen = true;
      return state;
    },
    closeModal(state: ModalInfo) {
      return initialState;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
