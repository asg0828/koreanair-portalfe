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
import { TrgtDragAttrType } from "@/pages/user/self-feature/data";
import BehvAccordionDrag from "./dragItem/BehvAccordionDrag";

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
    const [ attrType1List, setAttrType1List ] = useState<Array<Attribute>>([])
    const [ attrType2List, setAttrType2List ] = useState<Array<Attribute>>([])
    const [ attrType3List, setAttrType3List ] = useState<Array<Attribute>>([])
    // 속성정보 아코디언
    const [ defaultAttr, setDefaultAttr ] = useState<Array<string>>([])
    // 행동정보 아코디언
    const [ defaultBehv, setDefaultBehv ] = useState<Array<string>>([])
    // 속성테이블 아코디언
    const [ defaultType1, setDefaultType1 ] = useState<Array<string>>([])
    const [ defaultType2, setDefaultType2 ] = useState<Array<string>>([])
    const [ defaultType3, setDefaultType3 ] = useState<Array<string>>([])

    useEffect(() => {
        if (attributes.length < 1) return

        let attrList: Array<Attribute> = cloneDeep(attributes)
        setAttrType1List(attrList.filter((attribute: Attribute) => TrgtDragAttrType.TYPE1 === attribute.metaTblLogiNm))
        setAttrType2List(attrList.filter((attribute: Attribute) => TrgtDragAttrType.TYPE2 === attribute.metaTblLogiNm))
        setAttrType3List(attrList.filter((attribute: Attribute) => TrgtDragAttrType.TYPE3 === attribute.metaTblLogiNm))
        setSrchAttrRsltList(attrList)
    
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
        let oriAttrList: Array<Attribute> = cloneDeep(attributes)
        let attrList: Array<Attribute> = cloneDeep(srchAttrRsltList)

        let oriType1Arr = oriAttrList.filter((attribute: Attribute) => TrgtDragAttrType.TYPE1 === attribute.metaTblLogiNm)
        let type1Arr = attrList.filter((attribute: Attribute) => TrgtDragAttrType.TYPE1 === attribute.metaTblLogiNm)
        setAttrType1List(type1Arr)
        if ((oriType1Arr.length > type1Arr.length) && type1Arr.length > 0) setDefaultType1([TrgtDragAttrType.TYPE1])
        else setDefaultType1([])
        
        let oriType2Arr = oriAttrList.filter((attribute: Attribute) => TrgtDragAttrType.TYPE2 === attribute.metaTblLogiNm)
        let type2Arr = attrList.filter((attribute: Attribute) => TrgtDragAttrType.TYPE2 === attribute.metaTblLogiNm)
        setAttrType2List(type2Arr)
        if ((oriType2Arr.length > type2Arr.length) && type2Arr.length > 0) setDefaultType2([TrgtDragAttrType.TYPE2])
        else setDefaultType2([])
        
        let oriType3Arr = oriAttrList.filter((attribute: Attribute) => TrgtDragAttrType.TYPE3 === attribute.metaTblLogiNm)
        let type3Arr = attrList.filter((attribute: Attribute) => TrgtDragAttrType.TYPE3 === attribute.metaTblLogiNm)
        setAttrType3List(type3Arr)
        if ((oriType3Arr.length > type3Arr.length) && type3Arr.length > 0) setDefaultType3([TrgtDragAttrType.TYPE3])
        else setDefaultType3([])
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
                width:'25%',
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
                    <Accordion
                        onClick={(e) => {
                            e.stopPropagation()
                            setDefaultType1((prevState: Array<string>) => {
                                if (prevState.length > 0) return []
                                else return [TrgtDragAttrType.TYPE1]
                            })
                        }}
                        value={defaultType1}
                        align="Right"
                        size="MD"
                        type="multiple"
                    >
                        <AccordionItem
                            title={TrgtDragAttrType.TYPE1}
                            value={TrgtDragAttrType.TYPE1}
                        >
                            <Stack direction="Vertical" justifyContent="Center" gap="SM" >
                            {attrType1List.map((attribute: Attribute, index: number) => {
                                return (
                                    <AttrDragItem
                                        key={index}
                                        metaTblLogiNm={TrgtDragAttrType.TYPE1}
                                        attrTblClmnInfo={attribute}
                                    />
                                )
                            })}
                            </Stack>
                        </AccordionItem>
                    </Accordion>
                    <Accordion
                        align="Right"
                        size="MD"
                        type="multiple"
                        onClick={(e) => {
                            e.stopPropagation()
                            setDefaultType2((prevState: Array<string>) => {
                                if (prevState.length > 0) return []
                                else return [TrgtDragAttrType.TYPE2]
                            })
                        }}
                        value={defaultType2}
                    >
                        <AccordionItem
                            title={TrgtDragAttrType.TYPE2}
                            value={TrgtDragAttrType.TYPE2}
                        >
                            <Stack direction="Vertical" justifyContent="Center" gap="SM" >
                            {attrType2List.map((attribute: Attribute, index: number) => {
                                return (
                                    <AttrDragItem
                                        key={index}
                                        metaTblLogiNm={TrgtDragAttrType.TYPE2}
                                        attrTblClmnInfo={attribute}
                                    />
                                )
                            })}
                            </Stack>
                        </AccordionItem>
                    </Accordion>
                    <Accordion
                        align="Right"
                        size="MD"
                        type="multiple"
                        onClick={(e) => {
                            e.stopPropagation()
                            setDefaultType3((prevState: Array<string>) => {
                                if (prevState.length > 0) return []
                                else return [TrgtDragAttrType.TYPE3]
                            })
                        }}
                        value={defaultType3}
                    >
                        <AccordionItem
                            title={TrgtDragAttrType.TYPE3}
                            value={TrgtDragAttrType.TYPE3}
                        >
                            <Stack direction="Vertical" justifyContent="Center" gap="SM" >
                            {attrType3List.map((attribute: Attribute, index: number) => {
                                return (
                                    <AttrDragItem
                                        key={index}
                                        metaTblLogiNm={TrgtDragAttrType.TYPE3}
                                        attrTblClmnInfo={attribute}
                                    />
                                )
                            })}
                            </Stack>
                        </AccordionItem>
                    </Accordion>
                {/* {srchAttrRsltList.length > 0 &&
                <Stack direction="Vertical" justifyContent="Center" gap="SM" >
                {srchAttrRsltList.map((attribute: Attribute, index: number) => {
                    return (
                        <AttrDragItem
                            key={index}
                            attrTblClmnInfo={attribute}
                        />
                    )
                })}
                </Stack>
                } */}
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
                style={{marginTop:"10px"}}
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
                    // <Accordion
                    //     key={behvIdx}
                    //     align="Right"
                    //     size="MD"
                    //     type="multiple"
                    //     onClick={(e) => {
                    //         e.stopPropagation()
                    //     }}
                    // >
                    //     <AccordionItem
                    //         title={behavior.metaTblLogiNm}
                    //         value={behavior.metaTblLogiNm}
                    //     >
                    //     <Stack direction="Vertical" justifyContent="Center" gap="SM" >
                    //     {behavior.tbCoMetaTblClmnInfoList.map((tbCoMetaTblClmnInfo: TbCoMetaTblClmnInfo, clmnIdx: number) => (
                    //         <BehvDragItem
                    //             key={clmnIdx}
                    //             metaTblLogiNm={behavior.metaTblLogiNm}
                    //             behvTblClmnInfo={tbCoMetaTblClmnInfo}
                    //         />
                    //     ))}
                    //     </Stack>
                    //     </AccordionItem>
                    // </Accordion>
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