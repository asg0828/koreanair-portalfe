import { createCodeGroup, createCode } from '@/api/CodeAPI';
import { CodeModel } from '@/models/model/CodeModel';
import { useMutation } from '@tanstack/react-query';

export const useCreateCodeGroup = (createdCodeGroup: CodeModel) => {
  return useMutation(() => createCodeGroup(createdCodeGroup));
};

export const useCreateCode = (groupId: string, createdCode: CodeModel) => {
  return useMutation(() => createCode(groupId, createdCode));
};
