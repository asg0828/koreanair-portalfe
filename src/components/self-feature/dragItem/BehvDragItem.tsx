import { useDrag } from "react-dnd"
import { cloneDeep } from "lodash"

import { Typography } from "@components/ui"

import { 
    divisionTypes,
} from '@/pages/user/self-feature/data'

const BehvDragItem = (props: any) => {

    const [{ isBehvDragging }, behvDragItem] = useDrag(() => ({
        type: divisionTypes.BEHV,
        item: Object.assign({ divisionCode: divisionTypes.BEHV }, cloneDeep(props.behvTblClmnInfo)),
        end(draggedItem, monitor) {
            const dropResult = monitor.getDropResult()

            if (draggedItem && dropResult) {}
        },
        collect: (monitor) => ({
            isBehvDragging: monitor.isDragging(),
        }),
    }), [props.behvTblClmnInfo])

    const behvOpacity = isBehvDragging ? 0.4 : 1

    return (
        <>
            {props.behvTblClmnInfo &&
                <Typography 
                    ref={(behvDragItem)}
                    style={{ opacity: behvOpacity, backgroundColor: '#e0ffff', color: 'black' }} 
                    variant="h6"
                >
                    {props.behvTblClmnInfo.metaTblClmnLogiNm}
                </Typography>
            }
        </>
    )
}

export default BehvDragItem