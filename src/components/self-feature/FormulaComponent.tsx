import { useEffect, useState } from 'react'
import { cloneDeep } from 'lodash'
import { ValidationFormula } from '@/utils/self-feature/FormulaValidUtil';

import { 
    HelperText,
    TextField,
} from '@/components/ui'

import { 
    FormulaCaseProps,
    FormulaTrgtListProps,
    FormulaValidRslt,
    TbRsCustFeatRuleCalc,
} from '@/models/selfFeature/FeatureModel'
import { 
    initFormulaValidRslt,
} from '@/pages/user/self-feature/data'

const FormulaComponent = ({
    isPossibleEdit,
    custFeatRuleCalc,
    setCustFeatRuleCalc,
    setIsValidFormula,
    formulaTrgtList,
}: FormulaCaseProps) => {

    const [ formulaValidRslt, setFormulaValidRslt ] = useState<FormulaValidRslt>(cloneDeep(initFormulaValidRslt))

    useEffect(() => {
        if (!custFeatRuleCalc) return

        let targetList: string[] = []
        formulaTrgtList.map((v: FormulaTrgtListProps) => {
            targetList.push(v.targetId)
        })

        setFormulaValidRslt(cloneDeep(ValidationFormula({
            formula: cloneDeep(custFeatRuleCalc.formula),
            targetList: cloneDeep(targetList),
            formulaTrgtList: cloneDeep(formulaTrgtList),
        })))
        
        setIsValidFormula && setIsValidFormula(formulaValidRslt.isValidFormula)

    }, [custFeatRuleCalc?.formula])

    useEffect(() => {
        if (formulaTrgtList.length < 1) return

        let targetList: string[] = []
        formulaTrgtList.map((v: FormulaTrgtListProps) => {
            targetList.push(v.targetId)
        })

        if (formulaTrgtList.length === 1) {
            setCustFeatRuleCalc && setCustFeatRuleCalc((state: TbRsCustFeatRuleCalc) => {
                let rtn = cloneDeep(state)
                rtn.formula = "T1"
                return rtn
            })
            setFormulaValidRslt(cloneDeep(ValidationFormula({
                formula: "T1",
                targetList: cloneDeep(targetList),
                formulaTrgtList: cloneDeep(formulaTrgtList),
            })))
        } else {
            setFormulaValidRslt(cloneDeep(ValidationFormula({
                formula: cloneDeep(custFeatRuleCalc!.formula),
                targetList: cloneDeep(targetList),
                formulaTrgtList: cloneDeep(formulaTrgtList),
            })))
        }
        
        setIsValidFormula && setIsValidFormula(formulaValidRslt.isValidFormula)
        
    }, [formulaTrgtList])

    const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        
        setCustFeatRuleCalc && setCustFeatRuleCalc((state: TbRsCustFeatRuleCalc) => {
            let rtn = cloneDeep(state)
            rtn[id] = value.toUpperCase()
            return rtn
        })
    }

    /*
    const onblurInputHandler = (e: React.FocusEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        
        setIsValidFormula && setIsValidFormula(formulaValidRslt.isValidFormula)

        setFormulaValidRslt(cloneDeep(ValidationFormula({
            formula: cloneDeep(value),
            targetList: cloneDeep(formulaTrgtList),
        })))
    }
    */

    return (
        <>
        <TextField 
            disabled={!isPossibleEdit}
            placeholder='(숫자 타입의 TARGET명, +, -, *, /, 소괄호만 사용하여 계산식을 입력합니다. 예) (T1+T2)/T3 )'
            value={custFeatRuleCalc?.formula}
            id="formula"
            onChange={onchangeInputHandler} 
            //onBlur={onblurInputHandler}
            validation={!formulaValidRslt.isValidFormula ? 'Error' : 'Default'}
        />
        <div className='flex space-between'>
            <div>
            {!formulaValidRslt.isValidFormula ? (
                <HelperText showIcon={false} type='Error'>
                {formulaValidRslt.text}
                </HelperText>
            ) : (
                ''
            )}
            </div>
        </div>
        </>
    )
}

export default FormulaComponent