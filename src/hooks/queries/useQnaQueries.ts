import { getQnaById, getQnaList } from '@/api/QnaAPI';
import { PageModel } from '@/models/model/PageModel';
import { QnaParams } from '@/models/model/QnaModel';
import { useQuery } from '@tanstack/react-query';

export const useQnaList = (params: QnaParams, page: PageModel, options?: Object) => {
  return useQuery(['/qna/list'], () => getQnaList(params, page), options);
};

export const useQnaById = (qnaId: string) => {
  return useQuery(['/qna', qnaId], () => getQnaById(qnaId));
};
