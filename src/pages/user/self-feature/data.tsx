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
} from "@/models/selfFeature/FeatureInfo";


// 대상선택(행동 데이터) 순번 setting(A,B,C ...)
export const trgtFilterTit = Array.from({ length: 26 }, (v, i) => String.fromCharCode(i + 65))

// 계산식 validation 결과값
export const initFormulaValidRslt: FormulaValidRslt = {
    isValidFormula: true,
    text:  '',
}

// 필터 옵션
export const filterOption = [
    { value: 'ALL', text: '아래 조건을 모두 만족하는 경우' },
    { value: 'ANY', text: '아래 조건중 하나라도 만족하는 경우' },
    { value: 'CUS', text: '조건 사이의 관계를 직접 입력' },
]
// 변환식 함수
export const transFuncOtion = [
    { value: '',          text: '선택' },
    { value: 'NVL',       text: 'NVL' },
    { value: 'SUBSTRING', text: 'Substring' },
    { value: 'LENGTH',    text: 'Length' },
    { value: 'CONCAT',    text: 'Concat' },
    { value: 'TO_NUMBER', text: 'To Number' },
]
// 연산자 목록
export const operatorOption = [
    { value: '',                text: '선택' },
    { value: 'match',           text: 'Match' },
    { value: 'not match',       text: 'Not Match' },
    { value: 'start with',      text: 'Start With' },
    { value: 'not start with',  text: 'Not Start With' },
    { value: 'in_str',          text: 'In' },
    { value: 'not_in_str',      text: 'Not in' },
    { value: 'contains',        text: 'Contains' },
    { value: 'not contains',    text: 'Not Contains' },
]
// 구분자 목록
export const delimiterOption = [
    { value: ',', text: ',' },
    { value: '/', text: '/' },
    { value: ':', text: ':' },
]
// 집계함수 목록
export const aggregateOption = [
    { value: 'count',           text: 'Count' },
    { value: 'max',             text: 'Max' },
    { value: 'min',             text: 'Min' },
    { value: 'distinct_count',  text: 'Distinct Count' },
    { value: 'first',           text: 'First' },
    { value: 'last',            text: 'Last' },
    { value: 'top',             text: 'Top' },
]
// Rule Design 등록/수정시 case문
export const whenYn = [
    { value: 'Y', text: 'WHEN' },
    { value: 'N', text: 'ELSE' },
]
// Feature 메인 리스트 table header
export const featListColumns = [
    { headerName: 'Feature 명', field: 'name', colSpan: 8 },
    { headerName: '최종 수정 일시', field: 'lastUpdDttm', colSpan: 3 },
    { headerName: '진행 상태', field: 'submissionStatusNm', colSpan: 4 },
    { headerName: '최종 수정 사용자', field: 'lastUpdUserNm', colSpan: 2 },
    // { headerName: '사용 여부', field: 'useYn', colSpan: 2 },
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
    { headerName: '실행 일시', field: 'startTime', colSpan: 3 },
    { headerName: '종료 일시', field: 'endTime', colSpan: 3 },
    { headerName: '수행 시간', field: 'execTime', colSpan: 3 },
    { headerName: '생성 건수', field: 'rsltCnt', colSpan: 3 },
    { headerName: '수행 결과', field: 'batchResultStatus', colSpan: 3 },
]
// 속성, 행동, feature 데이터 타입
export const divisionTypes = {
    ATTR: 'ATTR',
    FEAT: 'FEAT',
    BEHV: 'BEHV',
}

export const initTbRsCustFeatRule: TbRsCustFeatRule = {
    id: '',
    name: '',
    description: '',
    rslnRuleId: '',
    mstrSgmtRuleId: '',
    mstrSgmtRuleNm: '',
    useYn: 'Y',
    batManualExecTestCnt: 0,
    frstRegDttm: '',
    frstRegUserId: '',
    lastUpdDttm: '',
    lastUpdUserId: '',
    category: '',
    dataType: '',
    sqlDirectInputYn: '',
    frstRegUserNm: '',
    lastUpdUserNm: '',
    submissionStatus: '',
    metaTblId: '',
    lastUpdLginId: '',
    submissionStatusNm: '',
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
}

export const initTbRsCustFeatRuleTrgtFilter: TbRsCustFeatRuleTrgtFilter = {
    id: 0,
    custFeatRuleTrgtId: 0,
    custFeatRuleId: '',
    targetId: '',
    filterId: '',
    columnName: '',
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
    featureTyp: '',
    featureSe: '',
    featureNm: '',
    featureEngNm: '',
    calcUnt: '',
    featureDef: '',
    featureFm: '',
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
    tbRsCustFeatRuleTrgtList: [{...initTbRsCustFeatRuleTrgt}],
    tbRsCustFeatRuleTrgtFilterList: [{...initTbRsCustFeatRuleTrgtFilter}],
    tbRsCustFeatRuleCaseList: [{...initTbRsCustFeatRuleCase}],
    featureTemp: initFeatureTemp,
    tbRsCustFeatRuleSql: initTbRsCustFeatRuleSql,
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
    tbCoMetaTblClmnInfoList: [{...initTbCoMetaTblClmnInfo}],
    rtmTblYn: '',
}

export const initAttribute: Attribute = {
    rtmTblYn: '',
    metaTblId: '',
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
    behaviors: [{...initBehavior}],
    attributes: [{...initAttribute}]
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
    startTime: '',
    endTime: '',
    execTime: '',
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

// proto type data
export const protoTbRsCustFeatRuleList: Array<TbRsCustFeatRule> = [
    {
        id: 'CFR_00000001',
        name: '고객픽쳐테스트1',
        description: '등록중',
        rslnRuleId: 'OneID',
        mstrSgmtRuleId: 'CustomerFeature',
        mstrSgmtRuleNm: '고객픽쳐',
        useYn: 'Y',
        batManualExecTestCnt: 0,
        frstRegDttm: '',
        frstRegUserId: '',
        lastUpdDttm: '2023-11-01 13:52:11',
        lastUpdUserId: '',
        category: '',
        dataType: '',
        sqlDirectInputYn: '',
        frstRegUserNm: '',
        lastUpdUserNm: '수정자1',
        submissionStatus: '',
        metaTblId: '',
        lastUpdLginId: '',
        submissionStatusNm: '등록중',
    }, {
        id: 'CFR_00000002',
        name: '고객픽쳐테스트2',
        description: '등록중',
        rslnRuleId: 'OneID',
        mstrSgmtRuleId: 'CustomerFeature',
        mstrSgmtRuleNm: '고객픽쳐',
        useYn: 'Y',
        batManualExecTestCnt: 0,
        frstRegDttm: '',
        frstRegUserId: '',
        lastUpdDttm: '2023-11-02 13:52:11',
        lastUpdUserId: '',
        category: '',
        dataType: '',
        sqlDirectInputYn: '',
        frstRegUserNm: '',
        lastUpdUserNm: '수정자2',
        submissionStatus: 'saved',
        metaTblId: '',
        lastUpdLginId: '',
        submissionStatusNm: '등록중',
    }, {
        id: 'CFR_00000003',
        name: '고객픽쳐테스트3',
        description: '승인요청',
        rslnRuleId: 'OneID',
        mstrSgmtRuleId: 'CustomerFeature',
        mstrSgmtRuleNm: '고객픽쳐',
        useYn: 'Y',
        batManualExecTestCnt: 0,
        frstRegDttm: '',
        frstRegUserId: '',
        lastUpdDttm: '2023-11-03 13:52:11',
        lastUpdUserId: '',
        category: '',
        dataType: '',
        sqlDirectInputYn: '',
        frstRegUserNm: '',
        lastUpdUserNm: '수정자3',
        submissionStatus: 'requested',
        metaTblId: '',
        lastUpdLginId: '',
        submissionStatusNm: '승인요청',
    }, {
        id: 'CFR_00000004',
        name: '고객픽쳐테스트4',
        description: '결재진행중',
        rslnRuleId: 'OneID',
        mstrSgmtRuleId: 'CustomerFeature',
        mstrSgmtRuleNm: '고객픽쳐',
        useYn: 'Y',
        batManualExecTestCnt: 0,
        frstRegDttm: '',
        frstRegUserId: '',
        lastUpdDttm: '2023-11-04 13:52:11',
        lastUpdUserId: '',
        category: '',
        dataType: '',
        sqlDirectInputYn: '',
        frstRegUserNm: '',
        lastUpdUserNm: '수정자4',
        submissionStatus: 'inApproval',
        metaTblId: '',
        lastUpdLginId: '',
        submissionStatusNm: '결재진행중',
    }, {
        id: 'CFR_00000005',
        name: '고객픽쳐테스트5',
        description: '승인 완료',
        rslnRuleId: 'OneID',
        mstrSgmtRuleId: 'CustomerFeature',
        mstrSgmtRuleNm: '고객픽쳐',
        useYn: 'Y',
        batManualExecTestCnt: 0,
        frstRegDttm: '',
        frstRegUserId: '',
        lastUpdDttm: '2023-11-05 13:52:11',
        lastUpdUserId: '',
        category: '',
        dataType: '',
        sqlDirectInputYn: '',
        frstRegUserNm: '',
        lastUpdUserNm: '수정자5',
        submissionStatus: 'approved',
        metaTblId: '',
        lastUpdLginId: '',
        submissionStatusNm: '승인 완료',
    }, {
        id: 'CFR_00000006',
        name: '고객픽쳐테스트6',
        description: '반려',
        rslnRuleId: 'OneID',
        mstrSgmtRuleId: 'CustomerFeature',
        mstrSgmtRuleNm: '고객픽쳐',
        useYn: 'Y',
        batManualExecTestCnt: 0,
        frstRegDttm: '',
        frstRegUserId: '',
        lastUpdDttm: '2023-11-06 13:52:11',
        lastUpdUserId: '',
        category: '',
        dataType: '',
        sqlDirectInputYn: '',
        frstRegUserNm: '',
        lastUpdUserNm: '수정자6',
        submissionStatus: 'rejected',
        metaTblId: '',
        lastUpdLginId: '',
        submissionStatusNm: '반려',
    }
]