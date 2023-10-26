
import { HelperText, TextField } from '@/components/ui'

const FormulaComponent = (props: any) => {
    return (
        <>
        <TextField 
            placeholder='(숫자 타입의 TARGET명, +, -, *, /, 소괄호만 사용하여 계산식을 입력합니다. 예) (T1+T2)/T3 )'
            value={props.formula} 
            onChange={props.validationFormula} 
            validation={!props.isValidFormula ? 'Error' : 'Default'}
        />
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
        </>
    )
}

export default FormulaComponent