import { deleteFile, uploadFile } from '@/api/FileAPI';
import { useMutation } from '@tanstack/react-query';

export const useUploadFile = (formData: FormData) => {
  return useMutation(['/file/upload', formData], () => uploadFile(formData));
};

export const useDeleteFile = (fileId: string) => {
  return useMutation(['/file/delete', fileId], () => deleteFile(fileId));
};
