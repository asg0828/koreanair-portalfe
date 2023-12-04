import { 
    useState,
    useEffect, 
} from 'react'
import { 
    Behavior, 
    TbCoMetaTblClmnInfo 
} from '@/models/selfFeature/FeatureModel'

import {
    Accordion,
    AccordionItem,
    Stack,
} from '@components/ui'
import BehvDragItem from './BehvDragItem'

export interface BehvAccordionDragProps {
    oriBehavior: Behavior,
    behavior: Behavior,
}

const BehvAccordionDrag = ({
    oriBehavior,
    behavior,
}: BehvAccordionDragProps) => {

    const [ defaultBehvCol, setDefaultBehvCol ] = useState<Array<string>>([])

    useEffect(() => {

        if (
            (oriBehavior.tbCoMetaTblClmnInfoList.length > behavior.tbCoMetaTblClmnInfoList.length) 
            && behavior.tbCoMetaTblClmnInfoList.length > 0
        ) setDefaultBehvCol([behavior.metaTblLogiNm])
        else setDefaultBehvCol([])

    }, [oriBehavior, behavior])

    return (
        <Accordion
            align="Right"
            size="MD"
            type="multiple"
            onClick={(e) => {
                e.stopPropagation()
                setDefaultBehvCol((prevState: Array<string>) => {
                    if (prevState.length > 0) return []
                    else return [behavior.metaTblLogiNm]
                })
            }}
            value={defaultBehvCol}
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
    )
}

export default BehvAccordionDrag