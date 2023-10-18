import { TextField } from "@components/ui"
import { useDrag } from "react-dnd"
import { divisionTypes } from '@/models/selfFeature/FeatureInfo'

const BehvDragItem = (props: any) => {

    const [{ isBehvDragging }, behvDragItem] = useDrag(() => ({
        type: divisionTypes.BEHV,
        item: props.dragItem,
        end(draggedItem, monitor) {
            const dropResult = monitor.getDropResult()

            if (draggedItem && dropResult) {}
        },
        collect: (monitor) => ({
            isBehvDragging: monitor.isDragging(),
        }),
    }))

    const behvOpacity = isBehvDragging ? 0.4 : 1

    return (
        <TextField
            ref={(behvDragItem)}
            style={{ opacity: behvOpacity }}
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

export default BehvDragItem