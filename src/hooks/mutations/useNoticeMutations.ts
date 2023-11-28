import { createNotice, deleteNotice, updateNotice } from '@/api/NoticeAPI';
import { CreatedNoticeModel, UpdatedNoticeModel } from '@/models/model/NoticeModel';
import { useMutation } from '@tanstack/react-query';

export const useCreateNotice = (createdNotice: CreatedNoticeModel) => {
  return useMutation(() => createNotice(createdNotice));
};

export const useUpdateNotice = (noticeId: string, updatedNotice: UpdatedNoticeModel) => {
  return useMutation(() => updateNotice(noticeId, updatedNotice));
};

export const useDeleteNotice = (noticeId: string) => {
  return useMutation(() => deleteNotice(noticeId));
};
