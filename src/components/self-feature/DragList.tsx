import AttrDragItem from "./dragItem/AttrDragItem"
import BehvDragItem from "./dragItem/BehvDragItem"
import { Accordion, AccordionItem, Button, Page, Stack, TextField } from "@components/ui"

import { 
  Behavior,
  TbCoMetaTblClmnInfo,
  Attribute
} from '@/models/selfFeature/FeatureModel';
import { useEffect, useState } from "react";
import { cloneDeep } from "lodash";

export interface Props {
    attributes: Array<Attribute>
    behaviors: Array<Behavior>
}

const DragList = ({
    attributes,
    behaviors
}: Props) => {

    const [ keyword, setKeyword ] = useState<string>('')
    const [ srchAttrRsltList, setSrchAttrRsltList ] = useState<Array<Attribute>>([])
    const [ srchBehvRsltList, setSrchBehvRsltList ] = useState<Array<Behavior>>([])

    useEffect(() => {
        if (attributes.length < 1) return

        let attrList: Array<Attribute> = cloneDeep(attributes)
        setSrchAttrRsltList(attrList)
    }, [attributes])

    useEffect(() => {
        if (behaviors.length < 1) return
        
        let behvList: Array<Behavior> = cloneDeep(behaviors)
        setSrchBehvRsltList(behvList)
    }, [behaviors])

    useEffect(() => {
    }, [srchAttrRsltList])

    useEffect(() => {
    }, [srchBehvRsltList])

    const searchAttrList = (keyword: string) => {
        let attrList: Array<Attribute> = cloneDeep(attributes)
        if (keyword.trim() === '') {
            setSrchAttrRsltList(attrList)
            return
        }
        attrList = attrList.filter((attribute: Attribute) => attribute.metaTblClmnLogiNm.indexOf(keyword) > -1? true : false)
        setSrchAttrRsltList(attrList)
    }

    const searchBehvList = (keyword: string) => {
        let behvList: Array<Behavior> = cloneDeep(behaviors)
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

    const onClickTrgtSrchHandler = () => {
        searchAttrList(keyword)
        searchBehvList(keyword)
    }

    const onKeyPressTrgtSrchHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onClickTrgtSrchHandler()
        }
    }

    return (
        <Page
            style={{
                overflowY: 'auto',
                width:'20%',
                height: '100%',
                border: '1px solid rgb(218, 218, 218)',
                borderRadius: '5px',
                padding:"1rem"
            }}
        >
            <Stack direction="Horizontal" gap="SM" justifyContent="Between">
                <TextField 
                    size="MD" 
                    value={keyword} 
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={onKeyPressTrgtSrchHandler}
                />
                <Button priority="Primary" appearance="Contained" size="MD" onClick={onClickTrgtSrchHandler}>
                    <span className="searchIcon"></span>
                </Button>
            </Stack>
            <Accordion
                align="Right"
                size="MD"
                type="multiple"
                style={{marginTop:"10px"}}
            >
                <AccordionItem
                    title='Fact 정보'
                    value='Fact 정보'
                >
                {srchAttrRsltList.length > 0 &&
                <Stack direction="Vertical" justifyContent="Center" gap="SM" >
                {srchAttrRsltList.map((attribute: Attribute, index: number) => {
                    return <AttrDragItem
                        key={index}
                        attrTblClmnInfo={attribute}
                    />
                })}
                </Stack>
                }
                </AccordionItem>
            </Accordion>
            {/* Feature 정보
            {features.map(() => {

            })}
            */}
            {srchBehvRsltList.length > 0 &&
            <Accordion
                align="Right"
                size="MD"
                type="multiple"
            >
                <AccordionItem
                    title='BaseFact 정보'
                    value='BaseFact 정보'
                >
                {srchBehvRsltList.map((behavior: Behavior, behvIdx: number) => (
                    <Accordion
                        key={behvIdx}
                        align="Right"
                        size="MD"
                        type="multiple"
                    >
                        <AccordionItem
                            title={behavior.metaTblLogiNm}
                            value={behavior.metaTblLogiNm}
                        >
                        <Stack direction="Vertical" justifyContent="Center" gap="SM" >
                        {behavior.tbCoMetaTblClmnInfoList.map((tbCoMetaTblClmnInfo: TbCoMetaTblClmnInfo, clmnIdx: number) => (
                            <BehvDragItem
                                key={clmnIdx}
                                metaTblLogiNm={behavior.metaTblLogiNm}
                                behvTblClmnInfo={tbCoMetaTblClmnInfo}
                            />
                        ))}
                        </Stack>
                        </AccordionItem>
                    </Accordion>
                ))}
                </AccordionItem>
            </Accordion>
            }
        </Page>
    )
}

export default DragList