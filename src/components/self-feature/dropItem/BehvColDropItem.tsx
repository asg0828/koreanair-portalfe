import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash'
import { SelectValue } from '@mui/base/useSelect';

import { Button, Select, SelectOption, Stack, TextField, Typography } from '@components/ui'
import TransFunction from './TransFunction'

import { 
    TbRsCustFeatRuleTrgtFilter,
} from '@/models/selfFeature/FeatureInfo'
import { 
    trgtFilterTit, 
    operatorOption,
    delimiterOption,
} from '@/pages/user/self-feature/data'

const BehvColDropItem = (props: any) => {

    const [ delimiterSelected, setDelimiterSelected ] = useState<Boolean>(false)

    useEffect(() => {

        if (props.trgtFilterItem.operator === "in_str" || props.trgtFilterItem.operator === "not_in_str") {
            setDelimiterSelected(true)
        } else {
            setDelimiterSelected(false)
        }

    }, [props.trgtFilterItem.operator])

    const onClickTrgtFilterDeleteHandler = () => {
        props.deleteTrgtFilterInfo(props.itemIdx)
    }

    const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        
        props.setTrgtFilterList((state: Array<TbRsCustFeatRuleTrgtFilter>) => {
            let tl = cloneDeep(state)
            // target과 그에 해당하는 targetFilter의 인덱싱은 바뀔 수 있음.
            let updtTrgtFilterList = tl.filter((trgtFilter: TbRsCustFeatRuleTrgtFilter) => trgtFilter.targetId === props.trgtFilterItem.targetId)
            updtTrgtFilterList[props.itemIdx][id] = value
            tl = tl.filter((trgtFilter: TbRsCustFeatRuleTrgtFilter) => trgtFilter.targetId !== props.trgtFilterItem.targetId)
            tl = [...tl, ...updtTrgtFilterList]
            return tl
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

        if (
            keyNm === "delimiter" 
            || (keyNm === "operator" && (v === "in_str" || v === "not_in_str"))
        ) {
            setDelimiterSelected(true)
            t = true
        } else {
            setDelimiterSelected(false)
            t = false
        }

        props.setTrgtFilterList((state: Array<TbRsCustFeatRuleTrgtFilter>) => {
            let tl = cloneDeep(state)
            // target과 그에 해당하는 targetFilter의 인덱싱은 바뀔 수 있음.
            let updtTrgtFilterList = tl.filter((trgtFilter: TbRsCustFeatRuleTrgtFilter) => trgtFilter.targetId === props.trgtFilterItem.targetId)
            updtTrgtFilterList[props.itemIdx][keyNm] = v
            if (!t) {
                updtTrgtFilterList[props.itemIdx]["delimiter"] = ''
            }
            tl = tl.filter((trgtFilter: TbRsCustFeatRuleTrgtFilter) => trgtFilter.targetId !== props.trgtFilterItem.targetId)
            tl = [...tl, ...updtTrgtFilterList]
            return tl
        })
       
    }

    return (
        <>
        {props.trgtFilterItem &&
            <Stack 
                justifyContent="Start"
                gap="SM"
                className="width-100"
                style={{
                    backgroundColor: 'rgb(0, 37, 108)',
                    color:"#FFF",
                    borderRadius: '5px',
                    padding:"0.35rem"
                }}
            >  
                <Typography variant='h6' style={{color:"inherit"}}>{trgtFilterTit[props.itemIdx]}</Typography>
                <Typography variant="h6" style={{color:"inherit"}}>{props.trgtFilterItem.columnName}</Typography>
                <TransFunction 
                    isPossibleEdit={props.isPossibleEdit}
                />
                <Select 
                    disabled={!props.isPossibleEdit}
                    placeholder="연산자 선택" 
                    appearance="Outline"
                    value={props.trgtFilterItem.operator}
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
                        // 연산자 선택
                        onchangeSelectHandler(e, value, "operator")
                    }}
                >
                    {operatorOption.map((item, index) => (
                    <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                    ))}
                </Select>
                {delimiterSelected &&
                    <Select 
                        disabled={!props.isPossibleEdit}
                        placeholder="구분자 선택" 
                        appearance="Outline"
                        value={props.trgtFilterItem.delimiter}
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
                <TextField 
                    disabled={!props.isPossibleEdit}
                    value={props.trgtFilterItem.operand1}
                    placeholder="피연산자 입력"
                    id="operand1"
                    onChange={onchangeInputHandler}
                />
                {props.isPossibleEdit ? (
                    <Button size="XS" onClick={onClickTrgtFilterDeleteHandler}>
                    컬럼삭제
                    </Button>
                ) : (
                    <></>
                )}
            </Stack>
        }
        </>
    )
}

export default BehvColDropItem