import { useEffect, useState } from "react";
import { cloneDeep } from "lodash";

import AttrDragItem from "./dragItem/AttrDragItem"
import BehvAccordionDrag from "./dragItem/BehvAccordionDrag";
import { Accordion, AccordionItem, Button, Page, Stack, TextField } from "@components/ui"

import {
    Behavior,
    TbCoMetaTblClmnInfo,
    Attribute,
    TrgtDragAttrType,
    AttributeAccordian,
} from '@/models/selfFeature/FeatureModel';
import AttrAccordionDrag from "./dragItem/AttrAccordionDrag";

export interface Props {
    attributes: Array<Attribute>
    behaviors: Array<Behavior>
}

const DragList = ({
    attributes,
    behaviors
}: Props) => {

    const [keyword, setKeyword] = useState<string>('')
    const [srchAttrRsltList, setSrchAttrRsltList] = useState<Array<Attribute>>([])
    const [srchBehvRsltList, setSrchBehvRsltList] = useState<Array<Behavior>>([])
    // 속성정보 구분 ori list
    const [oriAttrAccordian, setOriAttrAccordian] = useState<Array<AttributeAccordian>>([])
    // 속성정보 구분 list
    const [attrAccordian, setAttrAccordian] = useState<Array<AttributeAccordian>>([])
    // 속성정보 아코디언
    const [defaultAttr, setDefaultAttr] = useState<Array<string>>([])
    // 행동정보 아코디언
    const [defaultBehv, setDefaultBehv] = useState<Array<string>>([])

    const distinctAttrList = (result: Array<AttributeAccordian>, arr: Array<Attribute>, tblNm: string) => {
        let pushItem: AttributeAccordian = { metaTblLogiNm: tblNm, attributes: arr.filter((item) => item.metaTblLogiNm === tblNm) }
        result.push(pushItem)
        return arr.filter((item) => item.metaTblLogiNm !== tblNm)
    }
    useEffect(() => {
        if (attributes.length < 1 || attributes[0].metaTblId === "") return

        let attrList: Array<Attribute> = cloneDeep(attributes)
        let tempAttrList: Array<AttributeAccordian> = []
        while (attrList.length !== 0) attrList = distinctAttrList(tempAttrList, attrList, attrList[0].metaTblLogiNm)
        setOriAttrAccordian(tempAttrList)

        setSrchAttrRsltList(cloneDeep(attributes))

        if (attributes.length > 0) setDefaultAttr(["Fact 정보"])
        else setDefaultAttr([])

    }, [attributes])

    useEffect(() => {
        if (behaviors.length < 1) return

        let behvList: Array<Behavior> = cloneDeep(behaviors)
        setSrchBehvRsltList(behvList)

        if (behvList.length > 0) setDefaultBehv(["BaseFact 정보"])
        else setDefaultBehv([])

    }, [behaviors])

    useEffect(() => {
        let attrList: Array<Attribute> = cloneDeep(srchAttrRsltList)
        let tempAttrList: Array<AttributeAccordian> = []
        while (attrList.length !== 0) attrList = distinctAttrList(tempAttrList, attrList, attrList[0].metaTblLogiNm)
        setAttrAccordian(tempAttrList)

    }, [srchAttrRsltList])

    useEffect(() => {
    }, [srchBehvRsltList])

    const searchAttrList = (keyword: string) => {
        let attrList: Array<Attribute> = cloneDeep(attributes)
        if (keyword.trim() === '') {
            setSrchAttrRsltList(attrList)
            return
        }
        attrList = attrList.filter((attribute: Attribute) => attribute.metaTblClmnLogiNm.indexOf(keyword) > -1 ? true : false)
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
            behvClmnList = behvClmnList.filter((behavior: TbCoMetaTblClmnInfo) => behavior.metaTblClmnLogiNm.indexOf(keyword) > -1 ? true : false)
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
                width: '25%',
                height: '100%',
                border: '1px solid rgb(218, 218, 218)',
                borderRadius: '5px',
                padding: "1rem"
            }}
            onClick={(e) => e.stopPropagation()}
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
                style={{ marginTop: "10px" }}
                onClick={(e) => {
                    e.stopPropagation()
                    setDefaultAttr((prevState: Array<string>) => {
                        if (prevState.length > 0) return []
                        else return ["Fact 정보"]
                    })
                }}
                value={defaultAttr}
            >
                <AccordionItem
                    title='Fact 정보'
                    value='Fact 정보'
                >
                    {attrAccordian.map((attribute: AttributeAccordian, attrIdx: number) => {
                        let ori = oriAttrAccordian.find((item) => item.metaTblLogiNm === attribute.metaTblLogiNm)
                        return (
                            <AttrAccordionDrag
                                key={attrIdx}
                                oriAttrbute={ori ? ori : null}
                                attrbute={attribute}
                            />
                        )
                    })}
                </AccordionItem>
            </Accordion>
            {/* Feature 정보
            {features.map(() => {

            })}
            */}
            <Accordion
                align="Right"
                size="MD"
                type="multiple"
                style={{ marginTop: "10px" }}
                onClick={(e) => {
                    e.stopPropagation()
                    setDefaultBehv((prevState: Array<string>) => {
                        if (prevState.length > 0) return []
                        else return ["BaseFact 정보"]
                    })
                }}
                value={defaultBehv}
            >
                <AccordionItem
                    title='BaseFact 정보'
                    value='BaseFact 정보'
                >
                    {srchBehvRsltList.map((behavior: Behavior, behvIdx: number) => (
                        <BehvAccordionDrag
                            key={behvIdx}
                            oriBehavior={behaviors[behvIdx]}
                            behavior={behavior}
                        />
                    ))}
                </AccordionItem>
            </Accordion>
        </Page>
    )
}

export default DragList