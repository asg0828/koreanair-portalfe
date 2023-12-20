import { Column } from '@/models/model/CustomerInfoModel';
import { CustMetaSrchItem, CustMetaListSrchInfo, TbCoMetaTbInfo } from '@/models/selfFeature/FeatureAdmModel';

// Customer Meta List 테이블 헤더
export const metaTableColumn: Column[] = [
  { headerName: 'DB명', field: 'dbNm', colSpan: 3 },
  { headerName: '테이블 논리명', field: 'metaTblLogiNm', colSpan: 4 },
  { headerName: '테이블 물리명', field: 'metaTblPhysNm', colSpan: 4 },
  { headerName: '테이블 설명', field: 'metaTblDesc', colSpan: 6 },
  { headerName: '메타 구분', field: 'metaTblDvCd', colSpan: 0.9 },
  { headerName: '등록자', field: 'frstRegUserId', colSpan: 2 },
  { headerName: '등록일시', field: 'frstRegDttm', colSpan: 3 },
  { headerName: '사용 여부', field: 'metaTblUseYn', colSpan: 0.7 },
];

export const initCustMetaListSrchInfo: CustMetaListSrchInfo = {
  item: '',
  searchWord: '',
  metaTblUseYn: '',
};

export const initCustMetaSrchItem: CustMetaSrchItem = {
  columnComment: '전체',
  columnName: '',
};

export const customerMetaInfoColumn: Column[] = [
  { headerName: '번호', field: 'no', colSpan: 0.5 },
  { headerName: 'Key 여부', field: 'pkYn', colSpan: 0.5 },
  { headerName: '사용 여부', field: 'clmnUseYn', colSpan: 0.5 },
  { headerName: '수집기준 시간', field: 'baseTimeYn', colSpan: 0.5 },
  { headerName: '컬럼명', field: 'metaTblClmnPhysNm', colSpan: 2 },
  { headerName: '컬럼 논리명', field: 'metaTblClmnLogiNm', colSpan: 2 },
  { headerName: '컬럼 설명', field: 'metaTblClmnDesc', colSpan: 2 },
  { headerName: '데이터타입', field: 'dtpCd', colSpan: 1 },
  { headerName: '변경여부', field: 'changeYn', colSpan: 0.8 }, // 수정 요망
  { headerName: '변경 데이터타입', field: 'chgDtpCd', colSpan: 1.2 },
  { headerName: '변경 데이터형식', field: 'dataFormat', colSpan: 1 },
];

export const customerMetaTableColumn: Column[] = [
  { headerName: 'Key 여부', field: 'pkYn', colSpan: 0.5 },
  { headerName: '사용 여부', field: 'clmnUseYn', colSpan: 0.5 },
  { headerName: '수집기준 시간', field: 'baseTimeYn', colSpan: 0.5 },
  { headerName: '컬럼명', field: 'metaTblClmnPhysNm', colSpan: 2 },
  { headerName: '컬럼 논리명', field: 'metaTblClmnLogiNm', colSpan: 2 },
  { headerName: '컬럼 설명', field: 'metaTblClmnDesc', colSpan: 2 },
  { headerName: '데이터타입', field: 'dtpCd', colSpan: 1.3 },
  { headerName: '변경여부', field: 'changeYn', colSpan: 1 }, // 수정 요망
  { headerName: '변경 데이터타입', field: 'chgDtpCd', colSpan: 1.1 },
  { headerName: '변경 데이터형식', field: 'dataFormat', colSpan: 1.1 },
];
export const customerMetaRegColumn: Column[] = [
  { headerName: 'Key 여부', field: 'pkYn', colSpan: 0.5 },
  { headerName: '사용 여부', field: 'clmnUseYn', colSpan: 0.5 },
  { headerName: '수집기준 시간', field: 'baseTimeYn', colSpan: 0.5 },
  { headerName: '컬럼명', field: 'metaTblClmnPhysNm', colSpan: 2 },
];
export const initTbCoMetaTblInfo: TbCoMetaTbInfo = {
  dataClaCd: '',
  dataSrcDvCd: '',
  dbNm: '',
  frstRegDttm: '',
  frstRegUserId: '',
  keepCylcCd: '',
  lastUpdDttm: '',
  lastUpdUserId: '',
  metaTblDesc: '',
  metaTblDvCd: '',
  metaTblId: '',
  metaTblLogiNm: '',
  metaTblPhysNm: '',
  metaTblUseYn: '',
  rtmTblYn: '',
  topicId: '',
};
