import { TextField } from "@components/ui"
import { useDrag } from "react-dnd"
import { divisionTypes } from '@/models/selfFeature/FeatureInfo'

const AttrfeatDragItem = (props: any) => {

    const [{ isAttrDragging }, attrDragItem] = useDrag(() => ({
        type: divisionTypes.ATTR,
        item: props.dragItem,
        end(draggedItem, monitor) {
            const dropResult = monitor.getDropResult()

            if (draggedItem && dropResult) {}
        },
        collect: (monitor) => ({
            isAttrDragging: monitor.isDragging(),
        }),
    }))

    const attrOpacity = isAttrDragging ? 0.4 : 1

    return (
        <TextField
            ref={(attrDragItem)}
            style={{ opacity: attrOpacity }}
            appearance="Filled"
            defaultValue={props.dragItem.content} 
            placeholder="" 
            readOnly
            shape="Round"
            size="LG"
            validation="Default"
        />
    )
}

export default AttrfeatDragItem