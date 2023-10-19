import { RowsInfo } from "@/models/components/Table";

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

export interface MstrSgmtTableandColMetaInfo {
    rslnRuleId: string,
    behaviors: [
        {
            //Required: tbCoMetaTblClmnInfoList
            metaTblId: string,
            metaTblLogiNm: string,
            tbCoMetaTbInfo: {
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
            },
            tbCoMetaTblClmnInfoList: [
                {
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
                },
            ],
            rtmTblYn: string,
        },
    ],
    attributes: [
        {
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
        },
    ]
}

//Required: tbRsCustFeatRule,tbRsCustFeatRuleCalc
export interface FeatureInfo {
    //Required: category,description,mstrSgmtRuleId,name,useYn
    tbRsCustFeatRule: TbRsCustFeatRule,//기본정보
    tbRsCustFeatRuleCalc: TbRsCustFeatRuleCalc,//계산식
    //대상선택정보
    tbRsCustFeatRuleTrgtList: Array<TbRsCustFeatRuleTrgt>,
    tbRsCustFeatRuleTrgtFilterList: Array<TbRsCustFeatRuleTrgtFilter>,
    tbRsCustFeatRuleCaseList: Array<TbRsCustFeatRuleCase>,
}

export interface TbRsCustFeatRule extends RowsInfo {
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