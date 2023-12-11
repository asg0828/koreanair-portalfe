import { createAdminAuthMenu, createUserAuthMenu, updateAdminMenu, updateUserMenu } from '@/api/MenuAPI';
import { AuthMenuModel, DeletedMenuModel, UpdatedMenuModel } from '@/models/model/MenuModel';
import { useMutation } from '@tanstack/react-query';

export const useUpdateUserMenu = () => {
  return useMutation((updatedMenuList: Array<UpdatedMenuModel | DeletedMenuModel>) => updateUserMenu(updatedMenuList));
};

export const useUpdateAdminMenu = () => {
  return useMutation((updatedMenuList: Array<UpdatedMenuModel | DeletedMenuModel>) => updateAdminMenu(updatedMenuList));
};

export const useCreateUserAuthMenu = () => {
  return useMutation((authMenu: AuthMenuModel) => createUserAuthMenu(authMenu.authId, authMenu.menuIds));
};

export const useCreateAdminAuthMenu = () => {
  return useMutation((authMenu: AuthMenuModel) => createAdminAuthMenu(authMenu.authId, authMenu.menuIds));
};
