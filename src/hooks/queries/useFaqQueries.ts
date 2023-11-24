import { getFaqById, getFaqList } from '@/api/FaqAPI';
import { FaqParams } from '@/models/model/FaqModel';
import { PageModel } from '@/models/model/PageModel';
import { useQuery } from '@tanstack/react-query';

export const useFaqList = (params: FaqParams, page: PageModel) => {
  return useQuery(['/faq/list'], () => getFaqList(params, page));
};

export const useFaqById = (faqId: string) => {
  return useQuery(['/faq', faqId], () => getFaqById(faqId), { enabled: false });
};
