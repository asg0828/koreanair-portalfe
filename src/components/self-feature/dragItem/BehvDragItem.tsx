import { useDrag } from "react-dnd"
import { cloneDeep } from "lodash"

import { Typography } from "@components/ui"

import { 
    divisionTypes,
} from '@/pages/user/self-feature/data'
import { TargetDragProps } from "@/models/selfFeature/FeatureModel"

const BehvDragItem = ({
    metaTblLogiNm,
    behvTblClmnInfo
}: TargetDragProps) => {

    const [{ isBehvDragging }, behvDragItem] = useDrag(() => ({
        type: divisionTypes.BEHV,
        item: Object.assign({ divisionCode: divisionTypes.BEHV, metaTblLogiNm: metaTblLogiNm }, cloneDeep(behvTblClmnInfo)),
        end(draggedItem, monitor) {
            const dropResult = monitor.getDropResult()

            if (draggedItem && dropResult) {}
        },
        collect: (monitor) => ({
            isBehvDragging: monitor.isDragging(),
        }),
    }), [behvTblClmnInfo])

    const behvOpacity = isBehvDragging ? 0.4 : 1

    return (
        <>
            {behvTblClmnInfo &&
                <Typography 
                    ref={(behvDragItem)}
                    style={{ opacity: behvOpacity,backgroundColor: '#e6f9ff', color: '#00256c',padding:"0.3rem" }}
                    variant="body2"
                >
                    {behvTblClmnInfo.metaTblClmnLogiNm}
                </Typography>
            }
        </>
    )
}

export default BehvDragItem