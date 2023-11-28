import { createUser, deleteUser, updateUser } from '@/api/UserAPI';
import { CreatedUserModel, UpdatedUserModel } from '@/models/model/UserModel';
import { useMutation } from '@tanstack/react-query';

export const useCreateUser = (createdUser: CreatedUserModel) => {
  return useMutation(['/user/create', createdUser], () => createUser(createdUser));
};

export const useUpdateUser = (userId: string, updatedUser: UpdatedUserModel) => {
  return useMutation(['/user/update', updatedUser], () => updateUser(userId, updatedUser));
};

export const useDeleteUser = (userId: string) => {
  return useMutation(['/user/delete', userId], () => deleteUser(userId));
};
