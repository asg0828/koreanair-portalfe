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
    divisionTypes, 
    TbCoMetaTblClmnInfo, 
    Attribute, 
    subFeatStatus, 
    selfFeatPgPpNm
} from '@/models/selfFeature/FeatureInfo'
import { 
    initAttribute, 
    initTbCoMetaTblClmnInfo, 
    initTbRsCustFeatRuleTrgt, 
    initTbRsCustFeatRuleTrgtFilter 
} from '@/pages/user/self-feature/data'

const DropList = (props: any) => {

    const [ isPossibleEdit, setIsPossibleEdit ] = useState<Boolean>(false)

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
                    target.targetId  = `${String(targetObj.metaTblId)}_${trgtUniqKey}`
                    target.columnName = String(targetObj.metaTblClmnLogiNm)
                    target.divisionCode = String(targetType)
                    tl.push(target)
                    return tl
                })

                props.setTrgtFilterList((state: Array<TbRsCustFeatRuleTrgtFilter>) => {
                    // tableName(metaTblId),targetId(metaTblClmnId),divisionCode(ATTR|BEHV|FEAT)
                    let tl = cloneDeep(state)
                    target = cloneDeep(initTbRsCustFeatRuleTrgtFilter)
                    target.tableName = String(targetObj.metaTblId)
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

    const deleteInfo = (delIdx: number, delTrgtId: string) => {
        props.setTargetList((state: Array<TbRsCustFeatRuleTrgt>) => {
            let newTargetList = cloneDeep(state)
            newTargetList.splice(delIdx, 1)
            return newTargetList
        })
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
                border: '0.1em solid rgb(218, 218, 218)',
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
                            trgtFilterList={tfList}
                            targetItem={targetItem} 
                            setTargetList={props.setTargetList} 
                            setTrgtFilterList={props.setTrgtFilterList} 
                            delTargetInfo={deleteInfo}
                        />
                    } else if (targetItem.divisionCode === divisionTypes.FEAT) {
                        return <FeatDropItem
                            key={`dropItem-${index}`}
                            itemIdx={index}
                            isPossibleEdit={isPossibleEdit}
                            trgtFilterList={tfList}
                            targetItem={targetItem}
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
                            targetId={targetItem.targetId}
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