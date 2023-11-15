import { getNoticeById, getNoticeList } from '@/api/NoticeAPI';
import { PageModel } from '@/models/model/PageModel';
import { useQuery } from '@tanstack/react-query';

export const useNoticeList = (searchKey: string, searchValue: string, page: PageModel) => {
  return useQuery(['/notice/list'], () => getNoticeList(searchKey, searchValue, page));
};

export const useNoticeById = (noticeId: string) => {
  return useQuery(['/notice', noticeId], () => getNoticeById(noticeId));
};
