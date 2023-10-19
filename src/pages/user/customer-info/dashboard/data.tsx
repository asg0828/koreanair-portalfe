import {
  AnalysisIndexList,
  AnalysisResultData,
  CartData,
  ContributeData,
  Ffp,
  HomepageData,
  Mileage,
  PnrData,
  PnrTickerColumn,
  Profile,
  VocData,
} from '@/models/customer-info/CustomerInfo';

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

const pnrTickerColumn: PnrTickerColumn[] = [
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

const profile: Profile = {
  gender: 'M',
  nationality: 'KOR',
  dob: '1990-01-01',
  age: '33',
  skypassNo: '113317438600',
  oneIdNo: 'S199704290885152',
};

const ffp: Ffp = {
  totalTrip: '19',
  registeredFamily: '2',
  discountCode: '',
  vipGroup: '',
  vipType: '',
  vipStatus: 'Deactivate',
};

const mileage: Mileage = {
  accural: '242653',
  use: '222222',
  available: '13300',
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
  profile,
  ffp,
  mileage,
  contributeData,
  homepageData,
  vocData,
  cartData,
};
