import {HelperText, TextField, Typography} from '@components/ui'
import { useEffect, useState } from 'react'

import { cloneDeep } from 'lodash'
import { TbRsCustFeatRuleCalc } from '@/models/selfFeature/FeatureInfo'

const ClacValid = (props: any) => {

    const [ formula, setFormula ] = useState<string>('')
    const [ formulaTrgtList, setFormulaTrgtList ] = useState<Array<string>>([])

    useEffect(() => {
        setFormulaTrgtList(props.formulaTrgtList)
    }, [props.formulaTrgtList])

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
                if (formulaTrgtList.indexOf(chkTrgt) < 0) return Number('False')

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


    return (
        <div className='flex row'>
          <TextField className="width-100" value={formula} onChange={validationFormula} validation={!props.isValidFormula ? 'Error' : 'Default'}/>
          <div className='flex space-between'>
            <div>
              {!props.isValidFormula ? (
                <HelperText showIcon={false} type='Error'>
                  계산식을 확인해주세요
                </HelperText>
              ) : (
                ''
              )}
            </div>
            <div>
              <Typography variant='caption'>{}</Typography>
            </div>
          </div>
        </div>
    )
}

export default ClacValid