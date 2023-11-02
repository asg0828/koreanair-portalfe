import { RowsInfo } from "@/models/components/Table";

export interface TargetDropListProps {
    featStatus: string
    setIsSelectAggregateTop?: React.Dispatch<React.SetStateAction<Boolean>>
    targetList: Array<TbRsCustFeatRuleTrgt>
    trgtFilterList: Array<TbRsCustFeatRuleTrgtFilter>
    setTargetList: React.Dispatch<React.SetStateAction<Array<TbRsCustFeatRuleTrgt>>>
    setTrgtFilterList: React.Dispatch<React.SetStateAction<Array<TbRsCustFeatRuleTrgtFilter>>>
}

export interface TargetDropProps {
    itemIdx: number
    isPossibleEdit: Boolean
    setIsSelectAggregateTop?: React.Dispatch<React.SetStateAction<Boolean>>
    targetItem: TbRsCustFeatRuleTrgt
    trgtFilterList?: Array<TbRsCustFeatRuleTrgtFilter>
    setTargetList?: React.Dispatch<React.SetStateAction<Array<TbRsCustFeatRuleTrgt>>>
    setTrgtFilterList?: React.Dispatch<React.SetStateAction<Array<TbRsCustFeatRuleTrgtFilter>>>
    delTargetInfo: (delIdx: number, delTrgtId: string) => void
}

export interface TargetDropFilterProps {
    itemIdx: number
    isPossibleEdit: Boolean
    trgtFilterItem: TbRsCustFeatRuleTrgtFilter
    setTrgtFilterList: React.Dispatch<React.SetStateAction<Array<TbRsCustFeatRuleTrgtFilter>>>
    deleteTrgtFilterInfo: (idx: number) => void
}

export interface TargetDragProps {
    attrTblClmnInfo?: Attribute
    behvTblClmnInfo?: TbCoMetaTblClmnInfo
}

export interface FeatCalcValidProps {
    featStatus: string 
    setIsValidFormula?: React.Dispatch<React.SetStateAction<Boolean>>
    formulaTrgtList: Array<string>
    custFeatRuleCalc: TbRsCustFeatRuleCalc 
    custFeatRuleCaseList:  Array<TbRsCustFeatRuleCase>
    setCustFeatRuleCalc:  React.Dispatch<React.SetStateAction<TbRsCustFeatRuleCalc>>
    setCustFeatRuleCaseList:  React.Dispatch<React.SetStateAction<Array<TbRsCustFeatRuleCase>>>
}

export interface FormulaCaseProps {
    isPossibleEdit: Boolean
    index?: number
    lastIdx?: number
    custFeatRuleCalc?: TbRsCustFeatRuleCalc
    custFeatRuleCase?: TbRsCustFeatRuleCase
    setCustFeatRuleCalc?: React.Dispatch<React.SetStateAction<TbRsCustFeatRuleCalc>>
    setCustFeatRuleCaseList?: React.Dispatch<React.SetStateAction<Array<TbRsCustFeatRuleCase>>>
    setIsValidFormula: React.Dispatch<React.SetStateAction<Boolean>>
    formulaTrgtList: Array<string>
}

export interface TransFuncProps {
    isOpen?: boolean
    onClose?: (isOpen: boolean) => void
    isPossibleEdit?: Boolean
    itemIdx: number
    trgtItem: TbRsCustFeatRuleTrgt | TbRsCustFeatRuleTrgtFilter
    setTargetList?: React.Dispatch<React.SetStateAction<Array<TbRsCustFeatRuleTrgt>>>
    setTrgtFilterList?: React.Dispatch<React.SetStateAction<Array<TbRsCustFeatRuleTrgtFilter>>>
    setTransFuncChecked?: React.Dispatch<React.SetStateAction<boolean>>
    isOpenPopApply?: Boolean
    setIsOpenPopApply?: React.Dispatch<React.SetStateAction<Boolean>>
}

export interface MstrSgmtTableandColMetaInfo {
    [key: string]: string | Array<Behavior> | Array<Attribute>
    rslnRuleId: string,
    behaviors: Array<Behavior>,
    attributes: Array<Attribute>
}

export interface Behavior {
    [key: string]: string | TbCoMetaTbInfo | Array<TbCoMetaTblClmnInfo>
    //Required: tbCoMetaTblClmnInfoList
    metaTblId: string,
    metaTblLogiNm: string,
    tbCoMetaTbInfo: TbCoMetaTbInfo,
    tbCoMetaTblClmnInfoList: Array<TbCoMetaTblClmnInfo>,
    rtmTblYn: string,
}

export interface TbCoMetaTbInfo {
    [key: string]: string
    //Required: dbNm,metaTblDesc,metaTblDvCd,metaTblLogiNm,metaTblPhysNm
    metaTblId: string,
    metaTblPhysNm: string,
    //example: 메타테이블물리명
    metaTblLogiNm: string,
    //example: 메타테이블논리명
    metaTblDesc: string,
    //example: 메타테이블설명
    dbNm: string,
    //example: 데이터베이스명
    dataClaCd: string,
    //example: 데이터계층코드
    dataSrcDvCd: string,
    //example: 데이터원천구분코드(행동/Legacy)
    keepCylcCd: string,
    //example: 보관주기코드, default = A
    metaTblUseYn: string,
    //Pattern: Y|N
    //example: 메타테이블 사용여부, default = Y
    metaTblDvCd: string,
    //example: 메타테이블구분코드(ATTR/BEHV)
    rtmTblYn: string,
    //Pattern: Y|N
    //example: 메타테이블 사용여부, default = N
    topicId: string,
    //example: 토픽 ID
    frstRegDttm: string,
    //example: 등록일시
    frstRegUserId: string,
    //example: 등록자 id
    lastUpdDttm: string,
    //example: 수정일시
    lastUpdUserId: string,
    //example: 수정자 id
}

export interface TbCoMetaTblClmnInfo {
    [key: string]: string | number
    rtmTblYn: string,
    metaTblId: string,
    metaTblClmnId: string,
    metaTblClmnPhysNm: string,
    //example: 메타테이블컬럼물리명
    metaTblClmnLogiNm: string,
    //example: 메타테이블컬럼논리명
    metaTblClmnDesc: string,
    //example: 메타테이블컬럼설명
    dtpCd: string,
    //example: 데이터타입코드
    dtpLenVal: string,
    //example: 데이터타입길이값
    pkYn: string,
    //example: pk여부
    nullYn: string,
    //example: NULL 가능여부
    defltVal: string,
    //example: Default 값
    clmnUseYn: string,
    //example: 컬럼사용여부
    clmnSortOrd: number,
    frstRegDttm: string,
    //example: 등록일시
    frstRegUserId: string,
    //example: 등록자 id
    lastUpdDttm: string,
    //example: 수정일시
    lastUpdUserId: string,
    //example: 수정자 id
    chgDtpCd: string,
    //example: 변환 데이터타입 코드
    dataFormat: string,
    //example: 데이터 포멧
    baseTimeYn: string,
    //Pattern: [Y|N]
    //example: 기준 시간 여부 = Y
    maskingRuleCd: string,
    //example: 마스킹룰 구분코드
    dataTypeCategory: string,
    //example: 데이터 타입 유형
}

export interface Attribute {
    [key: string]: string | number
    rtmTblYn: string,
    metaTblId: string,
    metaTblClmnId: string,
    metaTblClmnPhysNm: string,
    //example: 메타테이블컬럼물리명
    metaTblClmnLogiNm: string,
    //example: 메타테이블컬럼논리명
    metaTblClmnDesc: string,
    //example: 메타테이블컬럼설명
    dtpCd: string,
    //example: 데이터타입코드
    dtpLenVal: string,
    //example: 데이터타입길이값
    pkYn: string,
    //example: pk여부
    nullYn: string,
    //example: NULL 가능여부
    defltVal: string,
    //example: Default 값
    clmnUseYn: string,
    //example: 컬럼사용여부
    clmnSortOrd: number,
    frstRegDttm: string,
    //example: 등록일시
    frstRegUserId: string,
    //example: 등록자 id
    lastUpdDttm: string,
    //example: 수정일시
    lastUpdUserId: string,
    //example: 수정자 id
    chgDtpCd: string,
    //example: 변환 데이터타입 코드
    dataFormat: string,
    //example: 데이터 포멧
    baseTimeYn: string,
    //Pattern: [Y|N]
    //example: 기준 시간 여부 = Y
    maskingRuleCd: string,
    //example: 마스킹룰 구분코드
    dataTypeCategory: string,
    //example: 데이터 타입 유형
}

export interface FormulaValidRslt {
    [key: string]: string | Boolean
    isValidFormula: Boolean, 
    text: string,
}

//Required: tbRsCustFeatRule,tbRsCustFeatRuleCalc
export interface FeatureInfo {
    [key: string]: TbRsCustFeatRule | TbRsCustFeatRuleCalc | Array<TbRsCustFeatRuleTrgt> | Array<TbRsCustFeatRuleTrgtFilter> | Array<TbRsCustFeatRuleCase>
    //Required: category,description,mstrSgmtRuleId,name,useYn
    tbRsCustFeatRule: TbRsCustFeatRule,//기본정보
    tbRsCustFeatRuleCalc: TbRsCustFeatRuleCalc,//계산식
    //대상선택정보
    tbRsCustFeatRuleTrgtList: Array<TbRsCustFeatRuleTrgt>,
    tbRsCustFeatRuleTrgtFilterList: Array<TbRsCustFeatRuleTrgtFilter>,
    tbRsCustFeatRuleCaseList: Array<TbRsCustFeatRuleCase>,
}

export interface TbRsCustFeatRule extends RowsInfo {
    [key: string]: string | number
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
    [key: string]: string | number
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
    [key: string]: string | number
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
    //Pattern: ALL|ANY|CUS example: 필터옵션(ALL/ANY/CUS)-행동데이터
    filterLogiOption: string,
    //example: 필터논리표현식(A and B 등등)-행동데이터
    filterLogiExpsn: string,
    //example: 연산자-행동데이터(집계함수)
    operator: string,
    //Pattern: (?i)((?!select|from|delete|update|merge|insert|create|union|drop|/\*|--).)* example: 피연산자1(Top연산자의 경우)
    operand1: string,
    //Pattern: [\w-]+ example: 컬럼명-속성데이터의 컬럼명 / 행동데이터의 집계대상컬럼명
    columnName: string,
    //example: 최초등록 일시: default=CURRENT_TIMESTAMP
    frstRegDttm: string,
    //example: 최초등록 사용자ID
    frstRegUserId: string,
    //example: 최종수정 일시
    lastUpdDttm: string,
    //example: 최종수정 사용자ID
    lastUpdUserId: string,
    //Pattern: (?i)((?!select|from|delete|update|merge|insert|create|union|drop|/\*|--).)* example: 피연산자2(Top연산자의 경우)
    operand2: string,
    //Pattern: (?i)((?!select|from|delete|update|merge|insert|create|union|drop|/\*|--).)* example: 피연산자3(Top연산자의 경우)
    operand3: string,
    //Pattern: (?i)((?!select|from|delete|update|merge|insert|create|union|drop|/\*|--).)* example: 피연산자4(Top연산자의 경우)
    operand4: string,
    //example: 변환식 함수(팝업)-속성데이터
    function: string,
    //example: 변수1(팝업)-속성데이터
    variable1: string,
    //example: 변수2(팝업)-속성데이터
    variable2: string,
    //example: 변수3(팝업)-속성데이터
    variable3: string,
    //example: 대상 데이터 타입
    targetDataType: string,
}

export interface TbRsCustFeatRuleTrgtFilter {
    [key: string]: string | number
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
    //example: 구분자(연산자의 In/not in 선택시 select box)
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
    //example: 변환식 함수(팝업에 필요한 항목)행동데이터
    variable1: string,
    //example: 변수1(팝업에 필요한 항목)행동데이터
    variable2: string,
    //example: 변수2(팝업에 필요한 항목)행동데이터
    variable3: string,
    //example: 변수3(팝업에 필요한 항목)행동데이터
}

export interface TbRsCustFeatRuleCase {
    [key: string]: string | number
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
    //example: 구분자(연산자가 in / not in 인 경우)
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
// Feature 선후행 관계
export interface FeatPrntCild extends RowsInfo {
    [key: string]: string
    id: string,
    name: string,
    submissionStatus: string,
    parentIds: string,
    parentNames: string,
    childIds: string,
    childNames: string,
}
// 샘플 확인
export interface FeatSampleData extends RowsInfo {
    [key: string]: string
    cf_value: string,
    rsln_id: string,
}
// 쿼리 실행 내역
export interface BatchExecuteLog extends RowsInfo {
    [key: string]: string
    batType: string,
    ruleId: string,
    ruleNm: string,
    startTime: string,
    endTime: string,
    execTime: string,
    rsltCnt: string,
    pgmNm: string,
    execVersion: string,
    batchResultStatus: string,
    schdId: string,
    schdNm: string,
}
// 쿼리 확인
export interface ReadSql {
    [key: string]: string
    sql: string
}