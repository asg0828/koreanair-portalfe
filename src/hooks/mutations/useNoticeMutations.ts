import { createNotice, deleteNotice, updateNotice } from '@/api/NoticeAPI';
import { CreatedNoticeInfo, UpdatedNoticeInfo } from '@/models/Board/Notice';
import { useMutation } from '@tanstack/react-query';

export const useCreateNotice = (createdNotice: CreatedNoticeInfo) => {
  return useMutation(['/notice/create', createdNotice], () => createNotice(createdNotice));
};

export const useUpdateNotice = (noticeId: string, updatedNotice: UpdatedNoticeInfo) => {
  return useMutation(['/notice/update', updatedNotice], () => updateNotice(noticeId, updatedNotice));
};

export const useDeleteNotice = (noticeId: string) => {
  return useMutation(['/notice/delete', noticeId], () => deleteNotice(noticeId));
};
