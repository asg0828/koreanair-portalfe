import { useDrag } from "react-dnd"
import { cloneDeep } from "lodash"

import { Typography } from "@components/ui"

import { DivisionTypes, TargetDragProps } from "@/models/selfFeature/FeatureModel"

const FeatDragItem = ({
    metaTblLogiNm,
    featTblClmnInfo
}: TargetDragProps) => {

    const [{ isFeatDragging }, featDragItem] = useDrag(() => ({
        type: DivisionTypes.FEAT,
        item: Object.assign({ divisionCode: DivisionTypes.FEAT, tableLogiName: metaTblLogiNm, dtpCd: featTblClmnInfo?.dataType }, cloneDeep(featTblClmnInfo)),
        end(draggedItem, monitor) {
            const dropResult = monitor.getDropResult()
            
            if (draggedItem && dropResult) {}
        },
        collect: (monitor) => ({
            isFeatDragging: monitor.isDragging(),
        }),
    }), [featTblClmnInfo])

    const featOpacity = isFeatDragging ? 0.4 : 1
    
    return (
        <>
            {featTblClmnInfo &&
            <Typography 
                ref={(featDragItem)}
                style={{ 
                    opacity: featOpacity,
                    background:'#ffe5d0',
                    color:'#e66e36',
                    padding:"0.3rem",
                    fontSize: "smaller", 
                }}
                variant="body2"
                onClick={(e)=>e.stopPropagation()}
            >
                {featTblClmnInfo.name} / {featTblClmnInfo.dataTypeCategory.toString().slice(0, 1).toUpperCase()}
            </Typography>
            }
        </>
    )
}

export default FeatDragItem