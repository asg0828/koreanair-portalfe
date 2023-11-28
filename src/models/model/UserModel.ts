export interface UserParams {}

export interface UserModel extends CreatedUserModel {
  userId: string;
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
