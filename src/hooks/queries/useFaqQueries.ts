import { getFaqById, getFaqList } from '@/api/FaqAPI';
import { FaqParams } from '@/models/model/FaqModel';
import { PageModel } from '@/models/model/PageModel';
import { useQuery } from '@tanstack/react-query';

export const useFaqList = (params: FaqParams, page: PageModel, options?: Object) => {
  return useQuery(['/faq/list', options], () => getFaqList(params, page), options);
};

export const useFaqById = (faqId: string, type: string) => {
  return useQuery(['/faq', faqId, type], () => getFaqById(faqId), { enabled: !!faqId, suspense: false });
};
