import { useDrop } from "react-dnd"
import { cloneDeep } from 'lodash'
import { SelectValue } from '@mui/base/useSelect';

import { Button, Page, Select, SelectOption, Stack, Typography } from "@components/ui"
import BehvColDropItem from "./BehvColDropItem"

import { TbCoMetaTblClmnInfo, TbRsCustFeatRuleTrgtFilter, divisionTypes } from '@/models/selfFeature/FeatureInfo'
import { initTbCoMetaTblClmnInfo, initTbRsCustFeatRuleTrgtFilter } from "@/pages/user/self-feature/data"

const filterLogiOption = [
  { value: '', text: '선택' },
  { value: '1', text: '아래 조건을 모두 만족하는 경우' },
]

const operatorList = [
    { value: '', text: '선택' },
    { value: '1', text: '연산자' },
]

const operandList = [
    { value: '', text: '선택' },
    { value: '1', text: '컬럼' },
]

const BehvDropItem = (props: any) => {

    const [, behvDrop] = useDrop(() => ({
        accept: divisionTypes.BEHV,
        drop(item, monitor) {
            const didDrop = monitor.didDrop()

            if (!didDrop) {
                let targetObj: TbCoMetaTblClmnInfo = Object.assign(cloneDeep(initTbCoMetaTblClmnInfo), item)

                let targetId = cloneDeep(props.targetId)
                let tableId  = targetId.split('_')[0]

                if (tableId !== targetObj.metaTblId) {
                    alert("같은 테이블 조건이 아닙니다.")
                    return null
                }

                props.setTrgtFilterList((state: Array<TbRsCustFeatRuleTrgtFilter>) => {
                    let tl = cloneDeep(state)
                    let trgtFilter = initTbRsCustFeatRuleTrgtFilter
                    trgtFilter.targetId  = targetId // 고정
                    trgtFilter.columnName = targetObj.metaTblClmnLogiNm
                    tl.push(trgtFilter)
                    return tl
                })
            }

        },
        collect(monitor) {
            
        },
    }), [])
    
    const deleteTrgtFilterInfo = (idx: number) => {
        
        props.setTrgtFilterList((state: Array<TbRsCustFeatRuleTrgtFilter>) => {
            let newTrgtFilterList = cloneDeep(state)

            let removeTrgetFilterList = []
            removeTrgetFilterList = newTrgtFilterList.filter((trgtFilter: TbRsCustFeatRuleTrgtFilter) => trgtFilter.targetId === props.targetId)
            removeTrgetFilterList.splice(idx, 1)

            newTrgtFilterList = newTrgtFilterList.filter((trgtFilter: TbRsCustFeatRuleTrgtFilter) => trgtFilter.targetId !== props.targetId)
            newTrgtFilterList = [...newTrgtFilterList, ...removeTrgetFilterList]

            return newTrgtFilterList
        })
    }

    const onClickDeleteHandler = () => {
        props.delTargetInfo(props.itemIdx, props.targetId)
    }

    return (
        <Stack 
            direction="Horizontal"
            justifyContent="Start" 
            gap="SM" 
            className="width-100"
            style={{
                backgroundColor: '#e0ffff',
                border: '0.1em solid',
                borderRadius: '5px',
            }}
        >
            <Typography variant="h6">T{props.itemIdx + 1}</Typography>
            <Stack
                direction="Vertical"
                justifyContent="Start" 
                gap="SM" 
                className="width-100"
            >
                <Stack
                    direction="Horizontal"
                    justifyContent="Start" 
                    gap="SM" 
                    className="width-100"
                    style={{
                        marginTop: '1%',
                    }}
                >
                    <Typography variant="h6">행동</Typography>
                    <Typography variant="h6">{props.targetItem.tableName}</Typography>
                </Stack>
                <Stack
                    direction="Vertical"
                    justifyContent="Start" 
                    gap="SM" 
                    className="width-100"
                    style={{
                        marginTop: '1%',
                        marginBottom: '1%',
                        border: '0.1em solid',
                        borderRadius: '5px',
                    }}
                >   
                    <Stack
                        direction="Horizontal"
                        justifyContent="Start" 
                        gap="SM" 
                        className="width-100"
                        style={{
                            marginLeft: '1%',
                            marginTop: '1%',
                            marginBottom: '1%',
                        }}
                    >
                        <Typography variant="h6">필터 선택</Typography>
                        {/* 
                            props.targetItem.filterLogiOption / props.targetItem.filterLogiExpsn
                            -> select box 필요(필터 조인 조건 선택-and,or...)
                        */}
                        <Select 
                            appearance="Outline"
                            defaultValue="1"
                            shape="Square"
                            size="SM"
                            status="default"
                            style={{
                                width: '11.25rem',
                            }}
                            // onChange={(
                            //     e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                            //     value: SelectValue<{}, false>
                            // ) => {
                            //     onchangeSelectHandler(e, value, "lCategory")
                            // }}
                        >
                            {filterLogiOption.map((item, index) => (
                            <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                            ))}
                        </Select>
                    </Stack>
                    <Stack
                        direction="Horizontal"
                        justifyContent="Start" 
                        gap="SM" 
                        className="width-100"
                    >
                        <Page
                            ref={(behvDrop)}
                            style={{
                                overflowY: 'scroll',
                                height: '110px',
                                border: '0.1em solid',
                                borderRadius: '5px',
                                marginLeft: '1%',
                                marginRight: '1%',
                                marginBottom: '1%',
                            }}
                        >
                            {props.trgtFilterList.map((trgtFilterItem: TbRsCustFeatRuleTrgtFilter, index: number) => (
                                <BehvColDropItem 
                                    key={index}
                                    itemIdx={index}
                                    isPossibleEdit={props.isPossibleEdit}
                                    deleteTrgtFilterInfo={deleteTrgtFilterInfo}
                                    trgtFilterItem={trgtFilterItem}
                                />
                            ))}
                        </Page>
                    </Stack>
                </Stack>

                <Stack
                    direction="Horizontal"
                    justifyContent="Start" 
                    gap="SM" 
                    className="width-100"
                    style={{
                        marginBottom: '1%',
                    }}
                >
                    <Typography variant="h6">연산자 및 컬럼</Typography>
                    <Select 
                        appearance="Outline"
                        defaultValue="1"
                        shape="Square"
                        size="MD"
                        status="default"
                        style={{
                        width: '11.25rem'
                        }}
                        // onChange={(
                        //     e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                        //     value: SelectValue<{}, false>
                        // ) => {
                        //     onchangeSelectHandler(e, value, "lCategory")
                        // }}
                    >
                        {operatorList.map((item, index) => (
                        <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                        ))}
                    </Select>
                    <Select 
                        appearance="Outline"
                        defaultValue="1"
                        shape="Square"
                        size="MD"
                        status="default"
                        style={{
                        width: '11.25rem'
                        }}
                        // onChange={(
                        //     e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                        //     value: SelectValue<{}, false>
                        // ) => {
                        //     onchangeSelectHandler(e, value, "lCategory")
                        // }}
                    >
                        {operandList.map((item, index) => (
                        <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                        ))}
                    </Select>
                </Stack>
            </Stack>
            
            {props.isPossibleEdit &&
            <Button size="SM" onClick={onClickDeleteHandler}>
            삭제
            </Button>
            }
        </Stack>
    )
}

export default BehvDropItem