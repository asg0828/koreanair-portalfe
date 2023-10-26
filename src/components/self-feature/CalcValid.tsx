import {Button, Checkbox, Stack, Typography} from '@components/ui'
import { useState } from 'react'

import { cloneDeep } from 'lodash'
import { TbRsCustFeatRuleCalc, TbRsCustFeatRuleCase } from '@/models/selfFeature/FeatureInfo'
import { initTbRsCustFeatRuleCase } from '@/pages/user/self-feature/data';
import CaseComponent from './CaseComponent';
import FormulaComponent from './FormulaComponent';

const ClacValid = (props: any) => {

    const [ formula, setFormula ] = useState<string>(cloneDeep(props.custFeatRuleCalc.formula))
    const [ formulaChecked, setFormulaChecked ] = useState(false)

    const validationFormula = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target

        setFormula(value.toUpperCase())

        let v = value.toUpperCase()

        if (isNaN(formulaValid(v))) {
            props.setIsValidFormula(false)
            return null
        }
        
        props.setIsValidFormula(true)
        props.setCustFeatRuleCalc((state: TbRsCustFeatRuleCalc) => {
            let rtn = cloneDeep(state)
            rtn.formula = v
            return rtn
        })
        
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
        s = s.replace(/ |T/g, '')

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

                let chkTrgt = `T${t}`
                if (props.formulaTrgtList.indexOf(chkTrgt) < 0) return Number('False')

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

    const onCheckedChange = () => {
        setFormulaChecked(!formulaChecked)

        if (!formulaChecked) {
            console.log("checked")
        } else {
            console.log("unchecked")
        }
    }

    const onClickAddRuleCaseHandler = () => {
        props.setCustFeatRuleCaseList((state: Array<TbRsCustFeatRuleCase>) => {
            let rtn = cloneDeep(state)
            let addRuleCase: TbRsCustFeatRuleCase = initTbRsCustFeatRuleCase
            addRuleCase.whenYn = "Y"
            rtn.push(addRuleCase)
            return rtn
        })
    }

    return (
        // check box 선택시 case문 조건 설정 항목 show/hide 필요
        <div className='flex row'>
            <Stack 
                direction="Horizontal"
                justifyContent="Start" 
                gap="MD" 
            >
                <Typography variant='h6'>CASE 사용</Typography>
                <Checkbox
                    checked={formulaChecked}
                    onCheckedChange={onCheckedChange}
                />
            </Stack>
            {!formulaChecked && 
                <FormulaComponent 
                    formula={formula}
                    validationFormula={validationFormula}
                    isValidFormula={props.isValidFormula}
                />}
            {formulaChecked &&
                <>
                <Stack 
                    direction="Horizontal"
                    justifyContent="Start" 
                    gap="MD" 
                >
                    <Typography variant='h6'>CASE</Typography>
                    <Button size="SM" onClick={onClickAddRuleCaseHandler}>
                        추가
                    </Button>
                </Stack>
                {props.custFeatRuleCaseList.map((ruleCase: TbRsCustFeatRuleCase, index: number) => {
                    return <CaseComponent
                        key={`ruleCase-${index}`}
                        index={index}
                        ruleCase={ruleCase}
                        validationFormula={validationFormula}
                        isValidFormula={props.isValidFormula}
                        setCustFeatRuleCaseList={props.setCustFeatRuleCaseList}
                        
                    />
                })}
                </>
            }
        </div>
    )
}

export default ClacValid