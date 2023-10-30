import { useDrag } from "react-dnd"
import { cloneDeep } from "lodash"

import { Typography } from "@components/ui"

import { 
    divisionTypes,
} from '@/pages/user/self-feature/data'

const AttrDragItem = (props: any) => {

    const [{ isAttrDragging }, attrDragItem] = useDrag(() => ({
        type: divisionTypes.ATTR,
        item: Object.assign({ divisionCode: divisionTypes.ATTR }, cloneDeep(props.attrTblClmnInfo)),
        end(draggedItem, monitor) {
            const dropResult = monitor.getDropResult()

            if (draggedItem && dropResult) {}
        },
        collect: (monitor) => ({
            isAttrDragging: monitor.isDragging(),
        }),
    }), [props.attrTblClmnInfo])

    const attrOpacity = isAttrDragging ? 0.4 : 1

    return (
        <Typography 
            ref={(attrDragItem)}
            style={{ opacity: attrOpacity,background:'#eff9f0',color:'#00b21e',padding:"0.3rem"}}
            variant="body2"
        >
            {props.attrTblClmnInfo.metaTblClmnLogiNm}
        </Typography>
    )
}

export default AttrDragItem