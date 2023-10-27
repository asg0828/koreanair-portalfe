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
    Attribute
} from "@/models/selfFeature/FeatureInfo";

export const trgtFilterTit = Array.from({ length: 26 }, (v, i) => String.fromCharCode(i + 65))

export const selfFeatPgPpNm = {
    LIST: 'list', // 목록
    DETL: 'detail',  // 상세
    REG:  'reg',  // 등록
    EDIT: 'edit',  // 수정
    SUBMCFRM: 'subConfirm', // 승인 요청 팝업
    SUBINFO:  'subInfo',  // 승인 확인 팝업
    PRNTCHLD: 'parentChildList'
}
// feat 상태
export const subFeatStatus = {
    REG: 'reg', // 등록
    SUBREG: 'sub_reg', // 품의 저장
}
// 필터 옵션
export const filterOption = [
    { value: 'ALL', text: '아래 조건을 모두 만족하는 경우' },
    { value: 'ANY', text: '아래 조건중 하나라도 만족하는 경우' },
    { value: 'CUS', text: '조건 사이의 관계를 직접 입력' },
]
// 연산자 목록
export const operatorOption = [
    { value: 'match', text: 'Match' },
    { value: 'not match', text: 'Not Match' },
    { value: 'start with', text: 'Start With' },
    { value: 'not start with', text: 'Not Start With' },
    { value: 'in_str', text: 'In' },
    { value: 'not_in_str', text: 'Not in' },
    { value: 'contains', text: 'Contains' },
    { value: 'not contains', text: 'Not Contains' },
]
// 구분자 목록
export const delimiterOption = [
    { value: ',', text: ',' },
    { value: '/', text: '/' },
    { value: ':', text: ':' },
]
// 집계함수 목록
export const aggregateOption = [
    { value: 'count', text: 'Count' },
    { value: 'max', text: 'Max' },
    { value: 'min', text: 'Min' },
    { value: 'distinct_count', text: 'Distinct Count' },
    { value: 'first', text: 'First' },
    { value: 'last', text: 'Last' },
    { value: 'top', text: 'Top' },
]

export const whenYn = [
    { value: 'Y', text: 'WHEN' },
    { value: 'N', text: 'ELSE' },
]

export const listColumns = [
    { headerName: 'Feature 명', field: 'name', colSpan: 4 },
    { headerName: '최종 수정 일시', field: 'lastUpdDttm', colSpan: 1 },
    { headerName: '진행 상태', field: 'submissionStatus', colSpan: 2 },
    { headerName: '최종 수정 사용자', field: 'lastUpdUserNm', colSpan: 1 },
    { headerName: '사용 여부', field: 'useYn', colSpan: 1 },
]

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
    useYn: '',
    batManualExecTestCnt: 0,
    frstRegDttm: '',
    frstRegUserId: '',
    lastUpdDttm: '',
    lastUpdUserId: '',
    category: '',
    dataType: '',
    frstRegUserNm: '',
    lastUpdUserNm: '',
    submissionStatus: '',
    metaTblId: '',
    lastUpdLginId: ''
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

export const initSelfFeatureInfo: FeatureInfo = {
    tbRsCustFeatRule: initTbRsCustFeatRule,
    tbRsCustFeatRuleCalc: initTbRsCustFeatRuleCalc,
    tbRsCustFeatRuleTrgtList: [{...initTbRsCustFeatRuleTrgt}],
    tbRsCustFeatRuleTrgtFilterList: [{...initTbRsCustFeatRuleTrgtFilter}],
    tbRsCustFeatRuleCaseList: [{...initTbRsCustFeatRuleCase}],
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