import { useEffect, useState } from "react";
import { cloneDeep } from "lodash";

import BehvAccordionDrag from "./dragItem/BehvAccordionDrag";
import { Accordion, AccordionItem, Button, Page, Stack, TextField } from "@components/ui"

import {
    Behavior,
    TbCoMetaTblClmnInfo,
    Attribute,
    AttributeAccordian,
    TbRsCustFeatRule,
    FeatAccordian,
} from '@/models/selfFeature/FeatureModel';
import AttrAccordionDrag from "./dragItem/AttrAccordionDrag";
import FeatDragItem from "./dragItem/FeatDragItem";
import FeatAccordionDrag from "./dragItem/FeatAccordionDrag";
import { CommonCode } from "@/models/selfFeature/FeatureCommon";
import { useCommCodes } from "@/hooks/queries/self-feature/useSelfFeatureCmmQueries";

export interface Props {
    attributes: Array<Attribute>
    featureRules: Array<TbRsCustFeatRule>
    behaviors: Array<Behavior>
}

const DragList = ({
    attributes,
    featureRules,
    behaviors
}: Props) => {

	const { data: cmmCodeCateRes } = useCommCodes(CommonCode.CATEGORY)
	const [categoryOption, setCategoryOption] = useState<Array<any>>([])
    const [keyword, setKeyword] = useState<string>('')
    const [srchAttrRsltList, setSrchAttrRsltList] = useState<Array<Attribute>>([])
    const [srchFeatRsltList, setSrchFeatRsltList] = useState<Array<TbRsCustFeatRule>>([])
    const [srchBehvRsltList, setSrchBehvRsltList] = useState<Array<Behavior>>([])
    // 최초 진입 구분
    const [isInitComponent, setIsInitComponent] = useState<Boolean>(false)
    // 속성정보 구분 ori list
    const [oriAttrAccordian, setOriAttrAccordian] = useState<Array<AttributeAccordian>>([])
    // 속성정보 구분 list
    const [attrAccordian, setAttrAccordian] = useState<Array<AttributeAccordian>>([])
    // 속성정보 아코디언
    const [defaultAttr, setDefaultAttr] = useState<Array<string>>([])
    // 속성정보 구분 ori list
    const [oriFeatAccordian, setOriFeatAccordian] = useState<Array<FeatAccordian>>([])
    // Feat정보 구분 list
    const [featAccordian, setFeatAccordian] = useState<Array<FeatAccordian>>([])
    // Feat정보 아코디언
    const [defaultFeat, setDefaultFeat] = useState<Array<string>>([])
    // 행동정보 아코디언
    const [defaultBehv, setDefaultBehv] = useState<Array<string>>([])

    useEffect(() => {
        setIsInitComponent(true)
    }, [])
	// 카테고리 setting
	useEffect(() => {
		if (cmmCodeCateRes?.successOrNot === 'N') {
            
		} else {
			if (cmmCodeCateRes?.result) {
				setCategoryOption(() => {
                    let rtn = [...cmmCodeCateRes?.result]
                    rtn.sort((a, b) => {
                        if (a.sortRank > b.sortRank) return 1
                        if (a.sortRank < b.sortRank) return -1
                        return 0
                    })
					return rtn
				})
			}
		}
	}, [cmmCodeCateRes])

    const distinctAttrList = (result: Array<AttributeAccordian>, arr: Array<Attribute>, tblNm: string) => {
        let pushItem: AttributeAccordian = { metaTblLogiNm: tblNm, attributes: arr.filter((item) => item.metaTblLogiNm === tblNm) }
        result.push(pushItem)
        return arr.filter((item) => item.metaTblLogiNm !== tblNm)
    }
    const distinctFeatList = (result: Array<FeatAccordian>, arr: Array<TbRsCustFeatRule>, tblNm: string) => {
        let tempfl = arr.filter((item) => item.category === tblNm)
        if (tempfl.length > 0) {
            let pushItem: FeatAccordian = { metaTblLogiNm: tempfl[0].categoryNm, featureList: tempfl }
            result.push(pushItem)
        }
        return arr.filter((item) => item.category !== tblNm)
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
        if (featureRules.length < 1 || featureRules[0].category === "") return

        let featList: Array<TbRsCustFeatRule> = cloneDeep(featureRules)
        let tempFeatList: Array<FeatAccordian> = []
        // while (featList.length !== 0) {
        //     console.log(categoryOption)
        categoryOption.map((category: any) => {
            featList = distinctFeatList(tempFeatList, featList, category.cdv)
            return category
        })
        //}
        setOriFeatAccordian(tempFeatList)

        setSrchFeatRsltList(cloneDeep(featureRules))

        if (featureRules.length > 0) setDefaultFeat(["Feature 정보"])
        else setDefaultFeat([])

    }, [featureRules])

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
        let featList: Array<TbRsCustFeatRule> = cloneDeep(srchFeatRsltList)
        let tempFeatList: Array<FeatAccordian> = []
        // while (featList.length !== 0) {
        //     console.log(categoryOption)
        categoryOption.map((category: any) => {
            featList = distinctFeatList(tempFeatList, featList, category.cdv)
            return category
        })
        //}
        setFeatAccordian(tempFeatList)
    }, [srchFeatRsltList])

    const searchAttrList = (keyword: string) => {
        let attrList: Array<Attribute> = cloneDeep(attributes)
        if (keyword.trim() === '') {
            setIsInitComponent(true)
            setSrchAttrRsltList(attrList)
            return
        }
        attrList = attrList.filter((attribute: Attribute) => attribute.metaTblClmnLogiNm.indexOf(keyword) > -1 ? true : false)
        setSrchAttrRsltList(attrList)
    }

    const searchBehvList = (keyword: string) => {
        let behvList: Array<Behavior> = cloneDeep(behaviors)
        if (keyword.trim() === '') {
            setIsInitComponent(true)
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

    const searchFeatList = (keyword: string) => {
        let featList: Array<TbRsCustFeatRule> = cloneDeep(featureRules)
        if (keyword.trim() === '') {
            setIsInitComponent(true)
            setSrchFeatRsltList(featList)
            return
        }
        featList = featList.filter((featRule: TbRsCustFeatRule) => featRule.name.indexOf(keyword) > -1 ? true : false)
        setSrchFeatRsltList(featList)
    }

    const onClickTrgtSrchHandler = () => {
        setIsInitComponent(false)
        searchAttrList(keyword)
        searchFeatList(keyword)
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
            {/* Fact 정보 */}
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
                                isInitComponent={isInitComponent}
                                oriAttrbute={ori ? ori : null}
                                attrbute={attribute}
                            />
                        )
                    })}
                </AccordionItem>
            </Accordion>
            {/* Fact 정보 */}
            {/* Feature 정보 */}
            <Accordion
                align="Right"
                size="MD"
                type="multiple"
                style={{ marginTop: "10px" }}
                onClick={(e) => {
                    e.stopPropagation()
                    setDefaultFeat((prevState: Array<string>) => {
                        if (prevState.length > 0) return []
                        else return ["Feature 정보"]
                    })
                }}
                value={defaultFeat}
            >
                <AccordionItem
                    title='Feature 정보'
                    value='Feature 정보'
                >
                {featAccordian.map((feature: FeatAccordian, featIdx: number) => {
                    let ori = oriFeatAccordian.find((item) => item.metaTblLogiNm === feature.metaTblLogiNm)
                    return (
                        <FeatAccordionDrag
                            key={featIdx}
                            isInitComponent={isInitComponent}
                            oriFeat={ori ? ori : null}
                            feature={feature}
                        />
                    )
                })}
                </AccordionItem>
            </Accordion>
            {/* Feature 정보 */}
            {/* Base Fact 정보 */}
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
                            isInitComponent={isInitComponent}
                            oriBehavior={behaviors[behvIdx]}
                            behavior={behavior}
                        />
                    ))}
                </AccordionItem>
            </Accordion>
            {/* Base Fact 정보 */}
        </Page>
    )
}

export default DragList