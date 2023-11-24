// 계산식 validation 공통
import { cloneDeep } from "lodash"

import { CustFeatureFormData, FormulaTrgtListProps, FormulaValidRslt } from "@/models/selfFeature/FeatureModel"
import { initFormulaValidRslt } from "@/pages/user/self-feature/data"
import { ColDataType } from "@/models/selfFeature/FeatureCommon"
import { SfSubmissionApproval } from "@/models/selfFeature/FeatureSubmissionModel"

/*
    사칙연산 or Target ID를 확인해 주세요.
    [TargetID]는 존재하지 않는 Target ID 입니다.
    괄호가 올바르게 열리고 닫히지 않았습니다.
*/

export interface Props {
    formula: string
    targetList: Array<string>
    formulaTrgtList: Array<FormulaTrgtListProps>
}

export const ValidationFormula = ({
    formula,
    targetList,
    formulaTrgtList,
}: Props) => {

    let validRslt: FormulaValidRslt = cloneDeep(initFormulaValidRslt)

    /*
        입력한 target ID 존재 여부 체크
    */
    const targetIdExistCheck = () => {
        let str = cloneDeep(formula).replace(/[^T0-9]/g, '')

        if (!/^T/g.test(str)) {
            validRslt.isValidFormula = false
            validRslt.text = `사칙연산 or Target ID를 확인해 주세요.`
            return false
        }

        let inputTrgtIdList = str.split('T')

        if (inputTrgtIdList.length === 1) {
            validRslt.isValidFormula = false
            validRslt.text = `사칙연산 or Target ID를 확인해 주세요.`
            return false
        }
        
        for (let i = 0; i < inputTrgtIdList.length; i++) {
            
            if (inputTrgtIdList[i] === "") continue

            let chkTrgt = `T${inputTrgtIdList[i]}`
            if (targetList.indexOf(chkTrgt) < 0) {
                validRslt.isValidFormula = false
                validRslt.text = `[ ${chkTrgt} ]는 존재하지 않는 Target ID 입니다.`
                return false
            }
        }

        return true
    }
    /* 
        괄호 체크
    */
    const parenthesisCheck = () => {
        let str = cloneDeep(formula).replace(/[^()]/g, '')
        let cum = 0
        for (let paren of str) {
            cum += paren === '('? 1: -1
            if(cum < 0) {
                return false
            }
        }
        return cum === 0? true: false;
    }
    /*
        사칙연산 dataType 체크
    */
    const dataTypeCheck = () => {

        let inptTrgtList = formula.replace(/[^0-9T]/g, "").split("T")
        inptTrgtList.splice(0, 1)
        inptTrgtList = inptTrgtList.map((v) => "T"+v)

        if (inptTrgtList.length === 1) return true

        let notNumDtpTrgtList = formulaTrgtList.filter((ft: FormulaTrgtListProps) => ft.dataType !== ColDataType.NUM)
        
        let inptTrgtNotNumList = notNumDtpTrgtList.filter((ft: FormulaTrgtListProps) => {
            return inptTrgtList.some(target => ft.targetId === target)
        })
        
        return inptTrgtNotNumList.length > 0 ? false : true
    }

    if (formula === "") {
        validRslt = cloneDeep(initFormulaValidRslt)
        return validRslt
    } else if (!/^(\s)*$|^(\(*\s*[T|t]{1}[0-9]+\s*\)*)(\s*[+\-*/]{1}(\s*\(*[T|t]{1}[0-9]+\s*\)*))*$/.test(formula)) {
        /*
            사칙연산 check
        */
        validRslt.isValidFormula = false

        if (validRslt.text === '') {
            validRslt.text = `사칙연산 or Target ID를 확인해 주세요.`
        }
        
    } else if (!targetIdExistCheck()) {
        /*
            입력한 target ID 존재 여부 체크
        */
        return validRslt
    } else if (!parenthesisCheck()) {
        /* 
            괄호 체크
        */
        validRslt.isValidFormula = false
        validRslt.text = `괄호가 올바르게 열리고 닫히지 않았습니다.`
        return validRslt
    } else if (!dataTypeCheck()) {
        validRslt.isValidFormula = false
        validRslt.text = `사칙연산에 사용되는 dataType은 number 타입만 가능합니다.`
        return validRslt
    } else {
        validRslt.isValidFormula = true
        validRslt.text = ''
    }

    return validRslt

}
// 변환식 팝업 변환식 string 설정
export interface TransFuncCalcProps {
    funcType: string
    var1: string
    var2: string
    var3: string
    colNm: string
    setFuncStr: React.Dispatch<React.SetStateAction<string>>
}

export const transFuncCalcStr = ({
    funcType,
    var1,
    var2,
    var3,
    colNm,
    setFuncStr,
}: TransFuncCalcProps) => {
    let rtnStr = `${funcType}(${colNm}`

    if (funcType === "NVL") {

        if (var1 === "") rtnStr += ', [대체값])'
        else rtnStr += `, [${var1}])`

    } else if (funcType === "SUBSTRING") {

        if (var1 === "") rtnStr += ', [시작위치]'
        else rtnStr += `, [${var1}]`

        if (var2 === "") rtnStr += ', [길이])'
        else rtnStr += `, [${var2}])`
        
    } else if (funcType === "LENGTH") {
        rtnStr += ')'
    } else if (funcType === "CONCAT") {

        if (var1 === "") rtnStr += ', [컬럼1]'
        else rtnStr += `, [${var1}]`

        if (var2 === "") rtnStr += ', [컬럼2])'
        else rtnStr += `, [${var2}]`

        if (var3 === "") rtnStr += ', [컬럼3])'
        else rtnStr += `, [${var3}])`

    } else if (funcType === "TO_NUMBER") {
        rtnStr += ')'
    } else if (funcType === "TO_CHAR") {

        if (var1 === "") rtnStr += ', [형식])'
        else rtnStr += `, [${var1}])`

    } else if (funcType === "DATEADD") {

        if (var1 === "") rtnStr += ', [형식]'
        else rtnStr += `, [${var1}]`

        if (var2 === "") rtnStr += ', [숫자])'
        else rtnStr += `, [${var2}])`

    } else if (funcType === "DATEDIFF") {

        if (var1 === "") rtnStr += ', [형식]'
        else rtnStr += `, [${var1}]`

        if (var2 === "") rtnStr += ', [시작 일자]'
        else rtnStr += `, [${var2}]`

        if (var3 === "") rtnStr += ', [종료 일자])'
        else rtnStr += `, [${var3}])`

    } else {
        rtnStr = ""
    }

    setFuncStr(rtnStr)

}

export const validationCustReatRule = (formData: CustFeatureFormData) => {
    let validInfo = { text: "", valid: true }
    
    if (formData.customerFeature.featureTemp.featureSeGrp === "") {
        validInfo.text = "대구분을 확인 해주세요."
        validInfo.valid = false
    } else if (formData.customerFeature.featureTemp.featureSe === "") {
        validInfo.text = "중구분을 확인 해주세요."
        validInfo.valid = false
    } else if (formData.customerFeature.featureTemp.featureKoNm === "") {
        validInfo.text = "한글명을 확인 해주세요."
        validInfo.valid = false
    } else if (formData.customerFeature.featureTemp.featureEnNm === "") {
        validInfo.text = "영문명을 확인 해주세요."
        validInfo.valid = false
    } else if (formData.customerFeature.featureTemp.featureTyp === "") {
        validInfo.text = "Feature 타입을 확인 해주세요."
        validInfo.valid = false
    } else if (formData.customerFeature.featureTemp.featureDef === "") {
        validInfo.text = "Feature 정의를 확인 해주세요."
        validInfo.valid = false
    } else if (formData.customerFeature.featureTemp.featureFm === "") {
        validInfo.text = "산출 로직을 확인 해주세요."
        validInfo.valid = false
    }

    if (validInfo.valid) {
        formData.submissionInfo.approvals.map((approval: SfSubmissionApproval) => {
            if (!approval.approver || approval.approver === "") {
                validInfo.text = "결재선을 확인 해주세요."
                validInfo.valid = false
            }
            return approval
        })
    }

    return validInfo
}
