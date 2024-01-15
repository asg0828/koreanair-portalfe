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

export interface OneIdHistoryData {
  birthDatev: string;
  creationDate: string;
  emailAddress: string;
  emailAdrsHashValue: string;
  engFname: string;
  engLname: string;
  engNmSoundexValue: string;
  finalInqDtim: string;
  firstNameK: string;
  lastNameK: string;
  lastUpdateDate: string;
  mobilePhoneNoInfoHashVlu: string;
  mobilePhoneNumberInfo: string;
  multiplePassportYn: string;
  no: string;
  oneidFinalChgChnlCd: string;
  oneidFinalChgRelateNo: string;
  oneidFinalChgUciId: string;
  oneidNo: string;
  oneidRegisChnlCd: string;
  oneidSttsCd: string;
  oneidTypeCd: string;
  sexCode: string;
  sexRegisChnlCd: string;
  homePhoneNoInfoHashValue: string;
  homePhoneNumberInfo: string;
}
export interface MobileData {
  [agtEstMblfonNoInfoHshVlu: string]: string;
  agtEstimatedMblfonNoInfo: string;
  creationDate: string;
  disuseConvsDt: string;
  lastUpdateDate: string;
  no: string;
  useYn: string;
}

export interface MobMasterData {
  no: string;
  [oneidNo: string]: string;
  engFname: string;
  engLname: string;
  korFname: string;
  korLname: string;
  mobilePhoneNumberInfo: string;
  emailAddress: string;
  birthDatev: string;
  sexCode: string;
  agtEstimatedContactTypeCd: string;
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
  pnrNumber: string;
  uciId: string;
  creationStartDate: string;
  creationEndDate: string;
}
export interface ErrLogData {
  no: string;
  errorNm: string;
  detailErrorNm: string;
  oneidRegisChnlCd: string;
  [oneidFinalChgRelateNo: string]: string;
  uciid: string;
  errorContents: string;
  errorActionYn: string;
  creationDate: string;
  lastUpdateDate: string;
  skypassAct: string;
  odsHeader: string;
  odsMGid: string;
}

export interface oneidHistorySearch {
  oneidNo: string;
  criteria: string;
  oneidChgRsnCd: string;
  bfChgKorLname: string;
  bfChgKorFname: string;
  bfChgEngLname: string;
  bfChgEngFname: string;
  bfChgMobilePhoneNoInfo: string;
  bfChgMblfonNoInfoHashVlu: string;
  bfChgEmailAdrs: string;
  bfChgEmailAdrsHashValue: string;
  bfChgBirthDtv: string;
  creationStartDate: string;
  creationEndDate: string;
  skypassMemberNumber: string;
}
export interface oneidMasterSearch {
  oneidNo: string;
  korFname: string;
  korLname: string;
  engFname: string;
  engLname: string;
  mobilePhoneNumberInfo: string;
  mobilePhoneNoInfoHashVlu: string;
  homePhoneNumberInfo: string;
  homePhoneNoInfoHashValue: string;
  officePhoneNumberInfo: string;
  officePhoneNoInfoHashVlu: string;
  emailAddress: string;
  emailAdrsHashValue: string;
  birthDatev: string;
  creationStartDate: string;
  creationEndDate: string;
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
  criteria: string;
  channel: string;
  aggrStartDate: string;
  aggrEndDate: string;
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
  birthDatev: string;
  boardYn: string;
  email: string;
  mobile: string;
  paxEngFirstName: string;
  paxEngLastName: string;
  pnrFqtv: string;
}

export interface ConversionCleansingHashSearch {
  inptPhone?: string;
  inptEmail?: string;
}

export interface ConversionMetaphoneSearch {
  bfConvertDoubleMetaphone: string;
}
