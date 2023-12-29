import {
    useState,
    useEffect,
} from 'react'
import {
    FeatAccordian,
    TbRsCustFeatRule,
} from '@/models/selfFeature/FeatureModel'

import {
    Accordion,
    AccordionItem,
    Stack,
} from '@components/ui'
import FeatDragItem from './FeatDragItem'

export interface FeatAccordionDragProps {
    isInitComponent: Boolean,
    oriFeat: FeatAccordian | null,
    feature: FeatAccordian,
}

const FeatAccordionDrag = ({
    oriFeat,
    isInitComponent,
    feature,
}: FeatAccordionDragProps) => {

    const [defaultFeatCol, setDefaultFeatCol] = useState<Array<string>>([])

    useEffect(() => {
        if (!oriFeat) return
        if (
            !isInitComponent
            || (oriFeat.featureList.length > feature.featureList.length)
            && feature.featureList.length > 0
        ) setDefaultFeatCol([feature.metaTblLogiNm])
        else setDefaultFeatCol([])

    }, [oriFeat, feature])

    return (
        <Accordion
            align="Right"
            size="MD"
            type="multiple"
            onClick={(e) => {
                e.stopPropagation()
                setDefaultFeatCol((prevState: Array<string>) => {
                    if (prevState.length > 0) return []
                    else return [feature.metaTblLogiNm]
                })
            }}
            value={defaultFeatCol}
        >
            <AccordionItem
                title={feature.metaTblLogiNm}
                value={feature.metaTblLogiNm}
            >
                <Stack
                    direction="Vertical"
                    justifyContent="Center"
                    gap="SM"
                    onClick={(e) => e.stopPropagation()}
                >
                    {feature.featureList.map((feature: TbRsCustFeatRule, index: number) => {
                        return (
                            <FeatDragItem
                                key={index}
                                metaTblLogiNm={feature.category}
                                featTblClmnInfo={feature}
                            />
                        )
                    })}
                </Stack>
            </AccordionItem>
        </Accordion>
    )
}

export default FeatAccordionDrag