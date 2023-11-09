import { createQna, deleteQna, updateQna } from '@/api/QnaAPI';
import { CreatedQnaInfo, UpdatedQnaInfo } from '@/models/board/Qna';
import { useMutation } from '@tanstack/react-query';

export const useCreateQna = (createdQna: CreatedQnaInfo) => {
  return useMutation(['/qna/create', createdQna], () => createQna(createdQna));
};

export const useUpdateQna = (qnaId: string, updatedQna: UpdatedQnaInfo) => {
  return useMutation(['/qna/update', updatedQna], () => updateQna(qnaId, updatedQna));
};

export const useDeleteQna = (qnaId: string) => {
  return useMutation(['/qna/delete', qnaId], () => deleteQna(qnaId));
};
