import { Column } from '@/models/customer-info/CustomerInfo';
import { CustMetaSrchItem, CustMetaListSrchInfo } from '@/models/selfFeature/FeatureAdmModel';

// Customer Meta List 테이블 헤더
export const metaTableColumn: Column[] = [
  { headerName: 'DB명', field: 'dbNm', colSpan: 2 },
  { headerName: '테이블 논리명', field: 'metaTblLogiNm', colSpan: 4 },
  { headerName: '테이블 물리명', field: 'metaTblPhysNm', colSpan: 4 },
  { headerName: '테이블 설명', field: 'metaTblDesc', colSpan: 6 },
  { headerName: '메타 구분', field: 'metaTblDvCd', colSpan: 0.7 },
  { headerName: '등록자', field: 'frstRegUserId', colSpan: 2 },
  { headerName: '등록일시', field: 'frstRegDttm', colSpan: 3 },
  { headerName: '사용여부', field: 'metaTblUseYn', colSpan: 0.5 },
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
  { headerName: '번호', field: 'no' },
  { headerName: 'Key여부', field: 'pkYn' },
  { headerName: '사용여부', field: 'clmnUseYn' },
  { headerName: '수집기준시간', field: 'baseTimeYn' },
  { headerName: '컬럼명', field: 'metaTblClmnPhysNm' },
  { headerName: '컬럼 논리명', field: 'metaTblClmnLogiNm' },
  { headerName: '컬럼 설명', field: 'metaTblClmnDesc' },
  { headerName: '데이터타입', field: 'dtpCd' },
  { headerName: '변경여부', field: 'no' },
  { headerName: '변경 데이터타입', field: 'chgDtpCd' },
  { headerName: '변경 데이터형식', field: 'dataFormat' },
];
