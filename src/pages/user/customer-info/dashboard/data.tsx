import {
  Campaign,
  Column,
  Consulting,
  Etkt,
  EtktList,
  Etl,
  FamilyMembers,
  Profile,
  Skypass,
  Tms,
  Voc,
} from '@/models/model/CustomerInfoModel';

const initProfile : Profile = {
  korFname: '',
  korLname: '',
  engFname: '',
  engLname: '',
  birthDatev: '',
  age: '',
  sexCode: '',
  mobilePhoneNumber: '',
  emailAddress: '',
  oneidNo: '',
  skypassInfos: [],
  holdTktDiscCpnCnt: 0,
  holdTktDiscountPlccCpnCnt: 0,
  holdEcpnCnt: 0,
  intMostSetaType: '',
  hiclsMenuPrefer: '',
  golfTrvlPrspFeatureValue: 0,
  prfrPrspFeatureValue: 0,
  boardCnt: 0,
  talkUseCnt: 0,
  campaignSendCnt: 0,
  vocCnt: 0,
  tmsSendCnt: 0
}

const initSkypass : Skypass = {
  skypassMemberNumber: '',
  memberLevel: '',
  memberStatusNm: '',
  effectiveFrom: '',
  totalAccrued: '',
  totalRedeemed: '',
  remainMileage: '',
  isPlccCard: false,
  expiredMileages: [],
  familyMembers: []
}

const initFamily : FamilyMembers[] = [
  {
    relationship: '',
    familyGroupName: '',
    engFName: '',
    engGName: '',
    korFName: '',
    korGName: '',
    memberStatus: '',
    memberStatusNm: '',
    dateOfBirth: '',
    skypassNumber: '',
    currentMileage: 0,
    createdDate: '',
    memberLevel: '',
    familyGroupCode: ''
  }
]

const initSearchInfoC : any = {
  searchType: '',
  skypassMemberNumber: '',
  mobilePhoneNumber: '',
  korFname: '',
  korLname: '',
  engLname: '',
  engFname: ''
}

const initCampaign : Campaign = {
  oneidNo: '',
  lastCampaignApshSndDtim: '',
  lastCampaignEmailSendDtim: '',
  lastCampaignSmsLmsSndDtim: '',
  lastCmpgnKakaotalkSndDtim: ''
}

const initConsulting : Consulting = {
  lastChatTalkDatev: '',
  lastChatbotTalkDatev: '',
  lastServiceCenterUseDatev: '',
  oneidNo: ''
}

const initTms : Tms = {
  lastTmsAppPushSendDtim: '',
  lastTmsEmailSendDatetime: '',
  lastTmsKakaoTalkSendDtim: '',
  lastTmsSmsSendDatetime: '',
  oneidNo: ''
}

const initVoc : Voc = {
  oneidNo: '',
  vocComplainLastRctDatev: '',
  vocDisruptionLastRctDatev: '',
  vocSuggestLastRctDatev: ''
}

const initEtl : Etl = {
  boarding: '',
  communication: '',
  mytrips: '',
  preference: '',
  wallet: ''
}

const familyColumn : Column[] =[ 
  {headerName: '관계', field: 'relationship'},
  {headerName: '가족성명(한글)', field: 'korFName'},  
  {headerName: '가족성명(영문)', field: 'engFName'},  
  {headerName: '회원상태', field: 'memberStatus'}, 
  {headerName: '생년월일', field: 'dateOfBirth'},
  {headerName: '회원번호', field: 'skypassNumber'},
  {headerName: '회원등급', field: 'memberStatusNm'},
  {headerName: '등록일', field: 'createdDate'},
]

export {
  initProfile,
  initSkypass,
  initFamily,
  familyColumn,
  initSearchInfoC,
  initCampaign,
  initConsulting,
  initTms,
  initVoc,
  initEtl,
};
