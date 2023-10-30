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
} from '@/models/selfFeature/FeatureInfo'
import { 
    initAttribute, 
    initTbCoMetaTblClmnInfo, 
    initTbRsCustFeatRuleTrgt, 
    initTbRsCustFeatRuleTrgtFilter,
    subFeatStatus, 
    selfFeatPgPpNm,
    divisionTypes, 
} from '@/pages/user/self-feature/data'

const DropList = (props: any) => {

    const [ isPossibleEdit, setIsPossibleEdit ] = useState<Boolean>(false)

    // 수정가능 여부 판단
    useEffect(() => {
        // 등록, 품의저장인 상태이면서 상세페이지가 아닌 경우 수정가능
        if (
            (props.featStatus === subFeatStatus.REG 
            || props.featStatus === subFeatStatus.SUBREG )
            && props.featStatus !== selfFeatPgPpNm.DETL
        ) {
            setIsPossibleEdit(true)
        } else {
            setIsPossibleEdit(false)
        }

    }, [props.featStatus])

    const [, drop] = useDrop(() => ({
        accept: Object.values(divisionTypes),
        drop(item, monitor) {
            const didDrop = monitor.didDrop()
            const targetType = monitor.getItemType()
            const date: Date = new Date()
            const trgtUniqKey = `${date.getFullYear()}${date.getMonth()}${date.getDate()+1}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}`
            
            if (!didDrop) {
                let targetObj: TbCoMetaTblClmnInfo | Attribute

                if (targetType === divisionTypes.ATTR) {
                    targetObj = Object.assign(cloneDeep(initAttribute), item)
                } else if (targetType === divisionTypes.BEHV) {
                    targetObj = Object.assign(cloneDeep(initTbCoMetaTblClmnInfo), item)
                }

                let target: TbRsCustFeatRuleTrgt | TbRsCustFeatRuleTrgtFilter
                props.setTargetList((state: Array<TbRsCustFeatRuleTrgt>) => {
                    // tableName(metaTblId),targetId(metaTblClmnId),divisionCode(ATTR|BEHV|FEAT)
                    let tl = cloneDeep(state)
                    target = cloneDeep(initTbRsCustFeatRuleTrgt)
                    target.tableName = String(targetObj.metaTblId)
                    // target과 그에 해당하는 targetFilter의 인덱싱은 바뀔 수 있음.
                    target.targetId  = `${String(targetObj.metaTblId)}_${trgtUniqKey}`
                    target.columnName = String(targetObj.metaTblClmnLogiNm)
                    target.divisionCode = String(targetType)
                    tl.push(target)
                    return tl
                })
                // 행동 데이터의 경우에만 해당일까?
                props.setTrgtFilterList((state: Array<TbRsCustFeatRuleTrgtFilter>) => {
                    // tableName(metaTblId),targetId(metaTblClmnId),divisionCode(ATTR|BEHV|FEAT)
                    let tl = cloneDeep(state)
                    target = cloneDeep(initTbRsCustFeatRuleTrgtFilter)
                    target.tableName = String(targetObj.metaTblId)
                    // target과 그에 해당하는 targetFilter의 인덱싱은 바뀔 수 있음.
                    target.targetId  = `${String(targetObj.metaTblId)}_${trgtUniqKey}`
                    target.columnName = String(targetObj.metaTblClmnLogiNm)
                    tl.push(target)
                    return tl
                })
            }

        },
        collect(monitor) {

        },
        
    }), [])

    // 대상 선택 정보 삭제시
    const deleteInfo = (delIdx: number, delTrgtId: string) => {
        props.setTargetList((state: Array<TbRsCustFeatRuleTrgt>) => {
            let newTargetList = cloneDeep(state)
            newTargetList.splice(delIdx, 1)
            return newTargetList
        })
        // target에 해당되는 target filter 리스트도 같이 삭제
        props.setTrgtFilterList((state: Array<TbRsCustFeatRuleTrgtFilter>) => {
            let newTrgtFilterList = cloneDeep(state)
            newTrgtFilterList = newTrgtFilterList.filter((trgtFilter: TbRsCustFeatRuleTrgtFilter) => trgtFilter.targetId !== delTrgtId)
            return newTrgtFilterList
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
        >
            <Stack 
                direction="Vertical"
                gap="MD"
                justifyContent="Start"
            >
            {
                props.targetList.map((targetItem: TbRsCustFeatRuleTrgt, index: number) => {
                    
                    // target과 그에 해당하는 targetFilter의 인덱싱은 바뀔 수 있음.
                    let targetId = targetItem.targetId
                    let tfList: Array<TbRsCustFeatRuleTrgtFilter> = []
                    props.trgtFilterList.map((trgtFilter: TbRsCustFeatRuleTrgtFilter) => {
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
                            trgtFilterList={tfList}
                            setTargetList={props.setTargetList} 
                            setTrgtFilterList={props.setTrgtFilterList} 
                            delTargetInfo={deleteInfo}
                        />
                    } else if (targetItem.divisionCode === divisionTypes.FEAT) {
                        return <FeatDropItem
                            key={`dropItem-${index}`}
                            itemIdx={index}
                            isPossibleEdit={isPossibleEdit}
                            targetItem={targetItem}
                            trgtFilterList={tfList}
                            setTargetList={props.setTargetList} 
                            setTrgtFilterList={props.setTrgtFilterList}
                            delTargetInfo={deleteInfo}
                        />
                    } else if (targetItem.divisionCode === divisionTypes.BEHV) {
                        return <BehvDropItem 
                            key={`dropItem-${index}`}
                            itemIdx={index}
                            isPossibleEdit={isPossibleEdit}
                            targetItem={targetItem}
                            trgtFilterList={tfList}
                            setTargetList={props.setTargetList} 
                            setTrgtFilterList={props.setTrgtFilterList} 
                            delTargetInfo={deleteInfo}
                        />
                    }
                })
            }
            </Stack>
        </Page>
    )

}

export default DropList