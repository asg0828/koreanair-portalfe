import { Button, Page, Stack, Typography } from "@components/ui"
import { useDrop } from "react-dnd"
import { cloneDeep } from 'lodash'
import { TbCoMetaTblClmnInfo, TbRsCustFeatRuleTrgtFilter, divisionTypes } from '@/models/selfFeature/FeatureInfo'
import { initTbCoMetaTblClmnInfo, initTbRsCustFeatRuleTrgtFilter } from "@/pages/user/self-feature/data"
import BehvColDropItem from "./BehvColDropItem"

const BehvDropItem = (props: any) => {

    const [, behvDrop] = useDrop(() => ({
        accept: divisionTypes.BEHV,
        drop(item, monitor) {
            const didDrop = monitor.didDrop()

            if (!didDrop) {
                let targetObj: TbCoMetaTblClmnInfo = Object.assign(initTbCoMetaTblClmnInfo, item)

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
        <Stack justifyContent="Start" gap="SM" className="width-100">
            <Typography variant="h6">{props.targetItem.tableName}</Typography>
            <Page
                ref={(behvDrop)}
                style={{
                    overflowY: 'scroll',
                    height: '100%',
                    border: '0.1em solid',
                    borderRadius: '5px',
                }}
            >
                {props.trgtFilterList.map((trgtFilterItem: TbRsCustFeatRuleTrgtFilter, index: number) => (
                    <BehvColDropItem 
                        key={index}
                        itemIdx={index}
                        deleteTrgtFilterInfo={deleteTrgtFilterInfo}
                        trgtFilterItem={trgtFilterItem}
                    />
                ))}
            </Page>
            <Button priority="Primary" appearance="Contained" size="LG" onClick={onClickDeleteHandler}>
            삭제
            </Button>
        </Stack>
    )
}

export default BehvDropItem