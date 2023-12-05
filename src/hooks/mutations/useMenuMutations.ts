import { updateAdminMenu, updateUserMenu } from '@/api/MenuAPI';
import { DeletedMenuModel, UpdatedMenuModel } from '@/models/model/MenuModel';
import { useMutation } from '@tanstack/react-query';

export const useUpdateUserMenu = () => {
  return useMutation((changedMenuList: Array<UpdatedMenuModel | DeletedMenuModel>) => updateUserMenu(changedMenuList));
};

export const useUpdateAdminMenu = () => {
  return useMutation((changedMenuList: Array<UpdatedMenuModel | DeletedMenuModel>) => updateAdminMenu(changedMenuList));
};
