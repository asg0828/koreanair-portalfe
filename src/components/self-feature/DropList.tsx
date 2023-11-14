import { useEffect, useState } from 'react'
import { useDrop } from 'react-dnd'
import { cloneDeep } from 'lodash'

import AttrDropItem from './dropItem/AttrDropItem'
import BehvDropItem from './dropItem/BehvDropItem'
import FeatDropItem from './dropItem/FeatDropItem'
import { Page, Stack } from '@components/ui'

import { 
    TbRsCustFeatRuleTrgt, 
    TbRsCustFeatRuleTrgtFilter, 
    TbCoMetaTblClmnInfo, 
    Attribute,
    TargetDropListProps,
    Behavior, 
} from '@/models/selfFeature/FeatureInfo'
import { 
    initAttribute, 
    initTbCoMetaTblClmnInfo, 
    initTbRsCustFeatRuleTrgt, 
    initTbRsCustFeatRuleTrgtFilter,
    divisionTypes, 
} from '@/pages/user/self-feature/data'
import {
    subFeatStatus, 
    selfFeatPgPpNm,
} from '@/models/selfFeature/FeatureCommon';

const DropList = ({
    featStatus,
    setIsSelectAggregateTop,
    targetList, 
    trgtFilterList,
    setTargetList,
    setTrgtFilterList,
    behaviors,
    setFormulaTrgtList,
}: TargetDropListProps) => {

    const [ isPossibleEdit, setIsPossibleEdit ] = useState<Boolean>(false)

    // 수정가능 여부 판단
    useEffect(() => {
        // 등록, 품의저장인 상태이면서 상세페이지가 아닌 경우 수정가능
        if (
            (featStatus === subFeatStatus.REG 
            || featStatus === subFeatStatus.SUBREG )
            && featStatus !== selfFeatPgPpNm.DETL
        ) {
            setIsPossibleEdit(true)
        } else {
            setIsPossibleEdit(false)
        }

    }, [featStatus])

    const [, drop] = useDrop(() => ({
        accept: Object.values(divisionTypes),
        drop(item, monitor) {
            const didDrop = monitor.didDrop()
            const targetType = monitor.getItemType()

            /*
            const date: Date = new Date()
            const trgtUniqKey = `${date.getFullYear()}${date.getMonth()}${date.getDate()+1}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}`
            */

            if (!didDrop) {
                let targetObj: TbCoMetaTblClmnInfo | Attribute
                if (targetType === divisionTypes.ATTR) {
                    targetObj = Object.assign(cloneDeep(initAttribute), item)
                } else if (targetType === divisionTypes.BEHV) {
                    targetObj = Object.assign(cloneDeep(initTbCoMetaTblClmnInfo), item)
                }
                let target: TbRsCustFeatRuleTrgt | TbRsCustFeatRuleTrgtFilter
                let t = 0
                setTargetList((state: Array<TbRsCustFeatRuleTrgt>) => {
                    // tableName(metaTblId),targetId(metaTblClmnId),divisionCode(ATTR|BEHV|FEAT)
                    let tl = cloneDeep(state)
                    t = tl.length
                    target = cloneDeep(initTbRsCustFeatRuleTrgt)
                    target.tableName = String(targetObj.metaTblLogiNm)
                    target.targetId  = `T${t+1}`
                    target.columnName = String(targetObj.metaTblClmnLogiNm)
                    target.divisionCode = String(targetType)
                    target.targetDataType = targetObj.dataTypeCategory//targetObj.dtpCd
                    tl.push(target)
                    return tl
                })
                // 행동 데이터의 경우에만
                if (targetType === divisionTypes.BEHV) {
                    setTrgtFilterList((state: Array<TbRsCustFeatRuleTrgtFilter>) => {
                        // tableName(metaTblId),targetId(metaTblClmnId),divisionCode(ATTR|BEHV|FEAT)
                        let tl = cloneDeep(state)
                        target = cloneDeep(initTbRsCustFeatRuleTrgtFilter)
                        target.tableName = String(targetObj.metaTblLogiNm)
                        target.targetId  = `T${t+1}`
                        target.columnName = String(targetObj.metaTblClmnLogiNm)
                        target.columnDataTypeCode = targetObj.dataTypeCategory//targetObj.dtpCd
                        tl.push(target)
                        return tl
                    })
                }
            }

        },
        collect(monitor) {
        },
        
    }), [])

    // 대상 선택 정보 삭제시
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
            {
                targetList.map((targetItem: TbRsCustFeatRuleTrgt, index: number) => {
                    let targetId = targetItem.targetId
                    let tfList: Array<TbRsCustFeatRuleTrgtFilter> = []
                    trgtFilterList.map((trgtFilter: TbRsCustFeatRuleTrgtFilter) => {
                        if (targetId === trgtFilter.targetId) {
                            tfList.push(cloneDeep(trgtFilter))
                        }
                    })
                    if (targetItem.divisionCode === divisionTypes.ATTR) {
                        return <AttrDropItem 
                            key={`dropItem-${index}`}
                            itemIdx={index}
                            isPossibleEdit={isPossibleEdit}
                            targetItem={targetItem} 
                            setTargetList={setTargetList}
                            delTargetInfo={deleteInfo}
                        />
                    } else if (targetItem.divisionCode === divisionTypes.FEAT) {
                        return <FeatDropItem
                            key={`dropItem-${index}`}
                            itemIdx={index}
                            isPossibleEdit={isPossibleEdit}
                            targetItem={targetItem}
                            delTargetInfo={deleteInfo}
                        />
                    } else if (targetItem.divisionCode === divisionTypes.BEHV) {
                        let bs = behaviors.filter((behavior: Behavior) => (behavior.metaTblLogiNm === targetItem.tableName || behavior.metaTblId === targetItem.tableName))
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
                            aggregateColList={bs[0]?.tbCoMetaTblClmnInfoList}
                            setFormulaTrgtList={setFormulaTrgtList}
                        />
                    }
                })
            }
            </Stack>
        </Page>
    )

}

export default DropList