import { createFaq, deleteFaq, updateFaq } from '@/api/FaqAPI';
import { CreatedFaqModel, UpdatedFaqModel } from '@/models/model/FaqModel';
import { useMutation } from '@tanstack/react-query';

export const useCreateFaq = (createdFaq: CreatedFaqModel) => {
  return useMutation(() => createFaq(createdFaq));
};

export const useUpdateFaq = (faqId: string, updatedFaq: UpdatedFaqModel) => {
  return useMutation(() => updateFaq(faqId, updatedFaq));
};

export const useDeleteFaq = (faqId: string) => {
  return useMutation(() => deleteFaq(faqId));
};
