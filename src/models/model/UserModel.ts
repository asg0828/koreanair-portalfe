export interface UserParams {
  userNm: string;
  deptNm: string;
  userAuthId: string;
  mgrAuthId: string;
  useYn: string;
}

export interface UserModel extends CreatedUserModel {
  rownum: number;
  userId: string;
  useYnNm: string;
  companyNm: string;
}

export interface CreatedUserModel {
  userNm: string;
  userEmail: string;
  deptCode: string;
  deptNm: string;
  upDeptCode: string;
  upDeptNm: string;
  groupCode: string;
  groupNm: string;
  companyCode: string;
  lastLogDt: string;
  bfDeptCode: string;
  deptUpdtDt: string;
  bfUpDeptCode: string;
  upDeptUpdtDt: string;
  bfGroupCode: string;
  groupUpdtDt: string;
  useYn: 'Y' | 'N';
  modiSe: 'I' | 'U' | 'D';
  apldUserAuthId: string;
  apldUserAuthNm: string;
  apldMgrAuthId: string;
  apldMgrAuthNm: string;
  bfApldUserAuthId: string;
  bfApldUserAuthNm: string;
  bfApldMgrAuthId: string;
  bfApldMgrAuthNm: string;
  userAuthId: string;
  userAuthNm: string;
  mgrAuthId: string;
  mgrAuthNm: string;
  eUserAuthId: string;
  eUserAuthNm: string;
  eMgrAuthId: string;
  eMgrAuthNm: string;
  bfUserAuthId: string;
  bfUserAuthNm: string;
  bfMgrAuthId: string;
  bfMgrAuthNm: string;
  bfEUserAuthId: string;
  bfEUserAuthNm: string;
  bfEMgrAuthId: string;
  bfEMgrAuthNm: string;
  rgstId: string;
  rgstDt: string;
  modiId: string;
  modiDt: string;
  euserAuthNm: string;
  emgrAuthId: string;
  emgrAuthNm: string;
  euserAuthId: string;
}

export interface UpdatedUserModel extends CreatedUserModel {
  userId: string;
}
