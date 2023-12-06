export interface MenuParams {}

export interface MenuModel extends CreatedMenuModel {
  menuId: string;
}

export interface CreatedMenuModel {
  upMenuId: string | null;
  upMenuNm?: string;
  menuNm: string;
  menuUrl: string;
  menuDsc: string;
  useYn: string;
  ordSeq: number;
  oprtrSe?: 'C' | 'U' | 'D';
}

export interface UpdatedMenuModel extends CreatedMenuModel {
  menuId: string;
}

export interface DeletedMenuModel {
  menuId: string;
}

export interface AuthMenuModel {
  authId: string;
  menuIds: Array<string>;
}
