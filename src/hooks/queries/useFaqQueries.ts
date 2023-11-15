import { getFaqById, getFaqList } from '@/api/FaqAPI';
import { PageModel } from '@/models/model/PageModel';
import { useQuery } from '@tanstack/react-query';

export const useFaqList = (searchKey: string, searchValue: string, page: PageModel) => {
  return useQuery(['/faq/list'], () => getFaqList(searchKey, searchValue, page));
};

export const useFaqById = (faqId: string) => {
  return useQuery(['/faq', faqId], () => getFaqById(faqId));
};
