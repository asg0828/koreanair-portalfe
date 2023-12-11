export interface GroupParams {}

export interface EGroupModel extends CreatedEGroupModel {
  groupCode: string;
}

export interface CreatedEGroupModel {
  groupCode: string;
  groupNm: string;
  upGroupCode: string | null;
  upGroupNm?: string;
  userAuthId: string;
  mgrAuthId: string;
  useYn: string;
  ordSeq: number;
  oprtrSe: 'C' | 'U' | 'D';
}

export interface UpdatedEGroupModel extends CreatedEGroupModel {
  groupCode: string;
  children?: Array<any>;
  rownum?: number;
}

export interface DeletedEGroupModel {
  groupCode: string;
}

export interface EGroupUserModel {
  userId: string;
  userNm: string;
  groupCode: string;
  deptCode: string;
  deptNm: string;
}

export interface UpdatedEGroupUserModel {
  groupCode: string;
  userIds: Array<string>;
}
