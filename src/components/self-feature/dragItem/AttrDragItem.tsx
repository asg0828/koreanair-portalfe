import { useDrag } from "react-dnd"
import { cloneDeep } from "lodash"

import { Typography } from "@components/ui"

import { DivisionTypes, TargetDragProps } from "@/models/selfFeature/FeatureModel"

const AttrDragItem = ({
    metaTblLogiNm,
    attrTblClmnInfo
}: TargetDragProps) => {

    const [{ isAttrDragging }, attrDragItem] = useDrag(() => ({
        type: DivisionTypes.ATTR,
        item: Object.assign({ divisionCode: DivisionTypes.ATTR, tableLogiName: metaTblLogiNm }, cloneDeep(attrTblClmnInfo)),
        end(draggedItem, monitor) {
            const dropResult = monitor.getDropResult()

            if (draggedItem && dropResult) {}
        },
        collect: (monitor) => ({
            isAttrDragging: monitor.isDragging(),
        }),
    }), [attrTblClmnInfo])

    const attrOpacity = isAttrDragging ? 0.4 : 1

    return (
        <>
            {attrTblClmnInfo &&
            <Typography 
                ref={(attrDragItem)}
                style={{ 
                    opacity: attrOpacity,
                    background:'#eff9f0',
                    color:'#00b21e',
                    padding:"0.3rem",
                    fontSize: "smaller", 
                }}
                variant="body2"
                onClick={(e)=>e.stopPropagation()}
            >
                {attrTblClmnInfo.metaTblClmnLogiNm} / {attrTblClmnInfo.dataTypeCategory.slice(0, 1).toUpperCase()}
            </Typography>
            }
        </>
    )
}

export default AttrDragItem