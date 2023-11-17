import { getNoticeById, getNoticeList } from '@/api/NoticeAPI';
import { NoticeParams } from '@/models/model/NoticeModel';
import { PageModel } from '@/models/model/PageModel';
import { useQuery } from '@tanstack/react-query';

export const useNoticeList = (params: NoticeParams, page: PageModel) => {
  return useQuery(['/notice/list'], () => getNoticeList(params, page));
};

export const useNoticeById = (noticeId: string) => {
  return useQuery(['/notice', noticeId], () => getNoticeById(noticeId));
};
