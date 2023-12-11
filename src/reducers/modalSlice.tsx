import { ModalType } from '@/models/common/Constants';
import { ModalInfo } from '@/models/components/Modal';
import { createSlice } from '@reduxjs/toolkit';

const initialState: ModalInfo = {
  type: ModalType.NORMAL,
  title: '',
  content: '',
  isOpen: false,
  autoClose: true,
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
