import { createCodeGroup, createCode } from '@/api/CodeAPI';
import { CodeModel } from '@/models/model/CodeModel';
import { useMutation } from '@tanstack/react-query';

export const useCreateCodeGroup = (createdCodeGroup: CodeModel) => {
  return useMutation(['/code-group/create', createdCodeGroup], () => createCodeGroup(createdCodeGroup));
};

export const useCreateCode = (groupId: string, createdCode: CodeModel) => {
  return useMutation(['/code/create', createdCode], () => createCode(groupId, createdCode));
};
