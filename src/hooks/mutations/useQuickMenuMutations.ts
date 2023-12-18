import { createQuickMenu, deleteQuickMenu } from '@/api/QuickMenuAPI';
import { QuickMenuModel } from '@/models/model/QuickMenuModel';
import { useMutation } from '@tanstack/react-query';

export const useCreateQuickMenu = () => {
  return useMutation((quickMenu: QuickMenuModel) => createQuickMenu(quickMenu.userId, quickMenu.menuId));
};

export const useDeleteQuickMenu = () => {
  return useMutation((quickMenu: QuickMenuModel) => deleteQuickMenu(quickMenu.userId, quickMenu.menuId));
};
