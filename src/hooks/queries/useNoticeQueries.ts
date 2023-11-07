import { getNoticeById, getNoticeList } from '@/api/NoticeAPI';
import { PageInfo } from '@/models/components/Page';
import { useQuery } from '@tanstack/react-query';

export const useNoticeList = (searchKey: string, searchValue: string, page: PageInfo) => {
  return useQuery(['/notice/list'], () => getNoticeList(searchKey, searchValue, page));
};

export const useNoticeById = (noticeId: string) => {
  return useQuery(['/notice', noticeId], () => getNoticeById(noticeId));
};
