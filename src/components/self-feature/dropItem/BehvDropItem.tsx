import { Button, Page, Stack, TextField } from "@components/ui"
import { useEffect, useState } from "react"
import { useDrop } from "react-dnd"
import { cloneDeep } from 'lodash'
import { divisionTypes } from '@/models/selfFeature/FeatureInfo'

const BehvDropItem = (props: any) => {

    const [ behvColList, setBehvColList ] = useState<Array<any>>([])

    useEffect(()=> {
        if (behvColList.length < 1) return

        console.log(`DropList component behvColList update :: `, behvColList)

    }, [behvColList])

    useEffect(()=> {
        if (props.dropItem.length < 1) return

        console.log(`DropList component behvColList update :: `, behvColList)

        setBehvColList(cloneDeep(props.dropItem))

    }, [props.dropItem])

    const [, behvDrop] = useDrop(() => ({
        accept: divisionTypes.BEHV,
        drop(item, monitor) {
            const didDrop = monitor.didDrop()

            if (!didDrop) {
                setBehvColList((state: Array<any>) => {
                    let tl = cloneDeep(state)
                    tl.push(item)
                    props.getBehvColDropList(props.itemIdx, tl)
                    return tl
                })
            }

        },
        collect(monitor) {
            
        },
    }), [])
    
    const onClickColDeleteHandler = (idx: number) => {
        setBehvColList((state: Array<any>) => {
            let newDropList = cloneDeep(state)
            newDropList.splice(idx, 1)
            props.getBehvColDropList(props.itemIdx, newDropList)
            return newDropList
        })
    }

    const onClickDeleteHandler = () => {
        props.deleteInfo(props.itemIdx)
    }

    return (
        <Stack justifyContent="Start" gap="SM" className="width-100">
            <Page
                ref={(behvDrop)}
                style={{
                    overflowY: 'scroll',
                    height: '100%',
                    border: '0.1em solid',
                    borderRadius: '5px',
                }}
            >
                {behvColList.map((colItem: any, index: number) => (
                    <Stack 
                        key={index}
                        justifyContent="Start"
                        gap="SM"
                        className="width-100"
                    >
                        <TextField 
                            style={{backgroundColor: '##e0ffff', color: 'white'}}
                            appearance="Filled"
                            defaultValue={colItem.content}
                            placeholder=""
                            disabled
                            readOnly
                            shape="Round"
                            size="SM"
                        />
                        <Button priority="Primary" appearance="Contained" size="SM" onClick={() => onClickColDeleteHandler(index)}>
                        컬럼삭제
                        </Button>
                    </Stack>
                ))}
            </Page>
            <Button priority="Primary" appearance="Contained" size="LG" onClick={onClickDeleteHandler}>
            삭제
            </Button>
        </Stack>
    )
}

export default BehvDropItem