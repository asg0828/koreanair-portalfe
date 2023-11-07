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

export interface oneIdHistorySearch {
  oneIdNum: string;
  oneIdChgReason: string;
  searchCri: string;
  firstNameK: string;
  lastNameK: string;
  firstNameE: string;
  lastNameE: string;
  phoneNum: string;
  telephoneNum: string;
  eMailAdd: string;
  birth: string;
  startDate: string;
  endDate: string;
}

export interface paxMappingSearch {
  oneIdNum: string;
  pnrNum: string;
  uciid: string;
  startDate: string;
  endDate: string;
}

export interface mobileSearch {
  oneIdNum: string;
  pnrNum: string;
}

export interface relationSearch {
  oneIdNum: string;
  startDate: string;
  endDate: string;
}

export interface dailySearch {
  oneIdNum: string;
  searchCri: string;
  oneIdChgReason: string;
}

export interface ctiVocSearch {
  searchCri: string;
  startDate: string;
  endDate: string;
}
