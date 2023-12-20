import {
    useState,
    useEffect,
} from 'react'
import {
    Attribute,
    AttributeAccordian,
    Behavior,
    TbCoMetaTblClmnInfo
} from '@/models/selfFeature/FeatureModel'

import {
    Accordion,
    AccordionItem,
    Stack,
} from '@components/ui'
import AttrDragItem from './AttrDragItem'

export interface AttrAccordionDragProps {
    oriAttrbute: AttributeAccordian | null,
    attrbute: AttributeAccordian,
}

const AttrAccordionDrag = ({
    oriAttrbute,
    attrbute,
}: AttrAccordionDragProps) => {

    const [defaultAttrCol, setDefaultAttrCol] = useState<Array<string>>([])

    useEffect(() => {
        if (!oriAttrbute) return
        if (
            (oriAttrbute.attributes.length > attrbute.attributes.length)
            && attrbute.attributes.length > 0
        ) setDefaultAttrCol([attrbute.metaTblLogiNm])
        else setDefaultAttrCol([])

    }, [oriAttrbute, attrbute])

    return (
        <Accordion
            align="Right"
            size="MD"
            type="multiple"
            onClick={(e) => {
                e.stopPropagation()
                setDefaultAttrCol((prevState: Array<string>) => {
                    if (prevState.length > 0) return []
                    else return [attrbute.metaTblLogiNm]
                })
            }}
            value={defaultAttrCol}
        >
            <AccordionItem
                title={attrbute.metaTblLogiNm}
                value={attrbute.metaTblLogiNm}
            >
                <Stack
                    direction="Vertical"
                    justifyContent="Center"
                    gap="SM"
                    onClick={(e) => e.stopPropagation()}
                >
                    {attrbute.attributes.map((attribute: Attribute, index: number) => {
                        return (
                            <AttrDragItem
                                key={index}
                                metaTblLogiNm={attribute.metaTblLogiNm}
                                attrTblClmnInfo={attribute}
                            />
                        )
                    })}
                </Stack>
            </AccordionItem>
        </Accordion>
    )
}

export default AttrAccordionDrag