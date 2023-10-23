import { TextField } from "@components/ui"
import { useDrag } from "react-dnd"
import { divisionTypes } from '@/models/selfFeature/FeatureInfo'
import { cloneDeep } from "lodash"

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
    }))

    const behvOpacity = isBehvDragging ? 0.4 : 1

    return (
        <>
            {props.behvTblClmnInfo &&
                <TextField
                    ref={(behvDragItem)}
                    style={{ opacity: behvOpacity, backgroundColor: '#e0ffff', color: 'black' }}
                    appearance="Filled"
                    defaultValue={props.behvTblClmnInfo.metaTblClmnLogiNm} 
                    placeholder="" 
                    readOnly
                    shape="Round"
                    size="LG"
                    validation="Default"
                />
            }
        </>
    )
}

export default BehvDragItem