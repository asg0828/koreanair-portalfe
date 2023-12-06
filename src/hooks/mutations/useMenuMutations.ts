import { createAdminAuthMenu, createUserAuthMenu, updateAdminMenu, updateUserMenu } from '@/api/MenuAPI';
import { AuthMenuModel, DeletedMenuModel, UpdatedMenuModel } from '@/models/model/MenuModel';
import { useMutation } from '@tanstack/react-query';

export const useUpdateUserMenu = () => {
  return useMutation((changedMenuList: Array<UpdatedMenuModel | DeletedMenuModel>) => updateUserMenu(changedMenuList));
};

export const useUpdateAdminMenu = () => {
  return useMutation((changedMenuList: Array<UpdatedMenuModel | DeletedMenuModel>) => updateAdminMenu(changedMenuList));
};

export const useCreateUserAuthMenu = () => {
  return useMutation((authMenu: AuthMenuModel) => createUserAuthMenu(authMenu.authId, authMenu.menuIds));
};

export const useCreateAdminAuthMenu = () => {
  return useMutation((authMenu: AuthMenuModel) => createAdminAuthMenu(authMenu.authId, authMenu.menuIds));
};
