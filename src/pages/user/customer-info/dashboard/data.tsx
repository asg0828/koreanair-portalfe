import {
  AnalysisIndexList,
  AnalysisResultData,
  BoardingList,
  Call,
  CartData,
  Cnt,
  Column,
  ContributeData,
  Email,
  Etkt,
  FamilyMember,
  Ffp,
  HomepageData,
  Internet,
  Pnr,
  PnrData,
  Preference,
  Profile,
  Skypass,
  Sms,
  Sns,
  Voc,
  VocData,
  Wallet,
} from '@/models/model/CustomerInfoModel';

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

const profileData: Profile = {
  name: '홍길동',
  engFname: 'hong',
  engLname: 'gildong',
  birth: '1920-01-01',
  age: '35',
  gender: '남',
  homePhoneNumberInfo: '02-123-4124',
  mobilePhoneNumberInfone: '010-0101-0101',
  emailAddress: 'exemail@kalmate.net',
};
// {
//   name: '이순신',
//   engFname: 'lee',
//   engLname: 'soonshin',
//   birth: '1945-04-28',
//   age: '53',
//   gender: '남',
//   homePhoneNumberInfo: '061-2452-1143',
//   mobilePhoneNumberInfone: '010-2589-1255',
//   emailAddress: 'rjqnrtjs@kalmate.net',
// },
// {
//   name: '유관순',
//   engFname: 'yu',
//   engLname: 'gwansun',
//   birth: '2002-12-06',
//   age: '20',
//   gender: '여',
//   homePhoneNumberInfo: '02-1919-0301',
//   mobilePhoneNumberInfone: '010-2345-8888',
//   emailAddress: 'ehrflqakstp@kalmate.net',
// },
const skypassList: any[] = [];

const skypassData: Skypass[] = [
  {
    skypassNum: '1235213421532',
    skypassGrade: 'GOLD',
    useYn: 'None',
    gradeStartDate: '2000-00-00',
    mileage: '5,555',
    expireMileage: '1,222',
    gradeCondtion: '0',
    upgradeCondition: '000',
  },
  {
    skypassNum: '113416601710',
    skypassGrade: 'SILVER',
    useYn: 'None',
    gradeStartDate: '2000-00-00',
    mileage: '67,321',
    expireMileage: '3,642',
    gradeCondtion: '0',
    upgradeCondition: '000',
  },
  {
    skypassNum: '113327129495',
    skypassGrade: 'BRONZE',
    useYn: 'None',
    gradeStartDate: '2000-00-00',
    mileage: '15,132',
    expireMileage: '800',
    gradeCondtion: '0',
    upgradeCondition: '000',
  },
];
const familyMemberData: FamilyMember = {
  familyCnt: 4,
  mergeMileage: 50000,
  familyList: [
    {
      relationship: 'path1',
      code: '024',
      name: 'SunSin LEE',
    },
    {
      relationship: 'path1',
      code: '024',
      name: 'SunSin LEE',
    },
    {
      relationship: 'path1',
      code: '024',
      name: 'SunSin LEE',
    },
    {
      relationship: 'path1',
      code: '024',
      name: 'SunSin LEE',
    },
    {
      relationship: 'path1',
      code: '024',
      name: 'SunSin LEE',
    },
  ],
};
const walletData: Wallet = {
  coupon: 5,
  promotion: 3,
  complimentary: 2,
};
const preferenceData: Preference = {
  seat: 'Window',
  meal: '한식',
};

const cntData: Cnt = {
  pnr: 2,
  eTkt: 2,
  boarding: 2,
  pet: 2,
  call: 2,
  internet: 2,
  voc: 2,
  sms: 2,
  email: 2,
  sns: 2,
};

const pnrData: Pnr[] = [
  { arrival: 'BOSICN', class: 'HL1', date: '27AUG23', engName: 'Gil-Dong Hong', reservationNum: '64G000', status: 'O' },
  { arrival: 'BOSICN', class: 'HL1', date: '27AUG23', engName: 'Gil-Dong Hong', reservationNum: '64G000', status: 'O' },
  { arrival: 'BOSICN', class: 'HL1', date: '27AUG23', engName: 'Gil-Dong Hong', reservationNum: '64G000', status: 'O' },
];
const eTktData: Etkt[] = [
  { ticketNum: 'KE0092', arrival: 'BOSICN ', date: '27AUG23', status: 'O' },
  { ticketNum: 'KE0092', arrival: 'BOSICN ', date: '27AUG23', status: 'O' },
  { ticketNum: 'KE0092', arrival: 'BOSICN ', date: '27AUG23', status: 'O' },
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

const internetData: Internet[] = [
  {
    date: '21AUG23',
    channel: '대한항공 홈페이지',
    ticketNum: '1802414158807',
    arrival: '푸꾸옥',
  },
  {
    date: '20AUG13',
    channel: '네이버 항공권',
    ticketNum: '1802414158807',
    arrival: '다낭',
  },
];

const vocData: Voc[] = [
  { cnt: 3, date: '21AUG23', channel: '유입채널', type: '타입', content: '' },
  { cnt: 3, date: '21AUG23', channel: '유입채널', type: '타입', content: '' },
];

const smsData: Sms[] = [
  { date: '21AUG23', sendCnt: 2, phoneNum: '010-1234-1234', status: '답변대기', content: '' },
  { date: '21AUG23', sendCnt: 2, phoneNum: '010-1234-1234', status: '답변대기', content: '' },
];

const snsData: Sns[] = [
  { date: '21AUG23', useCnt: 4, counselor: '유관순', channel: '대한항공' },
  { date: '21AUG23', useCnt: 4, counselor: '유관순', channel: 'skyScanner' },
];

const emailData: Email[] = [
  { date: '21AUG23', useCnt: 6, counselor: '안중근', content: '' },
  { date: '21AUG23', useCnt: 6, counselor: '안중근', content: '' },
];
export {
  analysisIndexList,
  analysisResultData,
  pnrTickerColumn,
  profileData,
  skypassData,
  familyMemberData,
  walletData,
  preferenceData,
  cntData,
  pnrData,
  snsData,
  eTktData,
  emailData,
  boardingListData,
  callData,
  internetData,
  vocData,
  smsData,
};
