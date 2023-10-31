import { Button, Stack, Typography } from "@components/ui"
import TransFunction from "./TransFunction"
import { 
    TargetDropProps,
} from "@/models/selfFeature/FeatureInfo"

const FeatDropItem = ({
    itemIdx,
    isPossibleEdit,
    targetItem,
    setTargetList,
    delTargetInfo,
}: TargetDropProps) => {

    const onClickDeleteHandler = () => {
        delTargetInfo(itemIdx, targetItem.targetId)
    }

    return (
        <Stack 
            justifyContent="Start" 
            gap="SM" 
            className="width-100"
            style={{
                background:'#ffe5d0',
                color:"#e66e36",
                borderRadius: '5px',
            }}
        >
            <Typography variant="h6" style={{color:"inherit"}}>T{itemIdx + 1}</Typography>
            <div className="dragItemLocation">
                Feature
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.29498 16.59L12.875 12L8.29498 7.41L9.70498 6L15.705 12L9.70498 18L8.29498 16.59Z" fill="currentColor"></path></svg>
            </div>
            <Typography variant="h6" style={{color:"inherit"}}>{targetItem.columnName}</Typography>
            <TransFunction 
                isPossibleEdit={isPossibleEdit}
                itemIdx={itemIdx}
                trgtItem={targetItem}
                setTargetList={setTargetList!}
            />
            {isPossibleEdit ? (
                <Button size="MD" onClick={onClickDeleteHandler}>
                삭제
                </Button>
            ) : (
                <></>
            )
            }
        </Stack>
    )
}

export default FeatDropItem