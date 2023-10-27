import { cloneDeep } from 'lodash'

import { 
    HelperText,
    TextField,
} from '@/components/ui'

import { 
    TbRsCustFeatRuleCalc,
} from '@/models/selfFeature/FeatureInfo'


const FormulaComponent = (props: any) => {

    const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        props.setCustFeatRuleCalc((state: TbRsCustFeatRuleCalc) => {
            let rtn = cloneDeep(state)
            rtn[id] = value
            return rtn
        })
    }

    return (
        <>
        <TextField 
            disabled={!props.isPossibleEdit}
            placeholder='(숫자 타입의 TARGET명, +, -, *, /, 소괄호만 사용하여 계산식을 입력합니다. 예) (T1+T2)/T3 )'
            value={props.custFeatRuleCalc.formula}
            id="formula"
            onChange={onchangeInputHandler} 
            //validation={!props.isValidFormula ? 'Error' : 'Default'}
        />
        {/*
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
        </div>
        */}
        </>
    )
}

export default FormulaComponent