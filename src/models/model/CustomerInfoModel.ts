import { Align } from '../common/Design';
import { RowsInfo } from '../components/Table';

export interface AnalysisIndexList {
  name: string;
  content: string;
}

export interface AnalysisResultData {
  boarding: string;
  customerRating: string;
  ticketingIndex: string;
}

export interface PnrData {
  [pnrNumber: string]: string;
  travelDate: string;
  route: string;
  baggageCnt: string;
  baggageWgt: string;
}
export interface Column {
  headerName: string;
  field: string;
  colSpan?: number;
}

export interface ColumnChild {
  headerName: string;
  field: string;
  colSpan?: number;
  rowSpan?: number;
  align?: Align;
  length?: string | number | undefined;
  childName?: ColumnChild[];
}

export interface Profile {
  korFname: string;
  korLname: string;
  engFname: string;
  engLname: string;
  birthDatev: string;
  age: string;
  sexCode: string;
  mobilePhoneNumber: string;
  emailAddress: string;
  oneidNo: string;
  skypassInfos : SkypassInfo[]
}

export interface SkypassInfo {
  oneidNo: string;
  skypassMemberNumber: string
}
export interface Skypass {
  [skypassNum: string]: string;
  skypassGrade: string;
  useYn: string;
  gradeStartDate: string;
  mileage: string;
  expireMileage: string;
  gradeCondtion: string;
  upgradeCondition: string;
}

export interface FamilyMember {
  familyCnt: number;
  mergeMileage: number;
  familyList: FamilyList[];
}
export interface FamilyList {
  relationship: string;
  code: string;
  name: string;
}

export interface Wallet {
  coupon: number;
  promotion: string;
}

export interface Preference {
  seat: string;
  meal: string;
}

export interface Cnt {
  pnr: number;
  eTkt: number;
  boarding: number;
  pet: number;
  call: number;
  internet: number;
  voc: number;
  sms: number;
  email: number;
  sns: number;
}
export interface Pnr {
  reservationNum: string;
  engName: string;
  class: string;
  arrival: string;
  date: string;
  status: string;
}

export interface Etkt {
  ticketNum: string;
  arrival: string;
  date: string;
  status: string;
}

export interface BoardingList {
  itinerary1: string;
  itinerary2: string;
  itinerary3: string;
  itinerary4: string;
  itinerary5: string;
  ticketNo: string;
}

export interface Call {
  date: string;
  counselor: string;
  phoneNumber: string;
  status: string;
}

export interface Internet {
  date: string;
  channel: string;
  ticketNum: string;
  arrival: string;
}

export interface Voc {
  cnt: number;
  date: string;
  channel: string;
  type: string;
  content: string;
}

export interface Sms {
  date: string;
  sendCnt: number;
  phoneNum: string;
  status: string;
  content: string;
}

export interface Sns {
  date: string;
  useCnt: number;
  counselor: string;
  channel: string;
}

export interface Email {
  date: string;
  useCnt: number;
  counselor: string;
  content: string;
}

export interface Ffp {
  [totalTrip: string]: string;
  registeredFamily: string;
  discountCode: string;
  vipGroup: string;
  vipType: string;
  vipStatus: string;
}

export interface ContributeData extends RowsInfo {
  totalurchase: string;
  lastYearcontrb: string;
  domestic: number;
  international: number;
}

export interface HomepageData {
  userId: string;
  lastLoginDt: string;
  status: string;
}

export interface VocData {
  vocNo: string;
  status: string;
  lastUpdDate: string;
  replRqst: string;
}

export interface CartData {
  route: string;
  flightNo: string;
  onewayTrip: string;
  travelDate: string;
}

export interface SkypassList {
  korName: string;
  engName: string;
  sexCode: string;
  birthV: string;
  skypassNo: string;
}
