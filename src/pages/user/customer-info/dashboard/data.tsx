import {
  AnalysisIndexList,
  AnalysisResultData,
  BoardingList,
  Call,
  Campaign,
  Cnt,
  Column,
  Consulting,
  Email,
  FamilyMembers,
  Preference,
  Profile,
  Skypass,
  SkypassList,
  Sms,
  Sns,
  Tms,
  Voc,
  Wallet,
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

const matchedProfile: any[] = [
  { name: '홍홍동', skypassNm: '11122' },
  { name: '이순신', skypassNm: '33344' },
  { name: 'Jesus', skypassNm: '55566' },
];
const analysisIndexList: AnalysisIndexList[] = [
  {
    name: '잠재상용 추론지수',
    content: '잠재상용 추론지수 상세내용',
  },
  {
    name: '상용가망 추론지수',
    content: '상용가망 추론지수 상세내용',
  },
  {
    name: '골프여행가망 추론지수',
    content: '골프여행가망 추론지수 상세내용',
  },
  {
    name: '구매전환 추론지수',
    content: '구매전환 추론지수 상세내용',
  },
  {
    name: 'PR CLS 선호 추론지수',
    content: 'PR CLS 선호 추론지수 상세내용',
  },
];

const analysisResultData: AnalysisResultData = {
  boarding: '95%',
  customerRating: '4',
  ticketingIndex: '6.13',
};

const pnrTickerColumn: Column[] = [
  { headerName: 'PNR Num', field: 'pnrNumber' },
  { headerName: 'Travel Date', field: 'travelDate' },
  { headerName: 'Route', field: 'route' },
  { headerName: 'Baggage Cnt', field: 'baggageCnt' },
  { headerName: 'Baggage Wgt', field: 'baggageWgt' },
];

const walletData: Wallet = {
  coupon: 5,
  promotion: 'Y',
};
const preferenceData: Preference[] = [
  {
    seat: 'Window',
    meal: '',
  },
  {
    seat: 'Aisle',
    meal: '한식외메뉴',
  },
];

const cntData: Cnt[] = [
  {
    pnr: 3,
    eTkt: 3,
    boarding: 2,
    pet: 1,
    call: 2,
    internet: 2,
    voc: 1,
    sms: 1,
    email: 2,
    sns: 2,
  },
  {
    pnr: 3,
    eTkt: 3,
    boarding: 2,
    pet: 2,
    call: 2,
    internet: 2,
    voc: 1,
    sms: 1,
    email: 2,
    sns: 2,
  },
];

const boardingListData: BoardingList[] = [
  {
    itinerary1: '64G000',
    itinerary2: 'Y',
    itinerary3: 'Gil-Dong Hong',
    itinerary4: 'KE0092',
    itinerary5: '27AUG23',
    ticketNo: '1802414158807',
  },
  {
    itinerary1: '64G000',
    itinerary2: 'Y',
    itinerary3: 'Gil-Dong Hong',
    itinerary4: 'KE0092',
    itinerary5: '27AUG23',
    ticketNo: '1802414158807',
  },
];

const callData: Call[] = [
  {
    date: '27AUG23',
    counselor: '이순신',
    phoneNumber: '010-1234-1234',
    status: '조치완료',
  },
  {
    date: '21AUG23',
    counselor: '이순신',
    phoneNumber: '010-1234-1234',
    status: '조치예정',
  },
];

const smsData: Sms[] = [{ date: '21AUG23', sendCnt: 2, phoneNum: '010-1234-1234', status: '답변대기', content: '' }];

const snsData: Sns[] = [
  { date: '21AUG23', useCnt: 4, counselor: '유관순', channel: '대한항공' },
  { date: '21AUG23', useCnt: 4, counselor: '유관순', channel: 'skyScanner' },
];

const emailData: Email[] = [
  { date: '21AUG23', useCnt: 6, counselor: '안중근', content: '' },
  { date: '21AUG23', useCnt: 6, counselor: '안중근', content: '' },
];
const skyPassList: SkypassList[] = [
  { korName: '김대한', engName: 'Daehan-Kim', sexCode: 'M', birthV: '1999', skypassNo: '123455555522' },
  { korName: '김대한', engName: 'Alex-Kim', sexCode: 'M', birthV: '1985', skypassNo: '113455555533' },
  { korName: '김대한', engName: 'Jennie-Kim', sexCode: 'F', birthV: '1988', skypassNo: '153455555506' },
  { korName: '김대한', engName: 'Daehan-Kim', sexCode: 'M', birthV: '2000', skypassNo: '123455555509' },
  { korName: '김대한', engName: 'Daehan-Kim', sexCode: 'M', birthV: '2002', skypassNo: '123455555522' },
  { korName: '김대한', engName: 'Daehan-Kim', sexCode: 'M', birthV: '1945', skypassNo: '113455555533' },
  { korName: '김대한', engName: 'Daehan-Kim', sexCode: 'F', birthV: '1988', skypassNo: '153455555506' },
  { korName: '김대한', engName: 'Daehan-Kim', sexCode: 'F', birthV: '2000', skypassNo: '123455555509' },
];

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
  analysisIndexList,
  analysisResultData,
  pnrTickerColumn,
  walletData,
  preferenceData,
  cntData,
  snsData,
  emailData,
  boardingListData,
  callData,
  matchedProfile,
  skyPassList,
  initProfile,
  initSkypass,
  initFamily,
  familyColumn,
  initSearchInfoC,
  initCampaign,
  initConsulting,
  initTms,
  initVoc
};
