import {Button, Checkbox, Stack, Typography} from '@components/ui'
import { useEffect, useState } from 'react'

import { cloneDeep } from 'lodash'
import { 
    TbRsCustFeatRuleCalc, 
    TbRsCustFeatRuleCase, 
} from '@/models/selfFeature/FeatureInfo'
import { 
    initTbRsCustFeatRuleCase, 
    selfFeatPgPpNm, 
    subFeatStatus 
} from '@/pages/user/self-feature/data';
import CaseComponent from './CaseComponent';
import FormulaComponent from './FormulaComponent';

const ClacValid = (props: any) => {

    const [ isPossibleEdit, setIsPossibleEdit ] = useState<Boolean>(false)
    const [ formulaCaseChecked, setFormulaCaseChecked ] = useState(false)
    const [ elseSelected, setElseSelected ] = useState<Boolean>(false)

    // 수정가능 여부 판단
    useEffect(() => {
        // 등록, 품의저장인 상태이면서 상세페이지가 아닌 경우 수정가능
        if (
            (props.featStatus === subFeatStatus.REG 
            || props.featStatus === subFeatStatus.SUBREG )
            && props.featStatus !== selfFeatPgPpNm.DETL
        ) {
            setIsPossibleEdit(true)
        } else {
            setIsPossibleEdit(false)
        }

    }, [props.featStatus])

    // 수정시 case문 list 값에 따른 else 체크
    useEffect(() => {
        if (props.custFeatRuleCaseList.length < 1) return

        if (props.custFeatRuleCaseList.length > 1)
            setFormulaCaseChecked(true)

        for (let i = 0; i < props.custFeatRuleCaseList.length; i++) {
            if (props.custFeatRuleCaseList[i].whenYn === "N") {
                setElseSelected(true)
                break
            } else {
                setElseSelected(false)
            }
        }
    }, [props.custFeatRuleCaseList])

    // 계산식 validation 공통
    const validationFormula = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target

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
                // 없는 target을 입력한 경우
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

    // case문 사용 체크시
    const onCheckedCaseChange = () => {
        setFormulaCaseChecked(!formulaCaseChecked)

        if (!formulaCaseChecked) {
            //console.log("checked")
        } else {
            // case문 사용 체크 해제시 입력값 초기화
            props.setCustFeatRuleCaseList((state: TbRsCustFeatRuleCase) => {
                let rtn = [cloneDeep(initTbRsCustFeatRuleCase)]
                return rtn
            })

        }
    }
    // case문 구문 추가시
    const onClickAddRuleCaseHandler = () => {
        props.setCustFeatRuleCaseList((state: Array<TbRsCustFeatRuleCase>) => {
            let rtn = cloneDeep(state)
            let addRuleCase: TbRsCustFeatRuleCase = cloneDeep(initTbRsCustFeatRuleCase)
            rtn.push(addRuleCase)
            return rtn
        })
    }

    return (
        // check box 선택시 case문 조건 설정 항목 show/hide 필요
        <>
        <Stack
            direction="Horizontal"
            justifyContent="Start" 
            gap="MD" 
        >
            <Typography variant="h2">3. 계산식</Typography>
            <Typography variant='body2'>CASE 사용</Typography>
            <Checkbox
                disabled={!isPossibleEdit}
                checked={formulaCaseChecked}
                onCheckedChange={onCheckedCaseChange}
            />
        </Stack>
        <div className='flex row'>
            <Stack 
                direction="Horizontal"
                justifyContent="Start" 
                gap="MD" 
            >
            </Stack>
            {!formulaCaseChecked && 
                <FormulaComponent 
                    isPossibleEdit={isPossibleEdit}
                    custFeatRuleCalc={props.custFeatRuleCalc}
                    setCustFeatRuleCalc={props.setCustFeatRuleCalc}
                    validationFormula={validationFormula}
                />
            }
            {formulaCaseChecked &&
                <>
                <Stack 
                    direction="Horizontal"
                    justifyContent="Start" 
                    gap="MD" 
                >
                    <Typography variant='h6'>CASE</Typography>
                    {(!elseSelected && isPossibleEdit) && <Button size="SM" onClick={onClickAddRuleCaseHandler}>
                        추가
                    </Button>}
                </Stack>
                {props.custFeatRuleCaseList.map((ruleCase: TbRsCustFeatRuleCase, index: number) => {
                    return <CaseComponent
                        key={`custFeatRuleCase-${index}`}
                        isPossibleEdit={isPossibleEdit}
                        index={index}
                        lastIdx={(props.custFeatRuleCaseList.length-1)}
                        validationFormula={validationFormula}
                        custFeatRuleCase={ruleCase}
                        setCustFeatRuleCaseList={props.setCustFeatRuleCaseList}
                        
                    />
                })}
                </>
            }
        </div>
        </>
    )
}

export default ClacValid