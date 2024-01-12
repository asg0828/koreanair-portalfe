import { createFaq, deleteFaq, updateFaq } from '@/api/FaqAPI';
import { CreatedFaqModel, UpdatedFaqModel } from '@/models/model/FaqModel';
import { useMutation } from '@tanstack/react-query';

export const useCreateFaq = () => {
  return useMutation((createdFaq: CreatedFaqModel) => createFaq(createdFaq));
};

export const useUpdateFaq = () => {
  return useMutation((updatedFaq: UpdatedFaqModel) => updateFaq(updatedFaq.faqId, updatedFaq));
};

export const useDeleteFaq = (faqId: string) => {
  return useMutation(() => deleteFaq(faqId));
};
