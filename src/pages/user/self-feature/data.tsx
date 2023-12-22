import { RuleId } from "@/models/selfFeature/FeatureCommon";
import {
    FeatureInfo,
    TbRsCustFeatRuleCalc,
    TbRsCustFeatRule,
    TbRsCustFeatRuleTrgt,
    TbRsCustFeatRuleTrgtFilter,
    TbRsCustFeatRuleCase,
    MstrSgmtTableandColMetaInfo,
    TbCoMetaTblClmnInfo,
    TbCoMetaTbInfo,
    Behavior,
    Attribute,
    FormulaValidRslt,
    FeatPrntCild,
    FeatSampleData,
    BatchExecuteLog,
    ReadSql,
    FeatureTemp,
    TbRsCustFeatRuleSql,
    CustFeatureFormData,
    FeatListSrchProps,
    FeatureBaseType,
    CustFeatureFormDataSql,
} from "@/models/selfFeature/FeatureModel";
import { initSfSubmissionApproval, initSfSubmissionRequestInfo } from "../self-feature-submission/data";

// feature 목록 검색 조건 필터
export const category = [
    { value: '', text: '선택' },
    { value: 'PROPORTION', text: '비율' },
    { value: 'SUM', text: '합계' },
    { value: 'TOP_N', text: 'Top N' },
    { value: 'CASE', text: 'Case문 사용' },
    { value: 'COUNT', text: '건수' },
    { value: 'AVG', text: '평균' },
]
// feature 승인 상태
export const submissionStatus = [
    { value: '', text: '전체' },
    { value: 'saved', text: '등록' },
    { value: 'inApproval', text: '결재진행중' },
    { value: 'approved', text: '승인 완료' },
    { value: 'rejected', text: '반려' },
]

// 대상선택(행동 데이터) 순번 setting(A,B,C ...)
export const trgtFilterTit = Array.from({ length: 26 }, (v, i) => String.fromCharCode(i + 65))

// 계산식 validation 결과값
export const initFormulaValidRslt: FormulaValidRslt = {
    isValidFormula: true,
    text: '',
}
// 필터 옵션
export const filterOption = [
    { value: 'ALL', text: '아래 조건을 모두 만족하는 경우' },
    { value: 'ANY', text: '아래 조건중 하나라도 만족하는 경우' },
    { value: 'CUS', text: '조건 사이의 관계를 직접 입력' },
]
// Rule Design 등록/수정시 case문
export const whenYn = [
    { value: 'Y', text: 'WHEN' },
    { value: 'N', text: 'ELSE' },
]
// Feature 메인 리스트 table header
export const featListColumns = [
    { headerName: 'Feature 명(한글)', field: 'name', colSpan: 7 },
    { headerName: 'Feature 명(영문)', field: 'featureEnNm', colSpan: 7 },
    { headerName: '진행 상태', field: 'submissionStatusNm', colSpan: 3 },
    { headerName: '부서', field: 'deptNm', colSpan: 4 },
]
// Feature 선후행 관계 table header
export const featPrntClidListColumns = [
    { headerName: 'Feature 명', field: 'name', colSpan: 4 },
    { headerName: '진행 상태', field: 'submissionStatus', colSpan: 2 },
    { headerName: '선행 Feature', field: 'parentNames', colSpan: 1 },
    { headerName: '후행 Feature', field: 'childNames', colSpan: 1 },
]
// 배치 실행 결과 샘플 확인 팝업 table header
export const querySampleDataListColumns = [
    { headerName: '샘플 One ID', field: 'rsln_id', colSpan: 1 },
    { headerName: '샘플 값', field: 'cf_value', colSpan: 1 },
]
// 배치 실행 이력 팝업 table header
export const batchExecuteLogListColumns = [
    { headerName: '실행 일시', field: 'startTme', colSpan: 3 },
    { headerName: '종료 일시', field: 'endTme', colSpan: 3 },
    { headerName: '수행 시간(millisecond)', field: 'execTme', colSpan: 3 },
    { headerName: '생성 건수', field: 'rsltCnt', colSpan: 3 },
    { headerName: '수행 결과', field: 'batchResultStatus', colSpan: 3 },
]
// customer feature 검색 조건 초기화
export const initFeatListSrchProps: FeatListSrchProps = {
    mstrSgmtRuleId: '',
    custFeatRuleName: '',
    custFeatRuleNameEng: '',
    // category: '',
    useYn: 'Y',
    submissionStatus: '',
    team: '',
}

export const initTbRsCustFeatRule: TbRsCustFeatRule = {
    id: '',
    name: '',
    featureEnNm: '',
    description: '',
    rslnRuleId: '',//RuleId.RESOLUTION,
    mstrSgmtRuleId: '',//RuleId.MASTERPROF,
    mstrSgmtRuleNm: '',
    useYn: 'Y',
    batManualExecTestCnt: 0,
    frstRegDttm: '',
    frstRegUserId: '',
    lastUpdDttm: '',
    lastUpdUserId: '',
    category: ' ',
    dataType: '',
    sqlDirectInputYn: '',
    frstRegUserNm: '',
    lastUpdUserNm: '',
    submissionStatus: '',
    metaTblId: '',
    lastUpdLginId: '',
    submissionStatusNm: '',
    userTeamNm: '',
    deptNm: '',
}

export const initTbRsCustFeatRuleCalc: TbRsCustFeatRuleCalc = {
    id: 0,
    custFeatRuleId: '',
    formula: '',
    frstRegDttm: '',
    frstRegUserId: '',
    lastUpdDttm: '',
    lastUpdUserId: ''
}

export const initTbRsCustFeatRuleTrgt: TbRsCustFeatRuleTrgt = {
    id: 0,
    custFeatRuleId: '',
    targetId: '',
    divisionCode: '',
    tableName: '',
    tableLogiName: '',
    filterLogiOption: 'ALL',
    filterLogiExpsn: '',
    operator: '',
    operand1: '',
    columnName: '',
    frstRegDttm: '',
    frstRegUserId: '',
    lastUpdDttm: '',
    lastUpdUserId: '',
    operand2: '',
    operand3: '',
    operand4: '',
    function: '',
    variable1: '',
    variable2: '',
    variable3: '',
    targetDataType: '',
    dtpCd: '',
}

export const initTbRsCustFeatRuleTrgtFilter: TbRsCustFeatRuleTrgtFilter = {
    id: 0,
    custFeatRuleTrgtId: 0,
    custFeatRuleId: '',
    targetId: '',
    filterId: '',
    columnName: '',
    columnLogiName: '',
    columnDataTypeCode: '',
    operator: '',
    operand1: '',
    operand2: '',
    frstRegDttm: '',
    frstRegUserId: '',
    lastUpdDttm: '',
    lastUpdUserId: '',
    delimiter: '',
    operand3: '',
    operand4: '',
    operand5: '',
    operand6: '',
    function: '',
    variable1: '',
    variable2: '',
    variable3: '',
}
// 초기 case문은 반드시 when(whenYn = Y)
export const initTbRsCustFeatRuleCase: TbRsCustFeatRuleCase = {
    id: 0,
    custFeatRuleId: '',
    caseId: '',
    whenYn: 'Y',
    targetFormula: '',
    operator: '',
    delimiter: '',
    operand1: '',
    operand2: '',
    operand3: '',
    operand4: '',
    operand5: '',
    operand6: '',
    result: '',
    frstRegDttm: '',
    frstRegUserId: '',
    lastUpdDttm: '',
    lastUpdUserId: '',
}

export const initFeatureTemp: FeatureTemp = {
    featureId: '',
    featureTyp: FeatureBaseType.FEAT_TYPE,
    featureSeGrp: '',
    featureSe: '',
    featureKoNm: '',
    featureEnNm: '',
    calcUnt: '',
    featureDef: '',
    featureFm: '',
    featureDsc: '',
    enrUserId: '',
    enrDeptCode: '',
    delYn: '',
    rgstDt: '',
    rgstId: '',
    modiDt: '',
    modiId: '',
    featureRelTb: '',
}

export const initTbRsCustFeatRuleSql: TbRsCustFeatRuleSql = {
    custFeatRuleId: '',
    sqlQuery: '',
    frstRegDttm: '',
    frstRegUserId: '',
    lastUpdDttm: '',
    lastUpdUserId: '',
}

export const initSelfFeatureInfo: FeatureInfo = {
    tbRsCustFeatRule: initTbRsCustFeatRule,
    tbRsCustFeatRuleCalc: initTbRsCustFeatRuleCalc,
    tbRsCustFeatRuleTrgtList: [{ ...initTbRsCustFeatRuleTrgt }],
    tbRsCustFeatRuleTrgtFilterList: [{ ...initTbRsCustFeatRuleTrgtFilter }],
    tbRsCustFeatRuleCaseList: [{ ...initTbRsCustFeatRuleCase }],
    featureTemp: initFeatureTemp,
    tbRsCustFeatRuleSql: initTbRsCustFeatRuleSql,
}

export const initCustFeatureFormData: CustFeatureFormData = {
    customerFeature: initSelfFeatureInfo,
    submissionInfo: {
        submission: initSfSubmissionRequestInfo,
        approvals: [{ ...initSfSubmissionApproval }]
    }
}
export const initCustFeatureFormDataSql: CustFeatureFormDataSql = {
    customerFeatureSql: initSelfFeatureInfo,
    submissionInfo: {
        submission: initSfSubmissionRequestInfo,
        approvals: [{ ...initSfSubmissionApproval }]
    }
}

export const initTbCoMetaTbInfo: TbCoMetaTbInfo = {
    metaTblId: '',
    metaTblPhysNm: '',
    metaTblLogiNm: '',
    metaTblDesc: '',
    dbNm: '',
    dataClaCd: '',
    dataSrcDvCd: '',
    keepCylcCd: '',
    metaTblUseYn: '',
    metaTblDvCd: '',
    rtmTblYn: '',
    topicId: '',
    frstRegDttm: '',
    frstRegUserId: '',
    lastUpdDttm: '',
    lastUpdUserId: '',
}

export const initTbCoMetaTblClmnInfo: TbCoMetaTblClmnInfo = {
    rtmTblYn: '',
    metaTblId: '',
    metaTblLogiNm: '',
    metaTblClmnId: '',
    metaTblClmnPhysNm: '',
    metaTblClmnLogiNm: '',
    metaTblClmnDesc: '',
    dtpCd: '',
    dtpLenVal: '',
    pkYn: '',
    nullYn: '',
    defltVal: '',
    clmnUseYn: '',
    clmnSortOrd: 0,
    frstRegDttm: '',
    frstRegUserId: '',
    lastUpdDttm: '',
    lastUpdUserId: '',
    chgDtpCd: '',
    dataFormat: '',
    baseTimeYn: '',
    maskingRuleCd: '',
    dataTypeCategory: '',
}

export const initBehavior: Behavior = {
    metaTblId: '',
    metaTblLogiNm: '',
    tbCoMetaTbInfo: initTbCoMetaTbInfo,
    tbCoMetaTblClmnInfoList: [{ ...initTbCoMetaTblClmnInfo }],
    rtmTblYn: '',
}

export const initAttribute: Attribute = {
    rtmTblYn: '',
    metaTblId: '',
    metaTblLogiNm: '',
    metaTblClmnId: '',
    metaTblClmnPhysNm: '',
    metaTblClmnLogiNm: '',
    metaTblClmnDesc: '',
    dtpCd: '',
    dtpLenVal: '',
    pkYn: '',
    nullYn: '',
    defltVal: '',
    clmnUseYn: '',
    clmnSortOrd: 0,
    frstRegDttm: '',
    frstRegUserId: '',
    lastUpdDttm: '',
    lastUpdUserId: '',
    chgDtpCd: '',
    dataFormat: '',
    baseTimeYn: '',
    maskingRuleCd: '',
    dataTypeCategory: '',
}

export const initMstrSgmtTableandColMetaInfo: MstrSgmtTableandColMetaInfo = {
    rslnRuleId: '',
    behaviors: [{ ...initBehavior }],
    attributes: [{ ...initAttribute }]
}

export const initFeatPrntCild: FeatPrntCild = {
    id: '',
    name: '',
    submissionStatus: '',
    parentIds: '',
    parentNames: '',
    childIds: '',
    childNames: '',
}

export const initFeatSampleData: FeatSampleData = {
    cf_value: '',
    rsln_id: '',
}

export const initBatchExecuteLog: BatchExecuteLog = {
    batType: '',
    ruleId: '',
    ruleNm: '',
    startTme: '',
    endTme: '',
    execTme: '',
    rsltCnt: '',
    pgmNm: '',
    execVersion: '',
    batchResultStatus: '',
    schdId: '',
    schdNm: '',
}

export const initReadSql: ReadSql = {
    sql: '',
}