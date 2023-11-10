import { createCodeGroup, createCode } from '@/api/CodeAPI';
import { CodeInfo } from '@/models/common/Code';
import { useMutation } from '@tanstack/react-query';

export const useCreateCodeGroup = (createdCodeGroup: CodeInfo) => {
  return useMutation(['/code-group/create', createdCodeGroup], () => createCodeGroup(createdCodeGroup));
};

export const useCreateCode = (groupId: string, createdCode: CodeInfo) => {
  return useMutation(['/code/create', createdCode], () => createCode(groupId, createdCode));
};
