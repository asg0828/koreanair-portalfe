import {
  createAdminAuth,
  createUserAuth,
  deleteAdminAuth,
  deleteUserAuth,
  updateAdminAuth,
  updateUserAuth,
} from '@/api/AuthAPI';
import { CreatedAuthModel, UpdatedAuthModel } from '@/models/model/AuthModel';
import { useMutation } from '@tanstack/react-query';

export const useCreateUserAuth = () => {
  return useMutation((createdAuth: CreatedAuthModel) => createUserAuth(createdAuth));
};

export const useUpdateUserAuth = () => {
  return useMutation((updatedAuth: UpdatedAuthModel) => updateUserAuth(updatedAuth.authId, updatedAuth));
};

export const useDeleteUserAuth = () => {
  return useMutation((authId: string) => deleteUserAuth(authId));
};

export const useCreateAdminAuth = () => {
  return useMutation((createdAuth: CreatedAuthModel) => createAdminAuth(createdAuth));
};

export const useUpdateAdminAuth = () => {
  return useMutation((updatedAuth: UpdatedAuthModel) => updateAdminAuth(updatedAuth.authId, updatedAuth));
};

export const useDeleteAdminAuth = () => {
  return useMutation((authId: string) => deleteAdminAuth(authId));
};
