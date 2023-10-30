import { useEffect, useState } from 'react'
import { cloneDeep } from 'lodash'

import { 
    HelperText,
    TextField,
} from '@/components/ui'

import { 
    FormulaValidRslt,
    TbRsCustFeatRuleCalc,
} from '@/models/selfFeature/FeatureInfo'
import { 
    initFormulaValidRslt,
} from '@/pages/user/self-feature/data'
import { ValidationFormula } from '@/utils/self-feature/FormulaValidUtil';

const FormulaComponent = (props: any) => {

    const [ formulaValidRslt, setFormulaValidRslt ] = useState<FormulaValidRslt>(cloneDeep(initFormulaValidRslt))

    useEffect(() => {
        setFormulaValidRslt(cloneDeep(ValidationFormula({
            formula: cloneDeep(props.custFeatRuleCalc.formula),
            targetList: cloneDeep(props.formulaTrgtList),
        })))
        
        props.setIsValidFormula && props.setIsValidFormula(formulaValidRslt.isValidFormula)

    }, [props.custFeatRuleCalc.formula])

    const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        
        props.setCustFeatRuleCalc((state: TbRsCustFeatRuleCalc) => {
            let rtn = cloneDeep(state)
            rtn[id] = value.toUpperCase()
            return rtn
        })
    }

    /*
    const onblurInputHandler = (e: React.FocusEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        
        props.setIsValidFormula && props.setIsValidFormula(formulaValidRslt.isValidFormula)

        setFormulaValidRslt(cloneDeep(ValidationFormula({
            formula: cloneDeep(value),
            targetList: cloneDeep(props.formulaTrgtList),
        })))
    }
    */

    return (
        <>
        <TextField 
            disabled={!props.isPossibleEdit}
            placeholder='(숫자 타입의 TARGET명, +, -, *, /, 소괄호만 사용하여 계산식을 입력합니다. 예) (T1+T2)/T3 )'
            value={props.custFeatRuleCalc.formula}
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