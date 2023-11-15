import { createFaq, deleteFaq, updateFaq } from '@/api/FaqAPI';
import { CreatedFaqModel, UpdatedFaqModel } from '@/models/model/FaqModel';
import { useMutation } from '@tanstack/react-query';

export const useCreateFaq = (createdFaq: CreatedFaqModel) => {
  return useMutation(['/faq/create', createdFaq], () => createFaq(createdFaq));
};

export const useUpdateFaq = (faqId: string, updatedFaq: UpdatedFaqModel) => {
  return useMutation(['/faq/update', updatedFaq], () => updateFaq(faqId, updatedFaq));
};

export const useDeleteFaq = (faqId: string) => {
  return useMutation(['/faq/delete', faqId], () => deleteFaq(faqId));
};
