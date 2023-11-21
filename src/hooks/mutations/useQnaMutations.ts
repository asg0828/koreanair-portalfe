import { createQna, deleteQna, updateQna } from '@/api/QnaAPI';
import { CreatedQnaModel, UpdatedQnaModel } from '@/models/model/QnaModel';
import { useMutation } from '@tanstack/react-query';

export const useCreateQna = (createdQna: CreatedQnaModel) => {
  return useMutation(['/qna/create', createdQna], () => createQna(createdQna));
};

export const useUpdateQna = (qnaId: string, updatedQna: UpdatedQnaModel) => {
  return useMutation(['/qna/update', updatedQna], () => updateQna(qnaId, updatedQna));
};

export const useDeleteQna = (qnaId: string) => {
  return useMutation(['/qna/delete', qnaId], () => deleteQna(qnaId));
};
