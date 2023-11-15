import { getQnaById, getQnaList } from '@/api/QnaAPI';
import { PageModel } from '@/models/model/PageModel';
import { useQuery } from '@tanstack/react-query';

export const useQnaList = (searchKey: string, searchValue: string, page: PageModel) => {
  return useQuery(['/qna/list'], () => getQnaList(searchKey, searchValue, page));
};

export const useQnaById = (qnaId: string) => {
  return useQuery(['/qna', qnaId], () => getQnaById(qnaId));
};
