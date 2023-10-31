import { useEffect, useState } from "react";
import { useDrop } from "react-dnd"
import { cloneDeep } from 'lodash'
import { SelectValue } from '@mui/base/useSelect';

import { Button, Page, Select, SelectOption, Stack, TextField, Typography } from "@components/ui"
import BehvColDropItem from "./BehvColDropItem"

import { 
    TbCoMetaTblClmnInfo, 
    TbRsCustFeatRuleTrgtFilter,
    TbRsCustFeatRuleTrgt,
    TargetDropProps,
} from '@/models/selfFeature/FeatureInfo'
import { 
    initTbCoMetaTblClmnInfo, 
    initTbRsCustFeatRuleTrgtFilter, 
    trgtFilterTit, 
    divisionTypes,
    filterOption,
    aggregateOption,
} from "@/pages/user/self-feature/data"

const columnList = [
    { value: 'colum1', text: 'colum1' },
    { value: 'colum2', text: 'colum2' },
    { value: 'colum3', text: 'colum3' },
]

const BehvDropItem = ({
    itemIdx,
    isPossibleEdit,
    targetItem,
    trgtFilterList,
    setTargetList,
    setTrgtFilterList,
    delTargetInfo,
}: TargetDropProps) => {

    const [ filterExpsn, setFilterExpsn ] = useState<string>(cloneDeep(targetItem.filterLogiExpsn))
    const [ aggregateTopSelect, setAggregateTopSelect ] = useState<Boolean>(false)

    // 논리 표현식(필터옵션 좌측 input) 수정
    useEffect(() => {
        if (!trgtFilterList) return

        if (trgtFilterList.length < 1) {
            setFilterExpsn('')
            return
        }

        let op = ''
        let fe = ''
        if (targetItem.filterLogiOption === "ALL") op = " and "
        else if (targetItem.filterLogiOption === "ANY") op = " or "
        
        if (op !== '') {
            for (let i = 0; i < trgtFilterList.length; i++) {
                if (i === 0) {
                    fe = trgtFilterTit[i]
                    continue
                }
                fe += op + trgtFilterTit[i]
            }
            setFilterExpsn(fe)
        }
    }, [trgtFilterList])

    // 수정시 집계함수가 top인 경우
    useEffect(() => {
        if (targetItem.operator === "top") {
            setAggregateTopSelect(true)
        } else {
            setAggregateTopSelect(false)
        }
    }, [targetItem.operator])

    // 논리 표현식이 변경될 경우 부모 컴포넌트의 target 리스트 update
    useEffect(() => {
        setTargetList && setTargetList((state: Array<TbRsCustFeatRuleTrgt>) => {
            let tl = cloneDeep(state)
            tl.map((trgt: TbRsCustFeatRuleTrgt) => {
                // target과 그에 해당하는 targetFilter의 인덱싱은 바뀔 수 있음.
                if (trgt.targetId === targetItem.targetId) {
                    trgt.filterLogiExpsn = filterExpsn
                }
                return trgt
            })
            return tl
        })
    }, [filterExpsn])

    const [, behvDrop] = useDrop(() => ({
        accept: divisionTypes.BEHV,
        drop(item, monitor) {
            const didDrop = monitor.didDrop()

            if (!didDrop) {
                let targetObj: TbCoMetaTblClmnInfo = Object.assign(cloneDeep(initTbCoMetaTblClmnInfo), item)
                // target과 그에 해당하는 targetFilter의 인덱싱은 바뀔 수 있음.
                let targetId = cloneDeep(targetItem.targetId)
                let tableId  = targetId.split('_')[0]

                if (tableId !== targetObj.metaTblId) {
                    alert("같은 테이블 조건이 아닙니다.")
                    return null
                }

                setTrgtFilterList && setTrgtFilterList((state: Array<TbRsCustFeatRuleTrgtFilter>) => {
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
    
    // 행동데이터 필터에 해당되는 컬럼 삭제시
    const deleteTrgtFilterInfo = (idx: number) => {
        
        setTrgtFilterList && setTrgtFilterList((state: Array<TbRsCustFeatRuleTrgtFilter>) => {
            let newTrgtFilterList = cloneDeep(state)
            
            let removeTrgetFilterList = []
            removeTrgetFilterList = newTrgtFilterList.filter((trgtFilter: TbRsCustFeatRuleTrgtFilter) => trgtFilter.targetId === targetItem.targetId)
            removeTrgetFilterList.splice(idx, 1)

            newTrgtFilterList = newTrgtFilterList.filter((trgtFilter: TbRsCustFeatRuleTrgtFilter) => trgtFilter.targetId !== targetItem.targetId)
            newTrgtFilterList = [...newTrgtFilterList, ...removeTrgetFilterList]

            return newTrgtFilterList
        })

    }
    // 행동데이터 테이블 정보 삭제시
    const onClickDeleteHandler = () => {
        delTargetInfo(itemIdx, targetItem.targetId)
    }

    const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        if (id === "filterLogiExpsn") {
            setFilterExpsn(value)
        } else {
            setTargetList && setTargetList((state: Array<TbRsCustFeatRuleTrgt>) => {
                let tl = cloneDeep(state)
                tl.map((trgt: TbRsCustFeatRuleTrgt) => {
                    // target과 그에 해당하는 targetFilter의 인덱싱은 바뀔 수 있음.
                    if (trgt.targetId === targetItem.targetId) {
                        trgt[id] = value
                    }
                    return trgt
                })
                return tl
            })
        }
    }
    const onchangeSelectHandler = (
        e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
        value: SelectValue<{}, false>,
        id?: String
    ) => {
        let keyNm = String(id)
        let v = String(value)
        let t = false

        if (keyNm === "columnName" || keyNm === "filterLogiOption") {
            t = true
        } else if (keyNm === "operator" && v === "top") {
            /*
                'Top 연산자는 하나의 대상만 가능합니다. 다른 대상들을 제거 하시겠습니까?' 
                confirm 모달 open 확인시 해당 대상(필터에 선택된 컬럼대상은 유지)
                들은 삭제 및 우측 drag 영역 hide
            */
            setAggregateTopSelect(true)
            t = true
        } else if (
            keyNm === "operand1"
            || keyNm === "operand3"
            || keyNm === "operand4"
        ) {
            setAggregateTopSelect(true)
            t = true
        } else {
            setAggregateTopSelect(false)
        }

        setTargetList && setTargetList((state: Array<TbRsCustFeatRuleTrgt>) => {
            let tl = cloneDeep(state)
            // target과 그에 해당하는 targetFilter의 인덱싱은 바뀔 수 있음.
            if (tl[itemIdx].targetId === targetItem.targetId) {
                tl[itemIdx][keyNm] = v
                if (!t) {
                    tl[itemIdx]["operand1"] = ''
                    tl[itemIdx]["operand2"] = ''
                    tl[itemIdx]["operand3"] = ''
                    tl[itemIdx]["operand4"] = ''
                }
            }
            return tl
        })
    }
      
    return (
        <Stack 
            direction="Horizontal"
            justifyContent="Start" 
            gap="SM" 
            className="width-100"
            style={{
                backgroundColor: '#e6f9ff', 
                color: '#00256c',
                borderRadius: '5px',
                padding:'0.5rem'
            }}
        >
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
                    <Typography variant="h6" style={{color:"inherit"}}>T{itemIdx + 1}</Typography>
                    <div className="dragItemLocation">
                        행동
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.29498 16.59L12.875 12L8.29498 7.41L9.70498 6L15.705 12L9.70498 18L8.29498 16.59Z" fill="currentColor"></path></svg>
                    </div>
                    <Typography variant="body2" style={{color:"inherit"}}>{targetItem.tableName}</Typography>
                </Stack>
                <Stack
                    direction="Vertical"
                    justifyContent="Start" 
                    gap="SM" 
                    className="width-100"
                    style={{
                        border:"1px solid rgb(218, 218, 218)",
                        borderRadius: '5px',
                    }}
                >   
                    <Stack
                        direction="Horizontal"
                        justifyContent="Between" 
                        gap="SM" 
                        className="width-100"
                        style={{padding:"0.5rem"}}
                    >
                        <Stack gap="SM">
                            <Typography variant="h6" style={{color:"inherit"}}>필터 선택</Typography>
                            <TextField 
                                disabled={!isPossibleEdit}
                                placeholder="논리 표현식" 
                                value={filterExpsn}
                                id="filterLogiExpsn"
                                onChange={onchangeInputHandler}
                            />
                        </Stack>
                        <Select
                            disabled={!isPossibleEdit}
                            appearance="Outline"
                            value={targetItem.filterLogiOption}
                            shape="Square"
                            size="SM"
                            status="default"
                            style={{
                                
                            }}
                            onChange={(
                                e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                                value: SelectValue<{}, false>
                            ) => {
                                onchangeSelectHandler(e, value, "filterLogiOption")
                            }}
                        >
                            {filterOption.map((item, index) => (
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
                                border:"1px solid rgb(218, 218, 218)",
                                borderRadius: '5px',
                                padding:"0.5rem"
                            }}
                        >
                            <Stack direction="Vertical" gap="SM">
                            {(trgtFilterList && setTrgtFilterList) && 
                            trgtFilterList.map((trgtFilterItem: TbRsCustFeatRuleTrgtFilter, index: number) => (
                                <BehvColDropItem 
                                    key={`behvCol-${index}`}
                                    itemIdx={index}
                                    isPossibleEdit={isPossibleEdit}
                                    trgtFilterItem={trgtFilterItem}
                                    setTrgtFilterList={setTrgtFilterList}
                                    deleteTrgtFilterInfo={deleteTrgtFilterInfo}
                                />
                            ))}
                            </Stack>
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
                    <Select 
                        disabled={!isPossibleEdit}
                        placeholder="집계할 컬럼" 
                        appearance="Outline"
                        value={targetItem.columnName}
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
                            // 집계함수에 사용될 컬럼명
                            onchangeSelectHandler(e, value, "columnName")
                        }}
                    >
                        {columnList.map((item, index) => (
                        <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                        ))}
                    </Select>
                    <Select 
                        disabled={!isPossibleEdit}
                        placeholder="집계 함수 선택" 
                        appearance="Outline"
                        value={targetItem.operator}
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
                            onchangeSelectHandler(e, value, "operator")
                        }}
                    >
                        {aggregateOption.map((item, index) => (
                        <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                        ))}
                    </Select>
                    {aggregateTopSelect &&
                        <>
                        <Select 
                            disabled={!isPossibleEdit}
                            placeholder="Top 기준 함수" 
                            appearance="Outline"
                            value={targetItem.operand1}
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
                                // Top 기준 함수
                                onchangeSelectHandler(e, value, "operand1")
                            }}
                        >
                            <SelectOption value="count">count</SelectOption>
                            <SelectOption value="last">last</SelectOption>
                        </Select>
                        <TextField 
                            disabled={!isPossibleEdit}
                            value={targetItem.operand2}
                            placeholder="Top 숫자 입력"
                            id="operand2"
                            onChange={onchangeInputHandler}
                        />
                        <Select 
                            appearance="Outline"
                            disabled={!isPossibleEdit}
                            placeholder="동률일 때 기준 컬럼" 
                            value={targetItem.operand3}
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
                                // 동률일 때 기준 컬럼
                                onchangeSelectHandler(e, value, "operand3")
                            }}
                        >
                            {columnList.map((item, index) => (
                            <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                            ))}
                        </Select>
                        <Select 
                            appearance="Outline"
                            disabled={!isPossibleEdit}
                            placeholder="동률일 때 기준 정렬" 
                            value={targetItem.operand4}
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
                                // 동률일 때 기준 정렬
                                onchangeSelectHandler(e, value, "operand4")
                            }}
                        >
                            <SelectOption value="asc">오름차순</SelectOption>
                            <SelectOption value="desc">내림차순</SelectOption>
                        </Select>
                        </>
                    }
                </Stack>
            </Stack>
            
            {isPossibleEdit &&
            <Button size="SM" onClick={onClickDeleteHandler}>
            삭제
            </Button>
            }
        </Stack>
    )
}

export default BehvDropItem