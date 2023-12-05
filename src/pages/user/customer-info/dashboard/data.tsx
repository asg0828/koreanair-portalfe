import {
  AnalysisIndexList,
  AnalysisResultData,
  CartData,
  Cnt,
  Column,
  ContributeData,
  FamilyMember,
  Ffp,
  HomepageData,
  PnrData,
  Preference,
  Profile,
  Skypass,
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

const pnrData: PnrData[] = [
  {
    pnrNumber: '5HQWPJ',
    travelDate: 'Jan 14, 2023',
    route: 'FUK-ICN',
    baggageCnt: '1',
    baggageWgt: '10',
  },
  {
    pnrNumber: '5HQWPJ',
    travelDate: 'Jan 14, 2023',
    route: 'FUK-ICN',
    baggageCnt: '1',
    baggageWgt: '10',
  },
  {
    pnrNumber: '5HQWPJ',
    travelDate: 'Jan 14, 2023',
    route: 'FUK-ICN',
    baggageCnt: '1',
    baggageWgt: '10',
  },
  {
    pnrNumber: '5HQWPJ',
    travelDate: 'Jan 14, 2023',
    route: 'FUK-ICN',
    baggageCnt: '1',
    baggageWgt: '10',
  },
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
  complimentary: 4,
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

const ffp: Ffp = {
  totalTrip: '19',
  registeredFamily: '2',
  discountCode: '',
  vipGroup: '',
  vipType: '',
  vipStatus: 'Deactivate',
};

const contributeData: ContributeData = {
  totalurchase: '38.3M',
  lastYearcontrb: '',
  domestic: 1,
  international: 3,
};

const homepageData: HomepageData = {
  userId: 'gildong1004',
  lastLoginDt: 'MAY 23, 2023',
  status: 'A',
};

const vocData: VocData[] = [
  {
    vocNo: 'C20190930027',
    status: 'Closed',
    lastUpdDate: 'Oct 2,2019',
    replRqst: 'N',
  },
  {
    vocNo: 'C20190930027',
    status: 'Closed',
    lastUpdDate: 'Oct 2,2019',
    replRqst: 'N',
  },
];

const cartData: CartData[] = [
  {
    route: 'FUK-ICN',
    flightNo: 'TF49W5',
    onewayTrip: 'Y',
    travelDate: 'Oct 2,2019',
  },
  {
    route: 'FUK-ICN',
    flightNo: 'TF49W5',
    onewayTrip: 'Y',
    travelDate: 'Oct 2,2019',
  },
];

export {
  analysisIndexList,
  analysisResultData,
  pnrTickerColumn,
  pnrData,
  profileData,
  skypassData,
  ffp,
  contributeData,
  homepageData,
  vocData,
  cartData,
  familyMemberData,
  walletData,
  preferenceData,
  cntData,
};
