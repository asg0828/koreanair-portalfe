import { useDrag } from "react-dnd"
import { cloneDeep } from "lodash"

import { Typography } from "@components/ui"

import { 
    divisionTypes,
} from '@/pages/user/self-feature/data'


const FeatDragItem = (props: any) => {

    const [{ isFeatDragging }, featDragItem] = useDrag(() => ({
        type: divisionTypes.FEAT,
        item: Object.assign({ divisionCode: divisionTypes.FEAT }, cloneDeep(props.featTblClmnInfo)),
        end(draggedItem, monitor) {
            const dropResult = monitor.getDropResult()

            if (draggedItem && dropResult) {}
        },
        collect: (monitor) => ({
            isFeatDragging: monitor.isDragging(),
        }),
    }), [props.featTblClmnInfo])

    const featOpacity = isFeatDragging ? 0.4 : 1

    return (
        <Typography 
            ref={(featDragItem)}
            style={{ opacity: featOpacity,background:'#ffe5d0',color:"#e66e36" }}
            variant="h6"
        >
            {props.featTblClmnInfo.metaTblClmnLogiNm}
        </Typography>
    )
}

export default FeatDragItem