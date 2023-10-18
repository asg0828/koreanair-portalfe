import { useEffect, useState } from 'react'
import { useDrop } from 'react-dnd'
import { cloneDeep } from 'lodash'
import { divisionTypes } from '@/models/selfFeature/FeatureInfo'

import AttrDropItem from './dropItem/AttrDropItem'
import BehvDropItem from './dropItem/BehvDropItem'
import FeatDropItem from './dropItem/FeatDropItem'
import { Page, Stack } from '@components/ui'

const DropList = (props: any) => {

    const [ targetList, setTargetList ] = useState<Array<any>>([])

    useEffect(()=> {
        if (targetList.length < 1) return

        console.log(`DropList component targetList update :: `, targetList)
        
    }, [targetList])

    useEffect(()=> {
        if (props.dropList.length < 1) return

        console.log(`Parenet Props DropList Info :: `, props.dropList)

        setTargetList(cloneDeep(props.dropList))

    }, [props.dropList])

    const [, drop] = useDrop(() => ({
        accept: Object.values(divisionTypes),
        drop(item, monitor) {
            const didDrop = monitor.didDrop()

            if (!didDrop) {
                setTargetList((state: Array<any>) => {
                    let tl = cloneDeep(state)
                    tl.push(item)
                    props.getDropList(tl)
                    return tl
                })
            }

        },
        collect(monitor) {
            
        },
    }), [])

    const deleteInfo = (deleteIdx: number) => {
        setTargetList((state: Array<any>) => {
            let newDropList = cloneDeep(state)
            newDropList.splice(deleteIdx, 1)
            props.getDropList(newDropList)
            return newDropList
        })
    }

    const getBehvColDropList = (itemIdx: number, behvColList: Array<any>) => {
        console.log(`Bevh Col List Info :: `, itemIdx, behvColList)
        setTargetList((state: Array<any>) => {
            let newDropList = cloneDeep(state)
            newDropList[itemIdx].colList = behvColList
            props.getDropList(newDropList)
            return newDropList
        })
    }

    return (
        <Page
            ref={(drop)}
            style={{
                overflowY: 'scroll',
                width: '850%',
                height: '100%',
                border: '0.1em solid',
                borderRadius: '5px',
            }}
        >
            <Stack 
                direction="Vertical"
                gap="MD"
                justifyContent="Start"
            >
            {
                targetList.map((dropItem: any, index: number) => {
                    if (dropItem.divisionCode === divisionTypes.ATTR) {
                        return <AttrDropItem 
                            key={`dropItem-${index}`}
                            itemIdx={index}
                            dropItem={dropItem} 
                            deleteInfo={deleteInfo}
                        />
                    } else if (dropItem.divisionCode === divisionTypes.FEAT) {
                        return <FeatDropItem
                            key={`dropItem-${index}`}
                            itemIdx={index}
                            dropItem={dropItem}
                            deleteInfo={deleteInfo}
                        />
                    } else if (dropItem.divisionCode === divisionTypes.BEHV) {
                        return <BehvDropItem 
                            key={`dropItem-${index}`}
                            itemIdx={index}
                            dropItem={dropItem.colList}
                            getBehvColDropList={getBehvColDropList}
                            deleteInfo={deleteInfo}
                        />
                    }
                })
            }
            </Stack>
        </Page>
    )

}

export default DropList