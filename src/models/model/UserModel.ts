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
  userNm: '';
  userEmail: '';
  deptCode: '';
  deptNm: '';
  upDeptCode: '';
  upDeptNm: '';
  groupCode: '';
  companyCode: '';
  lastLogDt: '';
  bfDeptCode: '';
  deptUpdtDt: '';
  bfUpDeptCode: '';
  upDeptUpdtDt: '';
  bfGroupCode: '';
  groupUpdtDt: '';
  useYn: 'Y' | 'N';
  modiSe: 'I' | 'U' | 'D';
  apldUserAuthId: '';
  apldUserAuthNm: '';
  apldMgrAuthId: '';
  apldMgrAuthNm: '';
  bfApldUserAuthId: '';
  bfApldUserAuthNm: '';
  bfApldMgrAuthId: '';
  bfApldMgrAuthNm: '';
  userAuthId: '';
  userAuthNm: '';
  mgrAuthId: '';
  mgrAuthNm: '';
  eUserAuthId: '';
  eUserAuthNm: '';
  eMgrAuthId: '';
  eMgrAuthNm: '';
  bfUserAuthId: '';
  bfUserAuthNm: '';
  bfMgrAuthId: '';
  bfMgrAuthNm: '';
  bfEUserAuthId: '';
  bfEUserAuthNm: '';
  bfEMgrAuthId: '';
  bfEMgrAuthNm: '';
  rgstId: '';
  rgstDt: '';
  modiId: '';
  modiDt: '';
  euserAuthNm: '';
  emgrAuthId: '';
  emgrAuthNm: '';
  euserAuthId: '';
}

export interface UpdatedUserModel extends CreatedUserModel {
  userId: string;
}
