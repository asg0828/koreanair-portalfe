import AttrDragItem from "./dragItem/AttrDragItem"
import BehvDragItem from "./dragItem/BehvDragItem"
import FeatDragItem from "./dragItem/FeatDragItem"
import { Page } from "@components/ui"
import { divisionTypes } from '@/models/selfFeature/FeatureInfo'

const DragList = (props: any) => {

    return (
        <Page
            style={{
                overflowY: 'scroll',
                height: '100%',
                border: '0.1em solid',
                borderRadius: '5px',
            }}
        >
            {
                props.dragList.map((dragItem: any, index: number) => {
                    if (dragItem.divisionCode === divisionTypes.ATTR) {
                        return <AttrDragItem
                            key={index}
                            dragItem={dragItem}
                        />
                    } else if (dragItem.divisionCode === divisionTypes.FEAT) {
                        return <FeatDragItem
                            key={index}
                            dragItem={dragItem}
                        />
                    } else if (dragItem.divisionCode === divisionTypes.BEHV) {
                        return <BehvDragItem
                            key={index}
                            dragItem={dragItem}
                        />
                    }
                })
            }
        </Page>
    )
}

export default DragList