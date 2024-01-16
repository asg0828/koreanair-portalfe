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
  holdTktDiscCpnCnt: number;
  holdTktDiscountPlccCpnCnt: number;
  holdEcpnCnt: number;
  intMostSetaType: string;
  hiclsMenuPrefer: string;
  golfTrvlPrspFeatureValue: number;
  prfrPrspFeatureValue: number;
  boardCnt: number;
  talkUseCnt: number;
  campaignSendCnt: number;
  vocCnt: number;
  tmsSendCnt: number;
  skypassInfos : SkypassInfo[]
}

export interface ProfileList{
  korFname: string;
  korLname: string;
  engFname: string;
  engLname: string;
  membershipLevel: string;
  oneidNo: string;
  sexCode: string;
  skypassMemberNumber :string;
  birthDatev: string;
}
export interface SkypassInfo {
  oneidNo: string;
  skypassMemberNumber: string
}
export interface Skypass {
  skypassMemberNumber: string
  memberLevel: string
  memberStatusNm: string
  effectiveFrom: string
  totalAccrued: string
  totalRedeemed: string
  remainMileage: string
  isPlccCard: boolean
  expiredMileages: ExpiredMileages[]
  familyMembers: FamilyMembers[]
}
export interface ExpiredMileages {
  expiration: string
  accrualMileage: number
  remainMileage: number
  usedMileage: number
  expiredMileage: number
  accrualFrequency: number
}

export interface FamilyMembers {
  relationship: string
  familyGroupName: string
  engFName: string
  engGName: string
  korFName: string
  korGName: string
  memberStatus: string
  memberStatusNm: string
  dateOfBirth: string
  skypassNumber: string
  currentMileage: number
  createdDate: string
  memberLevel: string
  familyGroupCode: string
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
  reservationNumber: string;
  surname: string;
  givenname: string;
  segNumber: string;
  companyIdentification: string;
  productIdentification: string;
  classOfService: string;
  departureDate: string;
  boardPointCityCode: string;
  offPointCityCode: string;
  bookingStatus: string;
}

export interface Etkt {
  ticketNumber: string;
  marketingCompany: string;
  flightNumber: string;
  bookingClass: string;
  departureDate: string;
  cpnNumber: string;
  boardPointLocationId: string;
  offPointLocationId: string;
}

export interface NonMemPnr {
  oneidNo: string;
  ticketNumber: string;
  flightNumber: string;
  bookingClassCode: string;
  bkgDtBsStdDatev: string;
  pnrSegNumber: string;
  segApo: string;
}

export interface NonMemEtkt {
  oneidNo: string;
  pnrNo: string;
  engLname: string;
  engFname: string;
  flightNumber: string;
  bookingClassCode: string;
  bkgDtBsStdDatev: string;
  pnrSegNumber: string;
  segApo: string;
  reservationStatusCode: string;
}

export interface Boarding {
  oneidNo: string;
  localTimeBaseStdDatev: string;
  flightNumber: string;
  segApo: string;
  ticketNumber: string;
  pnrSegNumber: string;
}

export interface Call {
  date: string;
  counselor: string;
  phoneNumber: string;
  status: string;
}

export interface Campaign {
  oneidNo: string;
  lastCampaignApshSndDtim: string;
  lastCampaignEmailSendDtim: string;
  lastCampaignSmsLmsSndDtim: string;
  lastCmpgnKakaotalkSndDtim: string;
}
export interface Consulting {
  lastChatbotTalkDatev: string;
  lastChatTalkDatev: string;
  lastServiceCenterUseDatev: string;
  oneidNo: string;
}

export interface Tms {
  lastTmsAppPushSendDtim: string;
  lastTmsEmailSendDatetime: string;
  lastTmsKakaoTalkSendDtim: string;
  lastTmsSmsSendDatetime: string;
  oneidNo: string;
}
export interface Voc {
  oneidNo: string;
  vocComplainLastRctDatev: string;
  vocDisruptionLastRctDatev: string;
  vocSuggestLastRctDatev: string;
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

export interface Etl {
  boarding: string;
  communication: string;
  mytrips: string;
  preference: string;
  wallet: string;
}