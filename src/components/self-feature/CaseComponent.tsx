import { useEffect, useState } from 'react';
import { SelectValue } from '@mui/base/useSelect';
import { cloneDeep } from 'lodash'

import { Button, Select, SelectOption, Stack, TextField, Typography } from '@/components/ui'
import { TbRsCustFeatRuleCase, delimiterOption, operatorOption, whenYn } from '@/models/selfFeature/FeatureInfo';

const CaseComponent = (props: any) => {

    const [ trgtFormulaInput, setTrgtFormulaInput ] = useState<Boolean>(false)
    const [ delimiterSelected, setDelimiterSelected ] = useState<Boolean>(false)
    const [ elseSelected, setElseSelected ] = useState<Boolean>(false)

    useEffect(() => {
        if (props.ruleCase.operator === "in_str" || props.ruleCase.operator === "not_in_str") {
            setDelimiterSelected(true)
        } else {
            setDelimiterSelected(false)
        }
    }, [props.ruleCase.operator])

    useEffect(() => {
        if (props.ruleCase.whenYn === "N") {
            setElseSelected(true)
        } else {
            setElseSelected(false)
        }
    }, [props.ruleCase.whenYn])

    useEffect(() => {
        if (props.ruleCase.targetFormula !== "") {
            setTrgtFormulaInput(true)
        } else {
            setTrgtFormulaInput(false)
        }
    }, [props.ruleCase.targetFormula])

    const onClickDeleteHandler = () => {
        props.setCustFeatRuleCaseList((state: Array<TbRsCustFeatRuleCase>) => {
            let rtn = cloneDeep(state)
            rtn.splice(props.index, 1)
            return rtn
        })
    }

    const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target

        let t = false

        if (id === "targetFormula" && value !== "") {
            //입력값이 있는 경우
            setTrgtFormulaInput(true)
            t = false
        } else if (id === "targetFormula" && value === "") {
            //입력값이 없는 경우
            setTrgtFormulaInput(false)
            t = true
        }

        props.setCustFeatRuleCaseList((state: Array<TbRsCustFeatRuleCase>) => {
            let rtn = cloneDeep(state)
            rtn[props.index][id] = value
            if (t) {
                rtn[props.index]["targetFormula"] = ''
                rtn[props.index]["operator"] = ''
                rtn[props.index]["delimiter"] = ''
                rtn[props.index]["operand1"] = ''
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

        props.setCustFeatRuleCaseList((state: Array<TbRsCustFeatRuleCase>) => {
            let rtn = cloneDeep(state)
            rtn[props.index][keyNm] = v
            if (!t) {
                rtn[props.index]["delimiter"] = ''
            }
            if (t2) {
                rtn[props.index]["targetFormula"] = ''
                rtn[props.index]["operator"] = ''
                rtn[props.index]["delimiter"] = ''
                rtn[props.index]["operand1"] = ''
            }
            return rtn
        })
    }

    return (
        <Stack
            direction="Horizontal"
            justifyContent="Start" 
            gap="MD" 
        >
            {props.index === 0 ? (
                <Typography variant='h5'>WHEN</Typography>
            ) : (
                <>
                <Button size="SM" onClick={onClickDeleteHandler}>
                삭제
                </Button>
                <Select 
                    disabled={!((props.lastIdx-1) === props.index) ? true : false}
                    value={props.ruleCase.whenYn}
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
                </>
            )}
            {!elseSelected &&
            <TextField 
                placeholder="Target/계산식 입력"
                value={props.ruleCase.targetFormula}
                id='targetFormula'
                onChange={onchangeInputHandler} 
                //validation={!props.isValidFormula ? 'Error' : 'Default'}
            />
            }
            {!elseSelected &&
            <Select 
                value={props.ruleCase.operator}
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
                    //disabled={!props.isPossibleEdit}
                    appearance="Outline"
                    value={props.ruleCase.delimiter}
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
                placeholder="피연산자 입력"
                value={props.ruleCase.operand1}
                id='operand1'
                onChange={onchangeInputHandler} 
            />
            }
            <>
            {!elseSelected &&
            <Typography variant='h5'>THEN</Typography>
            }
            <TextField 
                placeholder="결과 입력"
                value={props.ruleCase.result}
                id='result'
                onChange={onchangeInputHandler} 
            />
            </>
        </Stack>
    )
}

export default CaseComponent