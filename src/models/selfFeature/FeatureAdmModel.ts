import { RowsInfo } from '../components/Table';

export interface CustMetaListSrchInfo {
  [key: string]: string;
  item: string;
  searchWord: string;
  metaTblUseYn: string;
}

export interface CustMetaSrchItem {
  [key: string]: string;
  columnComment: string;
  columnName: string;
}

export interface CustMetaTableData {
  [key: string]: string;
  dataClaCd: string;
  dataSrcDvCd: string;
  dbNm: string;
  frstRegDttm: string;
  frstRegUserId: string;
  keepCylcCd: string;
  lastUpdDttm: string;
  lastUpdUserId: string;
  metaTblDesc: string;
  metaTblDvCd: string;
  metaTblId: string;
  metaTblLogiNm: string;
  metaTblPhysNm: string;
  metaTblUseYn: string;
  rtmTblYn: string;
  topicId: string;
}

export interface CustMetaDetailInfo extends RowsInfo {
  no: string;
  pkYn: string;
  clmnUseYn: string;
  baseTimeYn: string;
  metaTblClmnPhysNm: string;
  metaTblClmnLogiNm: string;
  metaTblClmnDesc: string;
  dtpCd: string;
  no2: string;
  chgDtpCd: string;
  dataFormat: string;
}
