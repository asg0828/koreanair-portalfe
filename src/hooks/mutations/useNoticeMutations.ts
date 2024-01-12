import { createNotice, deleteNotice, updateNotice } from '@/api/NoticeAPI';
import { CreatedNoticeModel, UpdatedNoticeModel } from '@/models/model/NoticeModel';
import { useMutation } from '@tanstack/react-query';

export const useCreateNotice = () => {
  return useMutation((createdNotice: CreatedNoticeModel) => createNotice(createdNotice));
};

export const useUpdateNotice = () => {
  return useMutation((updatedNotice: UpdatedNoticeModel) => updateNotice(updatedNotice.noticeId, updatedNotice));
};

export const useDeleteNotice = (noticeId: string) => {
  return useMutation(() => deleteNotice(noticeId));
};
