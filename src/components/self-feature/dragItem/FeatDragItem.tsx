import { TextField } from "@components/ui"
import { useDrag } from "react-dnd"
import { divisionTypes } from '@/models/selfFeature/FeatureInfo'

const FeatDragItem = (props: any) => {

    const [{ isFeatDragging }, featDragItem] = useDrag(() => ({
        type: divisionTypes.FEAT,
        item: props.dragItem,
        end(draggedItem, monitor) {
            const dropResult = monitor.getDropResult()

            if (draggedItem && dropResult) {}
        },
        collect: (monitor) => ({
            isFeatDragging: monitor.isDragging(),
        }),
    }))

    const featOpacity = isFeatDragging ? 0.4 : 1

    return (
        <TextField
            ref={(featDragItem)}
            style={{ opacity: featOpacity }}
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

export default FeatDragItem