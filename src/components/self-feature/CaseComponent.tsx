import { useEffect, useState } from 'react';
import { SelectValue } from '@mui/base/useSelect';
import { cloneDeep } from 'lodash'
import { ValidationFormula } from '@/utils/self-feature/FormulaValidUtil';

import { Button, Select, SelectOption, Stack, TextField, Typography, HelperText } from '@/components/ui'

import { 
    FormulaCaseProps, 
    FormulaValidRslt, 
    TbRsCustFeatRuleCase, 
} from '@/models/selfFeature/FeatureInfo';
import { 
    delimiterOption, 
    initFormulaValidRslt, 
    operatorOption, 
    whenYn, 
} from '@/pages/user/self-feature/data'

const CaseComponent = ({
    isPossibleEdit,
    index,
    lastIdx,
    custFeatRuleCase,
    setCustFeatRuleCaseList,
    setIsValidFormula,
    formulaTrgtList,
}: FormulaCaseProps) => {

    const [ trgtFormulaInput, setTrgtFormulaInput ] = useState<Boolean>(false)
    const [ formulaValidRslt, setFormulaValidRslt ] = useState<FormulaValidRslt>(cloneDeep(initFormulaValidRslt))

    const [ delimiterSelected, setDelimiterSelected ] = useState<Boolean>(false)
    const [ elseSelected, setElseSelected ] = useState<Boolean>(false)

    useEffect(() => {
        if (!custFeatRuleCase) return

        if (custFeatRuleCase.operator === "in_str" || custFeatRuleCase.operator === "not_in_str") {
            setDelimiterSelected(true)
        } else {
            setDelimiterSelected(false)
        }
    }, [custFeatRuleCase?.operator])

    useEffect(() => {
        if (!custFeatRuleCase) return

        if (custFeatRuleCase.whenYn === "N") {
            setElseSelected(true)
        } else {
            setElseSelected(false)
        }
    }, [custFeatRuleCase?.whenYn])

    useEffect(() => {
        if (!custFeatRuleCase) return

        if (custFeatRuleCase.targetFormula !== "") {
            setTrgtFormulaInput(true)
        } else {
            setTrgtFormulaInput(false)
        }
        setFormulaValidRslt(cloneDeep(ValidationFormula({
            formula: cloneDeep(custFeatRuleCase.targetFormula),
            targetList: cloneDeep(formulaTrgtList),
        })))
        
        setIsValidFormula && setIsValidFormula(formulaValidRslt.isValidFormula)
        
    }, [custFeatRuleCase?.targetFormula])

    useEffect(() => {
        if (formulaValidRslt.isValidFormula){
            setTrgtFormulaInput(true)
        } else { 
            setTrgtFormulaInput(false)
        }
    }, [formulaValidRslt.isValidFormula])

    const onClickDeleteHandler = () => {
        (setCustFeatRuleCaseList && (index || index === 0)) && setCustFeatRuleCaseList((state: Array<TbRsCustFeatRuleCase>) => {
            let rtn = cloneDeep(state)
            rtn.splice(index, 1)
            return rtn
        })
    }

    const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target

        let t = false
        let inputValue = cloneDeep(value)

        if (id === "targetFormula" && value !== "") {
            //입력값이 있는 경우
            setTrgtFormulaInput(true)
            inputValue = inputValue.toUpperCase()
            t = false
        } else if (id === "targetFormula" && value === "") {
            //입력값이 없는 경우
            setTrgtFormulaInput(false)
            t = true
        }

        (setCustFeatRuleCaseList && (index || index === 0)) && setCustFeatRuleCaseList((state: Array<TbRsCustFeatRuleCase>) => {
            let rtn = cloneDeep(state)
            rtn[index][id] = inputValue
            if (t) {
                rtn[index]["targetFormula"] = ''
                rtn[index]["operator"] = ''
                rtn[index]["delimiter"] = ''
                rtn[index]["operand1"] = ''
            }
            return rtn
        })

    }

    const onchangeSelectHandler = (
        e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
        value: SelectValue<{}, false>,
        id?: String
    ) => {
        let keyNm = String(id)
        let v = String(value)
        let t = false
        let t2 = false

        if (
            keyNm === "delimiter" 
            || (keyNm === "operator" && (v === "in_str" || v === "not_in_str"))
        ) {
            setDelimiterSelected(true)
            t = true
        } else if (keyNm === "whenYn") {
            t = true

            if (v === "N") {
                t2 = true
                setElseSelected(true)
            } else {
                t2 = false
                setElseSelected(false)
            }
        } else {
            setDelimiterSelected(false)
            t = false
        }

        (setCustFeatRuleCaseList && (index || index === 0)) && setCustFeatRuleCaseList((state: Array<TbRsCustFeatRuleCase>) => {
            let rtn = cloneDeep(state)
            rtn[index][keyNm] = v
            if (!t) {
                rtn[index]["delimiter"] = ''
            }
            if (t2) {
                rtn[index]["targetFormula"] = ''
                rtn[index]["operator"] = ''
                rtn[index]["delimiter"] = ''
                rtn[index]["operand1"] = ''
            }
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
        <Stack
            direction="Horizontal"
            justifyContent="Start" 
            gap="MD" 
        >
            {index === 0 && 
                <Typography variant='h5'>WHEN</Typography>
            }
            {index !== 0 && 
                <>
                {isPossibleEdit &&
                    <Button 
                        size="SM" 
                        onClick={onClickDeleteHandler}
                    >
                    삭제
                    </Button>
                }
                {lastIdx === index &&
                    <Select 
                        disabled={!isPossibleEdit}
                        value={custFeatRuleCase?.whenYn}
                        appearance="Outline"
                        shape="Square"
                        size="MD"
                        status="default"
                        style={{
                        width: '11.25rem'
                        }}
                        onChange={(
                        e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                        value: SelectValue<{}, false>
                        ) => {
                            onchangeSelectHandler(e, value, "whenYn")
                        }}
                    >
                        {whenYn.map((item, index) => (
                        <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                        ))}
                    </Select>
                }
                {lastIdx !== index &&
                    <Typography variant='h5'>WHEN</Typography>
                }
                </>
            }
            {!elseSelected &&
            <>
                <TextField 
                    disabled={!isPossibleEdit}
                    placeholder="Target/계산식 입력"
                    value={custFeatRuleCase?.targetFormula}
                    id='targetFormula'
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
            }
            {!elseSelected &&
            <Select 
                disabled={!isPossibleEdit}
                value={custFeatRuleCase?.operator}
                shape="Square"
                size="MD"
                status="default"
                style={{
                width: '11.25rem'
                }}
                appearance="Outline" 
                placeholder="연산자 선택" 
                onChange={(
                e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                value: SelectValue<{}, false>
                ) => {
                    onchangeSelectHandler(e, value, "operator")
                }}
            >
            
                {trgtFormulaInput && operatorOption.map((item, index) => (
                <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                ))}
                {!trgtFormulaInput && <SelectOption value="">연산자 선택</SelectOption>}
            </Select>
            }
            {(!elseSelected && delimiterSelected) &&
                <Select 
                    disabled={!isPossibleEdit}
                    appearance="Outline"
                    value={custFeatRuleCase?.delimiter}
                    shape="Square"
                    size="MD"
                    status="default"
                    style={{
                    width: '11.25rem'
                    }}
                    onChange={(
                        e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                        value: SelectValue<{}, false>
                    ) => {
                        // 구분자 선택
                        onchangeSelectHandler(e, value, "delimiter")
                    }}
                >
                    {delimiterOption.map((item, index) => (
                    <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                    ))}
                </Select>
            }
            {(!elseSelected && trgtFormulaInput) &&
            <TextField 
                disabled={!isPossibleEdit}
                placeholder="피연산자 입력"
                value={custFeatRuleCase?.operand1}
                id='operand1'
                onChange={onchangeInputHandler} 
            />
            }
            <>
            {!elseSelected &&
            <Typography variant='h5'>THEN</Typography>
            }
            <TextField 
                disabled={!isPossibleEdit}
                placeholder="결과 입력"
                value={custFeatRuleCase?.result}
                id='result'
                onChange={onchangeInputHandler} 
            />
            </>
        </Stack>
    )
}

export default CaseComponent