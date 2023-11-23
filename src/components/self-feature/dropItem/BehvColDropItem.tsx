import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash'
import { SelectValue } from '@mui/base/useSelect';

import { Button, Stack, Typography } from '@components/ui'
import TransFunction from './TransFunction'

import { 
    TargetDropFilterProps,
    TbRsCustFeatRuleTrgtFilter,
} from '@/models/selfFeature/FeatureModel'
import { 
    trgtFilterTit,
} from '@/pages/user/self-feature/data'
import OperatorOperand from '../OperatorOperand';

const BehvColDropItem = ({
    itemIdx,
    isPossibleEdit,
    trgtFilterItem,
    columnList,
    setTrgtFilterList,
    deleteTrgtFilterInfo,
}: TargetDropFilterProps) => {

    const [ delimiterSelected, setDelimiterSelected ] = useState<Boolean>(false)
    const [ slctDateType, setSlctDateType ] = useState<string>("")

    useEffect(() => {

        if (
            trgtFilterItem.operator === "in_str" 
            || trgtFilterItem.operator === "not_in_str" 
            || trgtFilterItem.operator === "in_num" 
            || trgtFilterItem.operator === "not_in_num"
        ) {
            setDelimiterSelected(true)
        } else {
            setDelimiterSelected(false)
        }

        // 연산자가 날짜타입인 경우 초기 setting
        if (
            trgtFilterItem.operator === "before" 
            || trgtFilterItem.operator === "after" 
            || trgtFilterItem.operator === "between"
        ) {
            setSlctDateType(trgtFilterItem.operator)
        }

    }, [trgtFilterItem.operator])

    const onClickTrgtFilterDeleteHandler = () => {
        deleteTrgtFilterInfo(itemIdx)
    }

    const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        
        setTrgtFilterList((state: Array<TbRsCustFeatRuleTrgtFilter>) => {
            let tl = cloneDeep(state)
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
        let isClrDlmt = false // 구분자를 필요로 하지 않는 연산자 선택의 경우 초기화를 위한 flag

        // 구분자 select box show를 위한 state 설정
        if (
            keyNm === "delimiter" 
            || (keyNm === "operator" && (v === "in_str" || v === "not_in_str" || v === "in_num" || v === "not_in_num"))
        ) {
            setDelimiterSelected(true)
            isClrDlmt = true
        } else {
            setDelimiterSelected(false)
            isClrDlmt = false
        }
        // 날짜 타입 select box 선택시 operand 초기화
        let isOprtSlct = false
        // 날짜 타입 select box show를 위한 state 설정
        if (keyNm === "operator" && (v === "before" || v === "after" || v === "between")) {
            isOprtSlct = true
            setSlctDateType(v)
        }
        // 날짜(between)의 경우 날짜/조건식 중 날짜 선택시 operand 초기화
        let isOprdDate1 = false
        let isOprdDate2 = false
        if ((keyNm === "operand1") && (v === "date" || v === "now")) isOprdDate1 = true
        else isOprdDate1 = false
        
        if ((keyNm === "operand4") && (v === "date" || v === "now")) isOprdDate2 = true
        else isOprdDate2 = false

        setTrgtFilterList((state: Array<TbRsCustFeatRuleTrgtFilter>) => {
            let tl = cloneDeep(state)
            let updtTrgtFilterList = tl.filter((trgtFilter: TbRsCustFeatRuleTrgtFilter) => trgtFilter.targetId === trgtFilterItem.targetId)
            updtTrgtFilterList[itemIdx][keyNm] = v
            if (!isClrDlmt) {
                updtTrgtFilterList[itemIdx]["delimiter"] = ''
            }
            if (isOprtSlct) {
                updtTrgtFilterList[itemIdx]["operand1"] = ''
                updtTrgtFilterList[itemIdx]["operand2"] = ''
                updtTrgtFilterList[itemIdx]["operand3"] = ''
                updtTrgtFilterList[itemIdx]["operand4"] = ''
                updtTrgtFilterList[itemIdx]["operand5"] = ''
                updtTrgtFilterList[itemIdx]["operand6"] = ''
            }
            if (isOprdDate1) {
                updtTrgtFilterList[itemIdx]["operand2"] = ''
                updtTrgtFilterList[itemIdx]["operand3"] = ''
            }
            if (isOprdDate2) {
                updtTrgtFilterList[itemIdx]["operand5"] = ''
                updtTrgtFilterList[itemIdx]["operand6"] = ''
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
                    display: "inline-flex",
                    color: 'rgb(0, 99, 165)',
                    backgroundColor: 'rgb(200, 233, 255)',
                    borderRadius: '5px',
                    padding:"0.35rem"
                }}
            >  
                <Stack
                    gap="SM"
                    style={{
                        flex: "0 1 8%",
                        maxWidth: "8%",
                    }}
                >
                    <Typography variant="h6" style={{color:"inherit"}}>{trgtFilterTit[itemIdx]}</Typography>
                    <Typography variant="body2" style={{color:"inherit"}}>{trgtFilterItem.columnLogiName}</Typography>
                </Stack>
                <Stack
                    gap="SM"
                    style={{
                        flex: "0 1 10%",
                        maxWidth: "10%",
                    }}
                >
                <TransFunction 
                    isPossibleEdit={isPossibleEdit}
                    itemIdx={itemIdx}
                    dataType={trgtFilterItem.columnDataTypeCode}
                    trgtItem={trgtFilterItem}
                    columnList={columnList}
                    setTrgtFilterList={setTrgtFilterList}
                />
                </Stack>
                <Stack
                    justifyContent="Start"
                    gap="MD"
                    style={{
                        display: "inline-flex",
                        flex: "0 1 75%",
                        maxWidth: "75%",
                        alignItems: "flex-start",
                    }}
                >
                <OperatorOperand
                    isPossibleEdit={isPossibleEdit}
                    itemIdx={itemIdx}
                    item={trgtFilterItem}
                    dataType={trgtFilterItem.columnDataTypeCode}
                    delimiterSelected={delimiterSelected}
                    slctDateType={slctDateType}
                    setTrgtFilterList={setTrgtFilterList}
                    onchangeInputHandler={onchangeInputHandler}
                    onchangeSelectHandler={onchangeSelectHandler}
                />
                </Stack>
                <Stack
                    justifyContent="End"
                    gap="SM"
                    style={{
                        flex: "0 1 5%",
                        maxWidth: "5%",
                    }}
                >
                {isPossibleEdit ? (
                    <Button size="XS" onClick={onClickTrgtFilterDeleteHandler}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"></path>
                        </svg>
                    </Button>
                ) : (
                    <></>
                )}
                </Stack>
            </Stack>
        }
        </>
    )
}

export default BehvColDropItem