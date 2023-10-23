import { TextField } from "@components/ui"
import { useDrag } from "react-dnd"
import { divisionTypes } from '@/models/selfFeature/FeatureInfo'
import { cloneDeep } from "lodash"

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
    }))

    const attrOpacity = isAttrDragging ? 0.4 : 1

    return (
        <TextField
            ref={(attrDragItem)}
            style={{ opacity: attrOpacity, backgroundColor: '#FF9999', color: 'black' }}
            appearance="Filled"
            defaultValue={props.attrTblClmnInfo.metaTblClmnLogiNm} 
            placeholder="" 
            readOnly
            shape="Round"
            size="LG"
            validation="Default"
        />
    )
}

export default AttrDragItem