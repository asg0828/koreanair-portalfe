import { getFaqById, getFaqList } from '@/api/FaqAPI';
import { PageInfo } from '@/models/components/Page';
import { useQuery } from '@tanstack/react-query';

export const useFaqList = (searchKey: string, searchValue: string, page: PageInfo) => {
  return useQuery(['/faq/list'], () => getFaqList(searchKey, searchValue, page));
};

export const useFaqById = (faqId: string) => {
  return useQuery(['/faq', faqId], () => getFaqById(faqId));
};
