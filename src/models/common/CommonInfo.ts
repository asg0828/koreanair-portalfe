export interface HierarchyInfo {
  id: string;
  parentId: string;
  children: Array<HierarchyInfo>;
  [key: string | number]: any;
}

export interface MenuInfo {
  menuNm: string;
  menuUrl: string;
  isCrudPage?: boolean;
}
