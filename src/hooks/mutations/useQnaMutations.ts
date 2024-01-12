import { createQna, deleteQna, updateQna } from '@/api/QnaAPI';
import { CreatedQnaModel, UpdatedQnaModel } from '@/models/model/QnaModel';
import { useMutation } from '@tanstack/react-query';

export const useCreateQna = () => {
  return useMutation((createdQna: CreatedQnaModel) => createQna(createdQna));
};

export const useUpdateQna = () => {
  return useMutation((updatedQna: UpdatedQnaModel) => updateQna(updatedQna.qnaId, updatedQna));
};

export const useDeleteQna = (qnaId: string) => {
  return useMutation(() => deleteQna(qnaId));
};
