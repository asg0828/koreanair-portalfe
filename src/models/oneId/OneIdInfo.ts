export interface PaxData {
  no: string;
  [oneidNo: string]: string;
  pnrNumber: string;
  uciId: string;
  useYn: string;
  creationDate: string;
  lastUpdateDate: string;
  temporaryOneidNo: string;
  skypassMemberNumber: string;
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
  [mergeTargetOneidNo: string]: string;
  mergeSourceOneidNo: string;
  engLname: string;
  engFname: string;
  korLname: string;
  korFname: string;
  emailAddress: string;
  mobilePhoneNumberInfo: string;
  birthDatev: string;
  creationDate: string;
  lastUpdateDate: string;
  oneidMergeSttsCd: string;
  skypassMemberNumber: string;
}
export interface errorSearch {
  errorNm: string;
  detailErrorNm: string;
  oneidRegisChnlCd: string;
  oneidFinalChgRelateNo: string;
  uciId: string;
  creationStartDate: string;
  creationEndDate: string;
}
export interface ErrLogData {
  no: string;
  errorNm: string;
  errCodeDtl: string;
  oneidRegisChnlCd: string;
  [oneidFinalChgRelateNo: string]: string;
  uciid: string;
  errorContents: string;
  errorActionYn: string;
  creationDate: string;
  lastUpdateDate: string;

  /* 컴럼명 확인 요망 */
  skypassAct: string;
  odsHeader: string;
  odsMGid: string;
}

export interface oneidHistorySearch {
  oneidNum: string;
  oneidChgRsnCd: string;
  criteria: string;
  bfChgKorLname: string;
  bfChgKorFname: string;
  bfChgEngLname: string;
  bfChgEngFname: string;
  bfChgMobilePhoneNoInfo: string;
  bfChgEmailAdrs: string;
  bfChgBirthDtv: string;
  creationStartDate: string;
  creationEndDate: string;
}
export interface oneidMasterSearch {
  oneidNum: string;
  korLname: string;
  korFname: string;
  engLname: string;
  engFname: string;
  mobilePhoneNumberInfo: string;
  homePhoneNumberInfo: string;
  officePhoneNumberInfo: string;
  emailAddress: string;
  birthDatev: string;
}
export interface paxMappingSearch {
  oneidNum: string;
  pnrNumber: string;
  uciId: string;
  creationStartDate: string;
  creationEndDate: string;
}

export interface mobileSearch {
  agtEstimatedMblfonNoInfo: string;
  agtEstMblfonNoInfoHshVlu: string;
}
export interface mobileMasterSearch {
  mobilePhoneNumberInfo: string;
}

export interface relationSearch {
  oneidNum: string;
  creationStartDate: string;
  creationEndDate: string;
}

export interface dailySearch {
  criteria: string;
  aggrStartDate: string;
  aggrEndDate: string;
}
export interface DailyReportData {
  aggrDate: string;
  mergedNonSkypassToNonSkypass: string;
  mergedNonSkypassToSkypass: string;
  mergedSkypassRequest: string;
  mergedSkypassToSkypass: string;
  newOneidAgentMobile: string;
  newOneidPastPnr: string;
  newOneidPotentialConv: string;
  newOneidSkypass: string;
  newOneidTodayPnr: string;
  newOneidTotal: string;
  no: string;
  oneidAlone: string;
  oneidSource: string;
  oneidTarget: string;
  oneidTotal: string;
  pnrNewOneid: string;
  pnrNewPotentialid: string;
  pnrReuseNonSkypass: string;
  pnrReuseSkypass: string;
  pnrSkipped: string;
  pnrTotal: string;
  pnrUci: string;
}
export interface ctiVocSearch {
  searchCri: string;
  startDate: string;
  endDate: string;
}
export interface CtiVocData {}
export interface OneIdSameData {
  no: string;
  oneIdSourceEngFname: string;
  oneIdSourceEngLname: string;
  oneIdSourceSkypassNo: string;
  oneIdTargetEngFname: string;
  oneIdTargetEngLname: string;
  oneIdTargetOneId: string;
  oneIdTargetSkypassNo: string;
  sourcePaxMappingOneIdNo: string;
  sourcePaxMappingPnrNo: string;
  sourcePaxMappingUciIdNo: string;
}

export interface ConversionSearch {}
