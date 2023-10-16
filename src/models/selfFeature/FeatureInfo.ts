//Required: tbRsCustFeatRule,tbRsCustFeatRuleCalc
export interface FeatureInfo {
    //Required: category,description,mstrSgmtRuleId,name,useYn
    tbRsCustFeatRule: TbRsCustFeatRule | {},
    tbRsCustFeatRuleCalc: TbRsCustFeatRuleCalc | {},
    tbRsCustFeatRuleTrgtList: Array<TbRsCustFeatRuleTrgt> | [],
    tbRsCustFeatRuleTrgtFilterList: Array<TbRsCustFeatRuleTrgtFilter> | [],
    tbRsCustFeatRuleCaseList: Array<TbRsCustFeatRuleCase> | [],
}

export interface TbRsCustFeatRule {
    //example: Customer Feature Rule ID (Auto Increment)
    id: string,
    //example: Customer Feature 이름
    name: string,
    //example: Customer Feature 설명
    description: string,
    //example: Resolution Rule ID
    rslnRuleId: string,
    //example: 마스터 세그먼트 ID
    mstrSgmtRuleId: string,
    //example: 마스터 세그먼트 명
    mstrSgmtRuleNm: string,
    //example: 사용여부: default=Y
    useYn: string,
    batManualExecTestCnt: number,
    //example: 최초등록 일시: default=CURRENT_TIMESTAMP
    frstRegDttm: string,
    //example: 최초등록 사용자ID
    frstRegUserId: string,
    //example: 최종수정 일시
    lastUpdDttm: string,
    //example: 최종수정 사용자ID
    lastUpdUserId: string,
    //example: 카테고리
    category: string,
    //example: 데이터 유형
    dataType: string,
    frstRegUserNm: string,
    lastUpdUserNm: string,
    submissionStatus: string,
    metaTblId: string,
    lastUpdLginId: string
}

export interface TbRsCustFeatRuleCalc {
    //Required: formula
    id: number,
    //example: Customer Feature Rule ID
    custFeatRuleId: string,
    //example: 계산식
    formula: string,
    //example: 최초등록 일시: default=CURRENT_TIMESTAMP
    frstRegDttm: string,
    //example: 최초등록 사용자ID
    frstRegUserId: string,
    //example: 최종수정 일시
    lastUpdDttm: string,
    //example: 최종수정 사용자ID
    lastUpdUserId: string
}

export interface TbRsCustFeatRuleTrgt {
    //Required: tableName,targetId
    id: number,
    //example: Customer Feature Rule ID
    custFeatRuleId: string,
    //example: 대상ID
    targetId: string,
    //Pattern: ATTR|BEHV|FEAT example: 구분코드(고객/행동/피처)
    divisionCode: string,
    //Pattern: [\w-.]+ example: 테이블명
    tableName: string,
    //Pattern: ALL|ANY|CUS example: 필터옵션(ALL/ANY/CUS)
    filterLogiOption: string,
    //example: 필터논리표현식
    filterLogiExpsn: string,
    //example: 연산자
    operator: string,
    //Pattern: (?i)((?!select|from|delete|update|merge|insert|create|union|drop|/\*|--).)* example: 피연산자1
    operand1: string,
    //Pattern: [\w-]+ example: 컬럼명
    columnName: string,
    //example: 최초등록 일시: default=CURRENT_TIMESTAMP
    frstRegDttm: string,
    //example: 최초등록 사용자ID
    frstRegUserId: string,
    //example: 최종수정 일시
    lastUpdDttm: string,
    //example: 최종수정 사용자ID
    lastUpdUserId: string,
    //Pattern: (?i)((?!select|from|delete|update|merge|insert|create|union|drop|/\*|--).)* example: 피연산자2
    operand2: string,
    //Pattern: (?i)((?!select|from|delete|update|merge|insert|create|union|drop|/\*|--).)* example: 피연산자3
    operand3: string,
    //Pattern: (?i)((?!select|from|delete|update|merge|insert|create|union|drop|/\*|--).)* example: 피연산자4
    operand4: string,
    //example: 변환식 함수
    function: string,
    //example: 변수1
    variable1: string,
    //example: 변수2
    variable2: string,
    //example: 변수3
    variable3: string,
    //example: 대상 데이터 타입
    targetDataType: string,
}

export interface TbRsCustFeatRuleTrgtFilter {
    //Required: filterId,targetId
    id: number,
    custFeatRuleTrgtId: number,
    custFeatRuleId: string,
    //example: Customer Feature Rule ID
    targetId: string,
    //example: 대상ID(등록/수정 시 필요)
    filterId: string,
    //example: 필터ID
    columnName: string,
    //Pattern: [\w-]+
    //example: 컬럼명
    columnDataTypeCode: string,
    //example: 컬럼데이터타입코드
    operator: string,
    //example: 연산자
    operand1: string,
    //Pattern: (?i)((?!select|from|delete|update|merge|insert|create|union|drop|/\*|--).)*
    //example: 피연산자1
    operand2: string,
    //Pattern: (?i)((?!select|from|delete|update|merge|insert|create|union|drop|/\*|--).)*
    //example: 피연산자2
    frstRegDttm: string,
    //example: 최초등록 일시: default=CURRENT_TIMESTAMP
    frstRegUserId: string,
    //example: 최초등록 사용자ID
    lastUpdDttm: string,
    //example: 최종수정 일시
    lastUpdUserId: string,
    //example: 최종수정 사용자ID
    delimiter: string,
    //example: 구분자
    operand3: string,
    //Pattern: (?i)((?!select|from|delete|update|merge|insert|create|union|drop|/\*|--).)*
    //example: 피연산자3
    operand4: string,
    //Pattern: (?i)((?!select|from|delete|update|merge|insert|create|union|drop|/\*|--).)*
    //example: 피연산자4
    operand5: string,
    //Pattern: (?i)((?!select|from|delete|update|merge|insert|create|union|drop|/\*|--).)*
    //example: 피연산자5
    operand6: string,
    //Pattern: (?i)((?!select|from|delete|update|merge|insert|create|union|drop|/\*|--).)*
    //example: 피연산자6
    function: string,
    //example: 변환식 함수
    variable1: string,
    //example: 변수1
    variable2: string,
    //example: 변수2
    variable3: string,
    //example: 변수3
}

export interface TbRsCustFeatRuleCase {
    //Required: caseId,result,whenYn
    id: number,
    custFeatRuleId: string,
    //example: Customer Feature Rule ID
    caseId: string,
    //example: Case ID
    whenYn: string,
    //Pattern: [YN]
    //example: When or Else
    targetFormula: string,
    //Pattern: (?i)((?!select|from|delete|update|merge|insert|create|union|drop|/\*|--).)*
    //example: 대상식
    operator: string,
    //example: 연산자
    delimiter: string,
    //example: 구분자
    operand1: string,
    //Pattern: (?i)((?!select|from|delete|update|merge|insert|create|union|drop|/\*|--).)*
    //example: 피연산자1
    operand2: string,
    //Pattern: (?i)((?!select|from|delete|update|merge|insert|create|union|drop|/\*|--).)*
    //example: 피연산자2
    operand3: string,
    //Pattern: (?i)((?!select|from|delete|update|merge|insert|create|union|drop|/\*|--).)*
    //example: 피연산자3
    operand4: string,
    //Pattern: (?i)((?!select|from|delete|update|merge|insert|create|union|drop|/\*|--).)*
    //example: 피연산자4
    operand5: string,
    //Pattern: (?i)((?!select|from|delete|update|merge|insert|create|union|drop|/\*|--).)*
    //example: 피연산자5
    operand6: string,
    //Pattern: (?i)((?!select|from|delete|update|merge|insert|create|union|drop|/\*|--).)*
    //example: 피연산자6
    result: string,
    //Pattern: (?i)((?!select|from|delete|update|merge|insert|create|union|drop|/\*|--).)*
    //example: 결과값
    frstRegDttm: string,
    //example: 최초등록 일시: default=CURRENT_TIMESTAMP
    frstRegUserId: string,
    //example: 최초등록 사용자ID
    lastUpdDttm: string,
    //example: 최종수정 일시
    lastUpdUserId: string,
    //example: 최종수정 사용자ID
}