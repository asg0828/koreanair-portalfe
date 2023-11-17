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
}

export interface ColumnChild {
  headerName: string;
  field: string;
  colSpan?: number;
  align?: Align;
  length?: string | number | undefined;
  childName?: ColumnChild[];
}

export interface Profile {
  gender: string;
  nationality: string;
  dob: string;
  age: string;
  [skypassNo: string]: string;
  oneIdNo: string;
}

export interface Ffp {
  [totalTrip: string]: string;
  registeredFamily: string;
  discountCode: string;
  vipGroup: string;
  vipType: string;
  vipStatus: string;
}

export interface Mileage {
  [accural: string]: string;
  use: string;
  available: string;
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
