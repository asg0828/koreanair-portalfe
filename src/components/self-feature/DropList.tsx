import { useEffect, useState } from 'react'
import { useDrop } from 'react-dnd'
import { cloneDeep } from 'lodash'

import AttrDropItem from './dropItem/AttrDropItem'
import BehvDropItem from './dropItem/BehvDropItem'
import FeatDropItem from './dropItem/FeatDropItem'
import { Page, Stack, TextField, Typography } from '@components/ui'

import { 
    TbRsCustFeatRuleTrgt, 
    TbRsCustFeatRuleTrgtFilter, 
    TbCoMetaTblClmnInfo, 
    Attribute,
    TargetDropListProps,
    Behavior,
    AggregateCol,
    DivisionTypes,
    TbRsCustFeatRule, 
} from '@/models/selfFeature/FeatureModel'
import { 
    initAttribute, 
    initTbCoMetaTblClmnInfo, 
    initTbRsCustFeatRule, 
    initTbRsCustFeatRuleTrgt, 
    initTbRsCustFeatRuleTrgtFilter,
} from '@/pages/user/self-feature/data'
import {
    SubFeatStatus, 
    SelfFeatPgPpNm,
} from '@/models/selfFeature/FeatureCommon';

const DropList = ({
    featStatus,
    setIsSelectAggregateTop,
    targetList, 
    trgtFilterList,
    setTargetList,
    setTrgtFilterList,
    attributes,
    featureRules,
    behaviors,
    setFormulaTrgtList,
}: TargetDropListProps) => {

    const [ isPossibleEdit, setIsPossibleEdit ] = useState<Boolean>(false)
    const [ columnList, setColumnList ] = useState<Array<AggregateCol>>([])

    // 수정가능 여부 판단
    useEffect(() => {
        // 등록, 품의저장인 상태이면서 상세페이지가 아닌 경우 수정가능
        if (
            // (featStatus === SubFeatStatus.REG 
            // || featStatus === SubFeatStatus.SUBREG )
            // && 
            featStatus !== SelfFeatPgPpNm.DETL
        ) {
            setIsPossibleEdit(true)
        } else {
            setIsPossibleEdit(false)
        }

    }, [featStatus])

    // 속성 테이블의 해당 컬럼 리스트 set
    useEffect(()=> {
        let colList: Array<AggregateCol> = []
        attributes?.map((colInfo: Attribute) => {
            let col = { value: "", text: "", dataType: "", dtpCd: "" }
            col.value = colInfo.metaTblClmnPhysNm
            col.text  = colInfo.metaTblClmnLogiNm
            col.dataType = colInfo.dataTypeCategory
            col.dtpCd = colInfo.dtpCd
            colList.push(col)
            return colInfo
        })
        setColumnList(colList)
    }, [attributes])

    // 속성 테이블의 해당 컬럼 리스트 set
    useEffect(()=> {
        let colList: Array<AggregateCol> = []
        featureRules?.map((colInfo: TbRsCustFeatRule) => {
            let col = { value: "", text: "", dataType: "", dtpCd: "" }
            col.value = colInfo.featureEnNm
            col.text  = colInfo.name
            col.dataType = colInfo.dataTypeCategory.toString()
            col.dtpCd = colInfo.dataType
            colList.push(col)
            return colInfo
        })
        setColumnList(colList)
    }, [featureRules])

    const [, drop] = useDrop(() => ({
        accept: Object.values(DivisionTypes),
        drop(item, monitor) {
            const didDrop = monitor.didDrop()
            const targetType = monitor.getItemType()

            if (!didDrop) {
                let targetObj: TbCoMetaTblClmnInfo | Attribute | TbRsCustFeatRule
                if (targetType === DivisionTypes.ATTR) {
                    targetObj = Object.assign(cloneDeep(initAttribute), item)
                } else if (targetType === DivisionTypes.FEAT) {
                    targetObj = Object.assign(cloneDeep(initTbRsCustFeatRule), item)
                } else if (targetType === DivisionTypes.BEHV) {
                    targetObj = Object.assign(cloneDeep(initTbCoMetaTblClmnInfo), item)
                } else {
                    targetObj = initAttribute
                }
                let target: TbRsCustFeatRuleTrgt | TbRsCustFeatRuleTrgtFilter
                let t = 0
                setTargetList((state: Array<TbRsCustFeatRuleTrgt>) => {
                    // tableName(metaTblId),targetId(metaTblClmnId),divisionCode(ATTR|BEHV|FEAT)
                    let tl = cloneDeep(state)
                    t = tl.length
                    target = cloneDeep(initTbRsCustFeatRuleTrgt)
                    target.tableName = String(targetObj.metaTblId)
                    target.tableLogiName = String(targetObj.tableLogiName)
                    target.targetId  = `T${t+1}`
                    if (targetType === DivisionTypes.ATTR) {
                        target.columnName = String(targetObj.metaTblClmnPhysNm)
                        target.columnLogiName = String(targetObj.metaTblClmnLogiNm)
                    }
                    if (targetType === DivisionTypes.FEAT) {
                        target.columnName = String(targetObj.featureEnNm)
                        target.columnLogiName = String(targetObj.name)
                    }
                    target.divisionCode = String(targetType)
                    target.targetDataType = targetObj.dataTypeCategory.toString()//targetObj.dtpCd
                    target.dtpCd = targetObj.dtpCd.toString()
                    tl.push(target)
                    return tl
                })
                // 행동 데이터의 경우에만
                if (targetType === DivisionTypes.BEHV) {
                    setTrgtFilterList((state: Array<TbRsCustFeatRuleTrgtFilter>) => {
                        // tableName(metaTblId),targetId(metaTblClmnId),divisionCode(ATTR|BEHV|FEAT)
                        let tl = cloneDeep(state)
                        target = cloneDeep(initTbRsCustFeatRuleTrgtFilter)
                        //target.tableName = String(targetObj.metaTblLogiNm)
                        target.targetId  = `T${t+1}`
                        target.columnName = String(targetObj.metaTblClmnPhysNm)
                        target.columnLogiName = String(targetObj.metaTblClmnLogiNm)
                        target.columnDataTypeCode = targetObj.dataTypeCategory.toString()//targetObj.dtpCd
                        tl.push(target)
                        return tl
                    })
                }
            }

        },
        collect(monitor) {
        },
        
    }), [])

    // Feature 로직 정보 삭제시
    const deleteInfo = (delIdx: number, delTrgtId: string) => {
        setTargetList((state: Array<TbRsCustFeatRuleTrgt>) => {
            let newTargetList = cloneDeep(state)
            newTargetList.splice(delIdx, 1)
            newTargetList = newTargetList.map((target: TbRsCustFeatRuleTrgt, idx: number) => {
                let rtn = cloneDeep(target)
                rtn.targetId = `T${idx+1}`
                return rtn
            })
            return newTargetList
        })
        // target에 해당되는 target filter 리스트도 같이 삭제
        setTrgtFilterList((state: Array<TbRsCustFeatRuleTrgtFilter>) => {
            let newTrgtFilterList = cloneDeep(state)
            newTrgtFilterList = newTrgtFilterList.filter((trgtFilter: TbRsCustFeatRuleTrgtFilter) => trgtFilter.targetId !== delTrgtId)
            let reIdxingFilterList: Array<TbRsCustFeatRuleTrgtFilter> = newTrgtFilterList.filter((trgtFilter: TbRsCustFeatRuleTrgtFilter) => trgtFilter.targetId > delTrgtId)
            reIdxingFilterList = reIdxingFilterList.map((trgtFilter: TbRsCustFeatRuleTrgtFilter) => {
                let rtn = cloneDeep(trgtFilter)
                let idx = parseInt(rtn.targetId.replace("T", "")) - 1
                rtn.targetId = `T${idx}`
                return rtn
            })
            newTrgtFilterList = newTrgtFilterList.filter((trgtFilter: TbRsCustFeatRuleTrgtFilter) => trgtFilter.targetId < delTrgtId)
            return [...newTrgtFilterList, ...reIdxingFilterList]
        })
    }

    return (
        <Page
            ref={(drop)}
            style={{
                overflowY: 'auto',
                width: '80%',
                height: '100%',
                border: '1px solid rgb(218, 218, 218)',
                borderRadius: '5px',
                padding:"1rem"
            }}
            className='dropList'
        >
            <Stack 
                direction="Vertical"
                gap="MD"
                justifyContent="Start"
            >
            {targetList.length > 0 &&
                targetList.map((targetItem: TbRsCustFeatRuleTrgt, index: number) => {
                    let targetId = targetItem.targetId
                    let tfList = trgtFilterList.filter((trgtFilter: TbRsCustFeatRuleTrgtFilter) => trgtFilter.targetId === targetId)
                    if (targetItem.divisionCode === DivisionTypes.ATTR) {
                        return <AttrDropItem 
                            key={`dropItem-${index}`}
                            itemIdx={index}
                            isPossibleEdit={isPossibleEdit}
                            targetItem={targetItem} 
                            setTargetList={setTargetList}
                            delTargetInfo={deleteInfo}
                            columnList={columnList}
                        />
                    } else if (targetItem.divisionCode === DivisionTypes.FEAT) {
                        return <FeatDropItem
                            key={`dropItem-${index}`}
                            itemIdx={index}
                            isPossibleEdit={isPossibleEdit}
                            targetItem={targetItem}
                            setTargetList={setTargetList}
                            delTargetInfo={deleteInfo}
                            columnList={columnList}
                        />
                    } else if (targetItem.divisionCode === DivisionTypes.BEHV) {
                        let bs = behaviors.find((behavior: Behavior) => (behavior.metaTblId === targetItem.tableName))
                        return <BehvDropItem 
                            key={`dropItem-${index}`}
                            itemIdx={index}
                            isPossibleEdit={isPossibleEdit}
                            setIsSelectAggregateTop={setIsSelectAggregateTop}
                            targetItem={targetItem}
                            trgtFilterList={tfList}
                            setTargetList={setTargetList} 
                            setTrgtFilterList={setTrgtFilterList} 
                            delTargetInfo={deleteInfo}
                            aggregateColList={bs?.tbCoMetaTblClmnInfoList}
                            setFormulaTrgtList={setFormulaTrgtList}
                        />
                    }
                })
            }
            {targetList.length === 0 &&
                <TextField 
                    size='LG' 
                    shape='Round' 
                    appearance='Filled'
                    readOnly
                    value={'오른쪽 Fact/BaseFact 정보의 컬럼을 해당 영역으로 Drag&Drop하여 대상을 선택해주세요.'}
                >
                </TextField>
            }
            </Stack>
        </Page>
    )

}

export default DropList