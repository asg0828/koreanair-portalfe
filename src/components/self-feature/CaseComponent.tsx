import { useEffect, useState } from 'react';
import { SelectValue } from '@mui/base/useSelect';
import { cloneDeep } from 'lodash'

import { Button, Select, SelectOption, Stack, TextField, Typography } from '@/components/ui'
import { TbRsCustFeatRuleCase, delimiterOption, operatorOption, whenYn } from '@/models/selfFeature/FeatureInfo';

const CaseComponent = (props: any) => {

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

    const onClickDeleteHandler = (index: number) => {
        props.setCustFeatRuleCaseList((state: Array<TbRsCustFeatRuleCase>) => {
            let rtn = cloneDeep(state)
            rtn.splice(index, 1)
            return rtn
        })
    }

    const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { id, value } = e.target
        props.setCustFeatRuleCaseList((state: Array<TbRsCustFeatRuleCase>) => {
            let rtn = cloneDeep(state)
            rtn[index][id] = value
            return rtn
        })

    }

    const onchangeSelectHandler = (
        e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
        value: SelectValue<{}, false>,
        id?: String,
        index?: number
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
            rtn[index!][keyNm] = v
            if (!t) {
                rtn[index!]["delimiter"] = ''
            }
            if (t2) {
                rtn[index!]["targetFormula"] = ''
                rtn[index!]["operator"] = ''
                rtn[index!]["delimiter"] = ''
                rtn[index!]["operand1"] = ''
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
                <Button size="SM" onClick={()=>onClickDeleteHandler(props.index)}>
                삭제
                </Button>
                <Select 
                    value={props.ruleCase.whenYn}
                    appearance="Outline" 
                    placeholder="선택" 
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
                        onchangeSelectHandler(e, value, "whenYn", props.index)
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
                placeholder="TargetID / 계산식 입력"
                value={props.ruleCase.targetFormula}
                //onChange={props.validationFormula} 
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
                placeholder="선택" 
                onChange={(
                e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                value: SelectValue<{}, false>
                ) => {
                    onchangeSelectHandler(e, value, "operator", props.index)
                }}
            >
                {operatorOption.map((item, index) => (
                <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                ))}
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
                        onchangeSelectHandler(e, value, "delimiter", props.index)
                    }}
                >
                    {delimiterOption.map((item, index) => (
                    <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                    ))}
                </Select>
            }
            {!elseSelected &&
            <TextField 
                placeholder="피연산자 입력"
                value={props.ruleCase.operand1}
                id='operand1'
                onChange={(e) => onchangeInputHandler(e, props.index)} 
            />
            }
            <>
            <Typography variant='h5'>THEN</Typography>
            <TextField 
                placeholder="결과 입력"
                value={props.ruleCase.result}
                id='result'
                onChange={(e) => onchangeInputHandler(e, props.index)} 
            />
            </>
        </Stack>
    )
}

export default CaseComponent