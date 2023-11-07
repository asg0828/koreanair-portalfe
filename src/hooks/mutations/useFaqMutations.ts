import { createFaq, deleteFaq, updateFaq } from '@/api/FaqAPI';
import { CreatedFaqInfo, UpdatedFaqInfo } from '@/models/Board/Faq';
import { useMutation } from '@tanstack/react-query';

export const useCreateFaq = (createdFaq: CreatedFaqInfo) => {
  return useMutation(['/faq/create', createdFaq], () => createFaq(createdFaq));
};

export const useUpdateFaq = (faqId: string, updatedFaq: UpdatedFaqInfo) => {
  return useMutation(['/faq/update', updatedFaq], () => updateFaq(faqId, updatedFaq));
};

export const useDeleteFaq = (faqId: string) => {
  return useMutation(['/faq/delete', faqId], () => deleteFaq(faqId));
};
