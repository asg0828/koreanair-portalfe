import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash'
import { SelectValue } from '@mui/base/useSelect';

import { Button, Select, SelectOption, Stack, TextField, Typography } from '@components/ui'
import TransFunction from './TransFunction'

import { 
    TargetDropFilterProps,
    TbRsCustFeatRuleTrgtFilter,
} from '@/models/selfFeature/FeatureInfo'
import { 
    trgtFilterTit, 
    operatorOption,
    delimiterOption,
} from '@/pages/user/self-feature/data'

const BehvColDropItem = ({
    itemIdx,
    isPossibleEdit,
    trgtFilterItem,
    setTrgtFilterList,
    deleteTrgtFilterInfo,
}: TargetDropFilterProps) => {

    const [ delimiterSelected, setDelimiterSelected ] = useState<Boolean>(false)

    useEffect(() => {

        if (trgtFilterItem.operator === "in_str" || trgtFilterItem.operator === "not_in_str") {
            setDelimiterSelected(true)
        } else {
            setDelimiterSelected(false)
        }

    }, [trgtFilterItem.operator])

    const onClickTrgtFilterDeleteHandler = () => {
        deleteTrgtFilterInfo(itemIdx)
    }

    const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        
        setTrgtFilterList((state: Array<TbRsCustFeatRuleTrgtFilter>) => {
            let tl = cloneDeep(state)
            // target과 그에 해당하는 targetFilter의 인덱싱은 바뀔 수 있음.
            let updtTrgtFilterList = tl.filter((trgtFilter: TbRsCustFeatRuleTrgtFilter) => trgtFilter.targetId === trgtFilterItem.targetId)
            updtTrgtFilterList[itemIdx][id] = value
            tl = tl.filter((trgtFilter: TbRsCustFeatRuleTrgtFilter) => trgtFilter.targetId !== trgtFilterItem.targetId)
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

        setTrgtFilterList((state: Array<TbRsCustFeatRuleTrgtFilter>) => {
            let tl = cloneDeep(state)
            // target과 그에 해당하는 targetFilter의 인덱싱은 바뀔 수 있음.
            let updtTrgtFilterList = tl.filter((trgtFilter: TbRsCustFeatRuleTrgtFilter) => trgtFilter.targetId === trgtFilterItem.targetId)
            updtTrgtFilterList[itemIdx][keyNm] = v
            if (!t) {
                updtTrgtFilterList[itemIdx]["delimiter"] = ''
            }
            tl = tl.filter((trgtFilter: TbRsCustFeatRuleTrgtFilter) => trgtFilter.targetId !== trgtFilterItem.targetId)
            tl = [...tl, ...updtTrgtFilterList]
            return tl
        })
       
    }

    return (
        <>
        {trgtFilterItem &&
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
                <Typography variant='h6' style={{color:"inherit"}}>{trgtFilterTit[itemIdx]}</Typography>
                <Typography variant="h6" style={{color:"inherit"}}>{trgtFilterItem.columnName}</Typography>
                <TransFunction 
                    isPossibleEdit={isPossibleEdit}
                />
                <Select 
                    disabled={!isPossibleEdit}
                    placeholder="연산자 선택" 
                    appearance="Outline"
                    value={trgtFilterItem.operator}
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
                        disabled={!isPossibleEdit}
                        placeholder="구분자 선택" 
                        appearance="Outline"
                        value={trgtFilterItem.delimiter}
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
                    disabled={!isPossibleEdit}
                    value={trgtFilterItem.operand1}
                    placeholder="피연산자 입력"
                    id="operand1"
                    onChange={onchangeInputHandler}
                />
                {isPossibleEdit ? (
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