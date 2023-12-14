import { RowsInfo } from '../components/Table';

export enum MetaType {
  MSTR_SGMT = 'mastersegment',
}

// Master Profile 속성/행동 정보 component props
export interface AttrBehvMstrProfInfoProps {
  editMode: Boolean;
  hasItem?: Boolean;
  targetIndex?: number;
  rslnRuleKeyPrtyList: Array<TbRsRslnRuleKeyPrty>;
  metaTblInfo: TbRsMstrSgmtRuleAttrTbl;
  metaTblAllList: Array<TbCoMetaTbInfo>;
  metaTblColList: Array<TbRsMstrSgmtRuleAttrClmn>;
  mstrSgmtRuleAttrTblList?: Array<TbRsMstrSgmtRuleAttrTbl>;
  setMstrSgmtRuleAttrTblList?: React.Dispatch<React.SetStateAction<Array<TbRsMstrSgmtRuleAttrTbl>>>;
  setMstrSgmtRuleAttrClmnList?: React.Dispatch<React.SetStateAction<Array<TbRsMstrSgmtRuleAttrClmn>>>;
  focusTarget?: any;
}
// Master Profile 속성, 행동 컬럼 정보 component props
export interface MstrProfMetaTblColumnListProps {
  editMode: Boolean;
  divisionType: string;
  targetIndex?: number;
  metaTblInfo?: TbRsMstrSgmtRuleAttrTbl;
  metaTblClmnList: Array<TbCoMetaTblClmnInfo>;
  metaTblClmnAllList: Array<TbCoMetaTblClmnInfo>;
  setMstrSgmtRuleAttrTblList?: React.Dispatch<React.SetStateAction<Array<TbRsMstrSgmtRuleAttrTbl>>>;
  setMstrSgmtRuleAttrClmnList?: React.Dispatch<React.SetStateAction<Array<TbRsMstrSgmtRuleAttrClmn>>>;
}

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
  no2: string; // 수정 요망 : 변경여부컬럼 명을 모르겠음
  chgDtpCd: string;
  dataFormat: string;
}

export interface TbCoMetaTbInfo extends RowsInfo {
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
// Master Profile 검색 조건 Props
export interface MstrProfSearchInfoProps {
  [key: string]: string;
  useYn: string;
  rtmYn: string;
}
// 메타테이블 전체조회 테이블 선택 콤보박스 조회 Props
export interface MetaInfoSearchProps {
  [key: string]: string;
  type: string;
  rslnRuleId: string;
}
// 선택된 메타테이블 id 값으로 메타컬럼테이블조회 meta_tbl_id 에 따라 조회 Props
export interface MetaColumnIsResolutionInfoSearchProps {
  [key: string]: string;
  isResolution: string;
  joinKeyYn: string;
}
// Master Profile Info Model
export interface TbRsMstrSgmtRule extends RowsInfo {
  [key: string]: string;
  rslnRuleId: string; //레졸루션 룰 ID,
  rslnRuleNm: string;
  mstrSgmtRuleId: string;
  mstrSgmtRuleNm: string; //마스터세그먼트 명,
  mstrSgmtRuleDesc: string; //마스터세그먼트 설명,
  mstrSgmtRuleRtmYn: string; //master profile룰 실시간여부,
  mstrSgmtRuleUseYn: string; //사용여부: default = Y
  frstRegDttm: string;
  frstRegUserId: string;
  lastUpdDttm: string;
  lastUpdUserId: string;
  schdActvYn: string;
}
export interface TbRsMstrSgmtRuleAttrClmn {
  [key: string]: string | number;
  mstrSgmtRuleId: string;
  mstrSgmtRuleTblId: string; // /api/v1/meta/info > metaTblId,
  mstrSgmtRuleClmnId: string; // /api/v1/meta/column/{metaTblId} > metaTblClmnId,
  mstrSgmtRuleTblNm: string; // /api/v1/meta/info > metaTblPhysNm,
  mstrSgmtRuleClmnNm: string; // /api/v1/meta/column/{metaTblId} > metaTblClmnPhysNm,
  mstrSgmtRuleClmnDesc: string; // /api/v1/meta/column/{metaTblId} > metaTblClmnDesc,
  clmnDtpCd: string; // /api/v1/meta/column/{metaTblId} > dtpCd,
  clmnSortOrd: number; // 0,
  profilTagYn: string; // 프로필 태그 여부,
  clmnStacCrteYn: string; // 컬럼 통계정보 생성여부,
  sgmtDvCd: string; // string,
  baseTimeYn: string; // string
}
export interface TbRsMstrSgmtRuleAttrTbl {
  [key: string]: string;
  mstrSgmtRuleId: string;
  mstrSgmtRuleTblId: string; ///api/v1/meta/info > metaTblId,
  mstrSgmtRuleTblNm: string; ///api/v1/meta/info > metaTblPhysNm,
  sgmtDvCd: string; //속성 : ATTR, 행동 : BEHV,
  mstrJoinKeyClmnNm: string; ///api/v1/meta/column/{metaTblId} > metaTblClmnPhysNm,
  attrJoinKeyClmnNm: string; ///api/v1/meta/column/{metaTblId} > metaTblClmnPhysNm,
  mstrSgmtRuleDbNm: string; ///api/v1/meta/info > mstrSgmtRuleDbNm,
  clmnAllChocYn: string; //항목 전체선택 여부 : Y or N, 속성인 경우 default = N,
  mstrJoinKeyClmnPrty: string; //string,
  dataDiv: string;
  rtmTblYn: string; //실시간 테이블여부, 체크박스 Y,N
}
export interface TbRsRslnRuleRel {
  [key: string]: string;
  rslnRuleId: string; // Resolution룰 콤보박스 선택된 아이디 (rslnRuleId),
  mstrSgmtRuleId: string;
  rslnRuleRelUseYn: string; // Resolution룰관계사용여부: default = Y
  frstRegDttm: string;
  frstRegUserId: string;
  lastUpdDttm: string;
  lastUpdUserId: string;
}
export interface MasterProfileInfo {
  [key: string]:
    | TbRsMstrSgmtRule
    | Array<TbRsMstrSgmtRuleAttrTbl>
    | Array<TbRsMstrSgmtRuleAttrClmn>
    | Array<TbRsRslnRuleRel>
    | Array<TbRsMstrSgmtRule>;
  tbRsMstrSgmtRule: TbRsMstrSgmtRule;
  tbRsMstrSgmtRuleAttrTbl: Array<TbRsMstrSgmtRuleAttrTbl>;
  tbRsMstrSgmtRuleAttrClmn: Array<TbRsMstrSgmtRuleAttrClmn>;
  tbRsRslnRuleRel: Array<TbRsRslnRuleRel>;
  //tbRsMstrSgmtRuleList: Array<TbRsMstrSgmtRule>
}
// Master Profile 삭제 Param Props
export interface MstrProfDelProps {
  [key: string]: Array<string>;
  mstrSgmtRuleIds: Array<string>;
}
export interface TbRsRslnRuleKeyPrty {
  [key: string]: string | number;
  rslnRuleId: string;
  rslnRuleKeyClmnNm: string;
  rslnRuleKeyPrty: number;
}
export interface TbCoMetaTblClmnInfo {
  [key: string]: string | number;
  rtmTblYn: string;
  metaTblId: string;
  metaTblLogiNm: string;
  metaTblClmnId: string;
  metaTblClmnPhysNm: string;
  metaTblClmnLogiNm: string;
  metaTblClmnDesc: string;
  dtpCd: string;
  dtpLenVal: string;
  pkYn: string;
  nullYn: string;
  defltVal: string;
  clmnUseYn: string;
  clmnSortOrd: number;
  frstRegDttm: string;
  frstRegUserId: string;
  lastUpdDttm: string;
  lastUpdUserId: string;
  chgDtpCd: string;
  dataFormat: string;
  baseTimeYn: string;
  maskingRuleCd: string;
  dataTypeCategory: string;
}
