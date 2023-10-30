// 계산식 validation 공통
import { cloneDeep } from "lodash"

import { FormulaValidRslt } from "@/models/selfFeature/FeatureInfo"
import { initFormulaValidRslt } from "@/pages/user/self-feature/data"

/*
    사칙연산 or Target ID를 확인해 주세요.
    [TargetID]는 존재하지 않는 Target ID 입니다.
    괄호가 올바르게 열리고 닫히지 않았습니다.
*/
export const ValidationFormula = (props: any) => {

    let validRslt: FormulaValidRslt = cloneDeep(initFormulaValidRslt)

    const targetIdExistCheck = () => {
        let str = cloneDeep(props.formula).replace(/[^T0-9]/g, '')

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
            if (props.targetList.indexOf(chkTrgt) < 0) {
                validRslt.isValidFormula = false
                validRslt.text = `[ ${chkTrgt} ]는 존재하지 않는 Target ID 입니다.`
                return false
            }
        }

        return true
    }

    const parenthesisCheck = () => {
        let str = cloneDeep(props.formula).replace(/[^()]/g, '')
        let cum = 0
        for (let paren of str) {
            cum += paren === '('? 1: -1
            if(cum < 0) {
                return false
            }
        }
        return cum === 0? true: false;
    }

    const precedence = (s: string) => {
        if (s === '(' || s === ')') return 0
        else if (s === '+' || s === '-') return 1
        else if (s === '*' || s === '/') return 2
        else return 4
    }
    
    const isCalc = (s: string) => {
        if (s === '+' || s === '-' || s === '*' || s === '/') return true
        else return false
    }
    
    // 계산식 후위표기로 변환
    const transPostFix = (s: string) => {
    
        let answer = ""
        if (s.length < 1) return answer
    
        let stack = []
        s = s.replace(/[^()+\-*/0-9]/g, '')
    
        for (const t of s) {
            // (5*2)+(200+25)/2
            if (!isNaN(Number(t))) answer += t
            else if (t === '(') stack.push(t)
            else if (t === ')') {
                let op = stack.pop()
                while (stack.length > 0 && op !== '(') {
                    answer += ' ' + op
                    op = stack.pop()
                }
            } else if (isCalc(t)) {
                answer += ' '
                if (stack.length < 1) stack.push(t)
                else {
                    let op = stack[stack.length - 1]
                    if (precedence(t) <= precedence(op)) answer += stack.pop() + ' '
                    stack.push(t) 
                }
            } else answer = ''
    
        }
    
        while (stack.length !== 0 && answer !== '') answer += ' ' + stack.pop()
    
        return answer
    
    }
    // 후위표기 계산
    const formulaValid = (v: string) => {
        
        let result: number = -1
        let stack: Array<number> = []
    
        let vArr = transPostFix(v).split(' ')
    
        for (const t of vArr) {
            
            if (t === '') continue
    
            if (!isNaN(Number(t))) {
                stack.push(Number(t))
            } else {
                
                if (stack.length < 2 && !isCalc(t)) return Number('False')
    
                let r: number = Number(stack.pop())
                let l: number = Number(stack.pop())
                if (t === '+') stack.push(l + r)
                else if (t === '-') stack.push(l - r)
                else if (t === '*') stack.push(l * r)
                else if (t === '/') stack.push(l / r)
    
            }
    
        }
    
        if (stack.length < 1 ) return Number('False')
        
        result = Number(stack.pop())
        return result
    }
    
    if (props.formula === "") {
        validRslt = cloneDeep(initFormulaValidRslt)
        return validRslt
    } else if (isNaN(formulaValid(props.formula))) {
        validRslt.isValidFormula = false

        if (validRslt.text === '') {
            validRslt.text = `사칙연산 or Target ID를 확인해 주세요.`
        }
        
    } else if (/([^()+\-*/T0-9])+/g.test(props.formula)) {
        /* 
            잘못된 문자열 입력 체크
            변수할당이 아닌 정규식 그대로 적용
              -> 변수 할당시 이전 test의 lastindex를 가지고 있기 때문에 결과값이 다름
        */
        validRslt.isValidFormula = false
        validRslt.text = `사칙연산 or Target ID를 확인해 주세요.`
        return validRslt
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
    } else {
        validRslt.isValidFormula = true
        validRslt.text = ''
    }

    return validRslt

}

