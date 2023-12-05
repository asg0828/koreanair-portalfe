import { useDrag } from "react-dnd"
import { cloneDeep } from "lodash"

import { Typography } from "@components/ui"

import { DivisionTypes, TargetDragProps } from "@/models/selfFeature/FeatureModel"

const BehvDragItem = ({
    metaTblLogiNm,
    behvTblClmnInfo
}: TargetDragProps) => {

    const [{ isBehvDragging }, behvDragItem] = useDrag(() => ({
        type: DivisionTypes.BEHV,
        item: Object.assign({ divisionCode: DivisionTypes.BEHV, tableLogiName: metaTblLogiNm }, cloneDeep(behvTblClmnInfo)),
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
                    style={{ 
                        opacity: behvOpacity,
                        backgroundColor: '#e6f9ff', 
                        color: '#00256c',
                        padding:"0.3rem",
                        fontSize: "smaller", 
                    }}
                    variant="body2"
                    onClick={(e)=>e.stopPropagation()}
                >
                    {behvTblClmnInfo.metaTblClmnLogiNm} / {behvTblClmnInfo.dataTypeCategory.slice(0, 1).toUpperCase()}
                </Typography>
            }
        </>
    )
}

export default BehvDragItem