// 계산식 validation 공통
import { cloneDeep } from "lodash"

import { CustFeatureFormData, CustFeatureFormDataSql, DivisionTypes, FormulaTrgtListProps, FormulaValidRslt, TbRsCustFeatRuleTrgt, TbRsCustFeatRuleTrgtFilter } from "@/models/selfFeature/FeatureModel"
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
            cum += paren === '(' ? 1 : -1
            if (cum < 0) {
                return false
            }
        }
        return cum === 0 ? true : false;
    }
    /*
        사칙연산 dataType 체크
    */
    const dataTypeCheck = () => {

        let inptTrgtList = formula.replace(/[^0-9T]/g, "").split("T")
        inptTrgtList.splice(0, 1)
        inptTrgtList = inptTrgtList.map((v) => "T" + v)

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
        else rtnStr += `, ${var1})`

    } else if (funcType === "SUBSTRING") {

        if (var1 === "") rtnStr += ', [시작위치]'
        else rtnStr += `, ${var1}`

        if (var2 === "") rtnStr += ', [길이])'
        else rtnStr += `, ${var2})`

    } else if (funcType === "LENGTH") {
        rtnStr += ')'
    } else if (funcType === "CONCAT") {

        if (var1 !== "" && var2 !== "" && var3 !== "") {
            rtnStr += `, ${var1}, ${var2}, ${var3})`
        } else if (var1 !== "" && var2 !== "" && var3 === "") {
            rtnStr += `, ${var1}, ${var2})`
        } else if (var1 !== "" && var2 === "" && var3 !== "") {
            rtnStr += `, ${var1}, ${var3})`
        } else if (var1 !== "" && var2 === "" && var3 === "") {
            rtnStr += `, ${var1})`
        } else if (var1 === "" && var2 !== "" && var3 !== "") {
            rtnStr += `, ${var2}, ${var3})`
        } else if (var1 === "" && var2 !== "" && var3 === "") {
            rtnStr += `, ${var2})`
        } else if (var1 === "" && var2 === "" && var3 !== "") {
            rtnStr += `, ${var3})`
        } else {
            rtnStr += `)`
        }

    } else if (funcType === "TO_NUMBER") {
        rtnStr += ')'
    } else if (funcType === "TO_CHAR") {

        if (var1 === "") rtnStr += ', [단위])'
        else rtnStr += `, ${var1})`

    } else if (funcType === "DATEADD") {

        if (var1 === "") rtnStr += ', [단위]'
        else rtnStr += `, ${var1}`

        if (var2 === "") rtnStr += ', [숫자])'
        else rtnStr += `, ${var2})`

    } else if (funcType === "DATEDIFF") {
        rtnStr = `${funcType}(`

        if (var1 === "") rtnStr += '[단위]'
        else rtnStr += `${var1}`

        if (var2 === "") rtnStr += ', [시작 일자]'
        else rtnStr += `, ${var2}`

        if (var3 === "") rtnStr += ', [종료 일자])'
        else rtnStr += `, ${var3})`

    } else {
        rtnStr = ""
    }

    setFuncStr(rtnStr)

}

export const validationCustReatRule = (formData: any) => {
    let validInfo = { text: "", valid: true }

    let featureInfo: any
    if (formData.hasOwnProperty('customerFeature')) featureInfo = formData.customerFeature
    else featureInfo = formData.customerFeatureSql

    if (
        !featureInfo.featureTemp.featureSeGrp
        || featureInfo.featureTemp.featureSeGrp === ""
        || featureInfo.featureTemp.featureSeGrp === "null"
    ) {
        validInfo.text = "대구분을 확인 해주세요."
        validInfo.valid = false
    } else if (
        !featureInfo.featureTemp.featureSe
        || featureInfo.featureTemp.featureSe === ""
        || featureInfo.featureTemp.featureSe === "null"
    ) {
        validInfo.text = "중구분을 확인 해주세요."
        validInfo.valid = false
    } else if (
        !featureInfo.featureTemp.featureKoNm
        || featureInfo.featureTemp.featureKoNm === ""
        || featureInfo.featureTemp.featureKoNm === "null"
    ) {
        validInfo.text = "한글명을 확인 해주세요."
        validInfo.valid = false
    } else if (
        !featureInfo.featureTemp.featureEnNm
        || featureInfo.featureTemp.featureEnNm === ""
        || featureInfo.featureTemp.featureEnNm === "null"
    ) {
        validInfo.text = "영문명을 확인 해주세요."
        validInfo.valid = false
    } else if (
        !featureInfo.featureTemp.featureTyp
        || featureInfo.featureTemp.featureTyp === ""
        || featureInfo.featureTemp.featureTyp === "null"
    ) {
        validInfo.text = "Feature 타입을 확인 해주세요."
        validInfo.valid = false
    } else if (
        !featureInfo.featureTemp.featureDef
        || featureInfo.featureTemp.featureDef === ""
    ) {
        validInfo.text = "Feature 정의를 확인 해주세요."
        validInfo.valid = false
    } else if (
        !featureInfo.featureTemp.featureFm
        || featureInfo.featureTemp.featureFm === ""
    ) {
        validInfo.text = "산출 로직을 확인 해주세요."
        validInfo.valid = false
    }

    if (validInfo.valid) {
        // Rule-Design
        if (featureInfo.tbRsCustFeatRule.sqlDirectInputYn === "N") {
            if (featureInfo.tbRsCustFeatRuleTrgtList.length < 1) {
                validInfo.text = `Feature 로직의 대상을 1개 이상 설정 해주세요.`
                validInfo.valid = false
            } else {
                featureInfo.tbRsCustFeatRuleTrgtList.map((target: TbRsCustFeatRuleTrgt) => {
                    if (target.divisionCode === DivisionTypes.BEHV) {
                        if (!target.columnName || target.columnName === "" || target.columnName === "null" || target.columnName === "undefined") {
                            validInfo.text = `BaseFact 정보 '${target.targetId}'의 집계할 컬럼을 확인 해주세요.`
                            validInfo.valid = false
                        } else if (!target.operator || target.operator === "" || target.operator === "null" || target.operator === "undefined") {
                            validInfo.text = `BaseFact 정보 '${target.targetId}'의 집계할 함수를 확인 해주세요.`
                            validInfo.valid = false
                        }
                        if (
                            target.operator === "top"
                            && (
                                (!target.operand1 || target.operand1 === "" || target.operand1 === "null" || target.operand1 === "undefined")
                                || (!target.operand2 || target.operand2 === "" || target.operand2 === "null" || target.operand2 === "undefined")
                                || (!target.operand3 || target.operand3 === "" || target.operand3 === "null" || target.operand3 === "undefined")
                                || (!target.operand4 || target.operand4 === "" || target.operand4 === "null" || target.operand4 === "undefined")
                            )
                        ) {
                            validInfo.text = `BaseFact 정보(SELECT) '${target.targetId}'의 피연산자를 확인 해주세요.`
                            validInfo.valid = false
                        }
                    }
                    return target
                })
            }
            if (validInfo.valid) {
                featureInfo.tbRsCustFeatRuleTrgtFilterList.map((target: TbRsCustFeatRuleTrgtFilter) => {
                    if (!target.operator || target.operator === "" || target.operator === "null" || target.operator === "undefined") {
                        validInfo.text = `BaseFact 정보(WHERE) '${target.columnLogiName}'의 연산자를 확인 해주세요.`
                        validInfo.valid = false
                    }
                    if (
                        (target.operator === "in_str" || target.operator === "not_in_str" || target.operator === "in_num" || target.operator === "not_in_num")
                        && (!target.delimiter || target.delimiter.trim() === "" || target.delimiter === "null" || target.delimiter === "undefined")
                    ) {
                        validInfo.text = `BaseFact 정보(WHERE) '${target.columnLogiName}'의 구분자를 확인 해주세요.`
                        validInfo.valid = false
                    } else if ((!target.operand1 || target.operand1 === "" || target.operand1 === "null" || target.operand1 === "undefined")) {
                        validInfo.text = `BaseFact 정보(WHERE) '${target.columnLogiName}'의 피연산자를 확인 해주세요.`
                        validInfo.valid = false
                    }
                    if (
                        (target.operator === "before" || target.operator === "after")
                        && target.operand1 === "date"
                        && (!target.operand2 || target.operand2 === "" || target.operand2 === "null" || target.operand2 === "undefined")
                    ) {
                        validInfo.text = `BaseFact 정보(WHERE) '${target.columnLogiName}'의 피연산자를 확인 해주세요.`
                        validInfo.valid = false
                    }
                    if (
                        (target.operator === "before" || target.operator === "after")
                        && target.operand1 === "now"
                        && (
                            (!target.operand2 || target.operand2 === "" || target.operand2 === "null" || target.operand2 === "undefined")
                            || (!target.operand3 || target.operand3 === "" || target.operand3 === "null" || target.operand3 === "undefined")
                        )
                    ) {
                        validInfo.text = `BaseFact 정보(WHERE) '${target.columnLogiName}'의 피연산자를 확인 해주세요.`
                        validInfo.valid = false
                    }
                    if (target.operator === "between") {
                        if (
                            target.operand1 === "date"
                            && (!target.operand2 || target.operand2 === "" || target.operand2 === "null" || target.operand2 === "undefined")
                        ) {
                            validInfo.text = `BaseFact 정보(WHERE) '${target.columnLogiName}'의 피연산자를 확인 해주세요.`
                            validInfo.valid = false
                        }
                        if (
                            target.operand1 === "now"
                            && (
                                (!target.operand2 || target.operand2 === "" || target.operand2 === "null" || target.operand2 === "undefined")
                                || (!target.operand3 || target.operand3 === "" || target.operand3 === "null" || target.operand3 === "undefined")
                            )
                        ) {
                            validInfo.text = `BaseFact 정보(WHERE) '${target.columnLogiName}'의 피연산자를 확인 해주세요.`
                            validInfo.valid = false
                        }
                        if (
                            target.operand1 === "date"
                            && (!target.operand5 || target.operand5 === "" || target.operand5 === "null" || target.operand5 === "undefined")
                        ) {
                            validInfo.text = `BaseFact 정보(WHERE) '${target.columnLogiName}'의 피연산자를 확인 해주세요.`
                            validInfo.valid = false
                        }
                        if (
                            target.operand1 === "now"
                            && (
                                (!target.operand5 || target.operand5 === "" || target.operand5 === "null" || target.operand5 === "undefined")
                                || (!target.operand6 || target.operand6 === "" || target.operand6 === "null" || target.operand6 === "undefined")
                            )
                        ) {
                            validInfo.text = `BaseFact 정보(WHERE) '${target.columnLogiName}'의 피연산자를 확인 해주세요.`
                            validInfo.valid = false
                        }
                    }
                    return target
                })
            }
        }
        // SQL
        if (featureInfo.tbRsCustFeatRule.sqlDirectInputYn === "Y") {

            if (featureInfo.featureTemp.enrUserId === "" || featureInfo.featureTemp.enrUserNm === "") {
                validInfo.text = "Feature 신청자 정보를 확인 해주세요."
                validInfo.valid = false
            } else if (featureInfo.featureTemp.enrDeptCode === "" || featureInfo.featureTemp.enrDeptNm === "") {
                validInfo.text = "Feature 신청자 부서를 확인 해주세요."
                validInfo.valid = false
            } else if (!featureInfo.tbRsCustFeatRuleSql.sqlQuery || featureInfo.tbRsCustFeatRuleSql.sqlQuery === "") {
                validInfo.text = "Feature 생성 Query를 확인 해주세요."
                validInfo.valid = false
            }
        }

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
