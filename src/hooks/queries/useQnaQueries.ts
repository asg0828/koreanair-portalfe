import { getQnaById, getQnaList } from '@/api/QnaAPI';
import { PageInfo } from '@/models/components/Page';
import { useQuery } from '@tanstack/react-query';

export const useQnaList = (searchKey: string, searchValue: string, page: PageInfo) => {
  return useQuery(['/qna/list'], () => getQnaList(searchKey, searchValue, page));
};

export const useQnaById = (qnaId: string) => {
  return useQuery(['/qna', qnaId], () => getQnaById(qnaId));
};
