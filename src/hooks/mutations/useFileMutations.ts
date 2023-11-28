import { deleteFile, uploadFile } from '@/api/FileAPI';
import { useMutation } from '@tanstack/react-query';

export const useUploadFile = (formData: FormData) => {
  return useMutation(() => uploadFile(formData));
};

export const useDeleteFile = (fileId: string) => {
  return useMutation(() => deleteFile(fileId));
};
