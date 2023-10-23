import AttrDragItem from "./dragItem/AttrDragItem"
import BehvDragItem from "./dragItem/BehvDragItem"
import { Accordion, AccordionItem, Button, Page, TextField } from "@components/ui"

import { 
  Behavior,
  TbCoMetaTblClmnInfo,
  Attribute
} from '@/models/selfFeature/FeatureInfo';
import { useEffect, useState } from "react";
import { cloneDeep } from "lodash";

const DragList = (props: any) => {

    const [ keyword, setKeyword ] = useState<string>('')
    const [ srchAttrRsltList, setSrchAttrRsltList ] = useState<Array<Attribute>>([])
    const [ srchBehvRsltList, setSrchBehvRsltList ] = useState<Array<Behavior>>([])

    useEffect(() => {
        let attrList: Array<Attribute> = cloneDeep(props.attributes)
        setSrchAttrRsltList(attrList)
    }, [props.attributes])

    useEffect(() => {
        let behvList: Array<Behavior> = cloneDeep(props.behaviors)
        setSrchBehvRsltList(behvList)
    }, [props.behaviors])

    useEffect(() => {

    }, [srchAttrRsltList])

    useEffect(() => {
        
    }, [srchBehvRsltList])

    const searchAttrList = (keyword: string) => {
        let attrList: Array<Attribute> = cloneDeep(props.attributes)
        if (keyword.trim() === '') {
            setSrchAttrRsltList(attrList)
            return
        }
        attrList = attrList.filter((attribute: Attribute) => attribute.metaTblClmnLogiNm.indexOf(keyword) > -1? true : false)
        setSrchAttrRsltList(attrList)
    }

    const searchBehvList = (keyword: string) => {
        let behvList: Array<Behavior> = cloneDeep(props.behaviors)
        if (keyword.trim() === '') {
            setSrchBehvRsltList(behvList)
            return
        }
        behvList = behvList.map((behavior: Behavior) => {
            let behvClmnList: Array<TbCoMetaTblClmnInfo> = cloneDeep(behavior.tbCoMetaTblClmnInfoList)
            behvClmnList = behvClmnList.filter((behavior: TbCoMetaTblClmnInfo) => behavior.metaTblClmnLogiNm.indexOf(keyword) > -1? true : false )
            behavior.tbCoMetaTblClmnInfoList = behvClmnList
            return behavior
        })
        setSrchBehvRsltList(behvList)
    }

    const onClickSearchHandler = () => {
        searchAttrList(keyword)
        searchBehvList(keyword)
    }

    return (
        <Page
            style={{
                overflowY: 'scroll',
                height: '100%',
                border: '0.1em solid',
                borderRadius: '5px',
            }}
        >
            {/* 자체 검색 기능 추가 필요 */}
            <TextField className="width-100" value={keyword} onChange={(e) => setKeyword(e.target.value)}/>
            <Button priority="Primary" appearance="Contained" size="XS" onClick={onClickSearchHandler}>
                검색
            </Button>

            <Accordion
                align="Right"
                size="SM"
                type="multiple"
            >
                <AccordionItem
                    title='속성 정보'
                    value='속성 정보'
                >
                {srchAttrRsltList && srchAttrRsltList.map((attribute: Attribute, index: number) => {
                    return <AttrDragItem
                        key={index}
                        attrTblClmnInfo={attribute}
                    />
                })}
                </AccordionItem>
            </Accordion>
            {/* Feature 정보
            {props.features.map(() => {

            })}
            */}
            <Accordion
                align="Right"
                size="SM"
                type="multiple"
            >
                <AccordionItem
                    title='행동 정보'
                    value='행동 정보'
                >
                {srchBehvRsltList && srchBehvRsltList.map((behavior: Behavior, behvIdx: number) => (
                    <Accordion
                        key={behvIdx}
                        align="Right"
                        size="SM"
                        type="multiple"
                    >
                        <AccordionItem
                            title={behavior.metaTblLogiNm}
                            value={behavior.metaTblLogiNm}
                        >
                        {behavior.tbCoMetaTblClmnInfoList.map((tbCoMetaTblClmnInfo: TbCoMetaTblClmnInfo, clmnIdx: number) => (
                            <BehvDragItem
                                key={clmnIdx}
                                behvTblClmnInfo={tbCoMetaTblClmnInfo}
                            />
                        ))}
                        </AccordionItem>
                    </Accordion>
                ))}
                </AccordionItem>
            </Accordion>
        </Page>
    )
}

export default DragList