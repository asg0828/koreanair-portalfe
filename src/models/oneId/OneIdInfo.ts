export interface PaxData {
  no: string;
  [oneIdNm: string]: string;
  pnrNm: string;
  uciid: string;
  potentialId: string;
  useYn: string;
  skypassNm: string;
  createDate: string;
  updateDate: string;
}

export interface MobileData {
  no: string;
  presumeNum: string;
  [presumeNumHash: string]: string;
  useYn: string;
}

export interface MobMasterData {
  no: string;
  [oneId: string]: string;
  firstNameE: string;
  lastNameE: string;
  phoneNum: string;
  eMailAdr: string;
  birth: string;
  firstNameK: string;
  lastNameK: string;
  gender: string;
  presumeCode: string;
}

export interface RelationData {
  no: string;
  [targetOneId: string]: string;
  sourceOneId: string;
  firstNameE: string;
  lastNameE: string;
  firstNameK: string;
  lastNameK: string;
  eMailAdr: string;
  phoneNum: string;
  birth: string;
  createDate: string;
  updateDate: string;
}

export interface ErrLogData {
  no: string;
  errCode: string;
  errCodeDtl: string;
  oneIdChCode: string;
  [pnrSkypass: string]: string;
  skypassAct: string;
  odsHeader: string;
  odsMGid: string;
  uciid: string;
  detailLog: string;
  processYn: string;
  createDate: string;
  updateDate: string;
}
