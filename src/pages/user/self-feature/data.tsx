import { FeatureType, RuleId } from "@/models/selfFeature/FeatureCommon";
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
export const submissionStatus = [
    { value: '', text: '전체' },
    { value: 'saved', text: '등록' },
    { value: 'inApproval', text: '결재진행중' },
    { value: 'approved', text: '승인 완료' },
    { value: 'rejected', text: '반려' },
]

// 대상선택(행동 데이터) 순번 setting(A,B,C ...)
export const trgtFilterTit = Array.from({ length: 26 }, (v, i) => String.fromCharCode(i + 65))

// 대상선택 drag 리스트 구분
export const TrgtDragAttrType = {
    TYPE1: "고객 Fact지수",
    TYPE2: "여객 Fact지수",
    TYPE3: "고객행동 Fact지수",
}

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
    rslnRuleId: RuleId.RESOLUTION,
    mstrSgmtRuleId: RuleId.MASTERPROF,
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
    featureTyp: '',
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
    tbRsCustFeatRuleTrgtList: [{...initTbRsCustFeatRuleTrgt}],
    tbRsCustFeatRuleTrgtFilterList: [{...initTbRsCustFeatRuleTrgtFilter}],
    tbRsCustFeatRuleCaseList: [{...initTbRsCustFeatRuleCase}],
    featureTemp: initFeatureTemp,
    tbRsCustFeatRuleSql: initTbRsCustFeatRuleSql,
}

export const initCustFeatureFormData: CustFeatureFormData = {
    customerFeature: initSelfFeatureInfo,
    submissionInfo: {
        submission: initSfSubmissionRequestInfo,
        approvals: [{...initSfSubmissionApproval}]
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
        name: '홈페이지방문횟수(예매)',
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
        category: '고객행동(캠페인반응/온라인행동)',
        dataType: '',
        sqlDirectInputYn: '',
        frstRegUserNm: '',
        lastUpdUserNm: '수정자1',
        submissionStatus: '',
        metaTblId: '',
        lastUpdLginId: '',
        submissionStatusNm: '등록중',
    }, {
        id: 'CFR_00000001',
        name: '홈페이지방문횟수(예매)',
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
        category: '고객행동(캠페인반응/온라인행동)',
        dataType: '',
        sqlDirectInputYn: 'N',
        frstRegUserNm: '',
        lastUpdUserNm: '수정자2',
        submissionStatus: 'saved',
        metaTblId: '',
        lastUpdLginId: '',
        submissionStatusNm: '등록중',
    }, /*{
        id: 'CFR_00000001',
        name: '홈페이지방문횟수(예매)',
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
    },*/
    {
        id: 'CFR_00000001',
        name: '홈페이지방문횟수(예매)',
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
        category: '고객행동(캠페인반응/온라인행동)',
        dataType: '',
        sqlDirectInputYn: '',
        frstRegUserNm: '',
        lastUpdUserNm: '수정자4',
        submissionStatus: 'inApproval',
        metaTblId: '',
        lastUpdLginId: '',
        submissionStatusNm: '결재진행중',
    }, {
        id: 'CFR_00000001',
        name: '홈페이지방문횟수(예매)',
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
        category: '고객행동(캠페인반응/온라인행동)',
        dataType: '',
        sqlDirectInputYn: '',
        frstRegUserNm: '',
        lastUpdUserNm: '수정자5',
        submissionStatus: 'approved',
        metaTblId: '',
        lastUpdLginId: '',
        submissionStatusNm: '승인 완료',
    }, {
        id: 'CFR_00000001',
        name: '홈페이지방문횟수(예매)',
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
        category: '고객행동(캠페인반응/온라인행동)',
        dataType: '',
        sqlDirectInputYn: '',
        frstRegUserNm: '',
        lastUpdUserNm: '수정자6',
        submissionStatus: 'rejected',
        metaTblId: '',
        lastUpdLginId: '',
        submissionStatusNm: '반려',
    },
    // {
    //     id: 'CFR_ADM_00000007',
    //     name: '고객픽쳐테스트7(결재요청건)',
    //     description: '결재요청건',
    //     rslnRuleId: 'OneID',
    //     mstrSgmtRuleId: 'CustomerFeature',
    //     mstrSgmtRuleNm: '고객픽쳐',
    //     useYn: 'Y',
    //     batManualExecTestCnt: 0,
    //     frstRegDttm: '',
    //     frstRegUserId: '',
    //     lastUpdDttm: '2023-11-06 13:52:11',
    //     lastUpdUserId: '',
    //     category: '',
    //     dataType: '',
    //     sqlDirectInputYn: '',
    //     frstRegUserNm: '',
    //     lastUpdUserNm: '수정자6',
    //     submissionStatus: 'inApproval',
    //     metaTblId: '',
    //     lastUpdLginId: '',
    //     submissionStatusNm: '결재진행중',
    // }
]



export const protoTypeTbRsCustFeatRuleCalc: TbRsCustFeatRuleCalc = {
    id: 0,
    custFeatRuleId: '',
    formula: 'T1',
    frstRegDttm: '',
    frstRegUserId: '',
    lastUpdDttm: '',
    lastUpdUserId: ''
}

export const protoTypeTbCoMetaTbInfo: TbCoMetaTbInfo = {
    metaTblId: 'L2_homepagebehv_B_id',
    metaTblPhysNm: 'L2_homepagebehv_B',
    metaTblLogiNm: 'L2_홈페이지행동_B',
    metaTblDesc: 'L2_홈페이지행동_B',
    dbNm: 'SelfFeature',
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


export const protoTypeAttributes: Array<Attribute> = [
    {
        rtmTblYn: '',
        metaTblId: 'L2_homepageattr_A_id',
        metaTblClmnId: 'L2_homepageattr_A_clmn_id1',
        metaTblClmnPhysNm: '',
        metaTblClmnLogiNm: '성별',
        metaTblClmnDesc: '성별',
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
    }, {
        rtmTblYn: '',
        metaTblId: 'L2_homepageattr_A_id',
        metaTblClmnId: 'L2_homepageattr_A_clmn_id2',
        metaTblClmnPhysNm: '',
        metaTblClmnLogiNm: '연령',
        metaTblClmnDesc: '연령',
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
    }, {
        rtmTblYn: '',
        metaTblId: 'L2_homepageattr_A_id',
        metaTblClmnId: 'L2_homepageattr_A_clmn_id3',
        metaTblClmnPhysNm: '',
        metaTblClmnLogiNm: '국적',
        metaTblClmnDesc: '국적',
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
    }, {
        rtmTblYn: '',
        metaTblId: 'L2_homepageattr_A_id',
        metaTblClmnId: 'L2_homepageattr_A_clmn_id4',
        metaTblClmnPhysNm: '',
        metaTblClmnLogiNm: '선호영역',
        metaTblClmnDesc: '선호영역',
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
]