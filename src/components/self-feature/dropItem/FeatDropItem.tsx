import { Button, Stack, Typography } from "@components/ui"
import TransFunction from "./TransFunction"
import { 
    TargetDropProps,
} from "@/models/selfFeature/FeatureModel"

const FeatDropItem = ({
    itemIdx,
    isPossibleEdit,
    targetItem,
    columnList,
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
                color:'#e66e36',
                padding:"0.5rem",
                borderRadius: '5px',
                position: "relative",
            }}
        >
            <Typography variant="h6" style={{color:"inherit"}}>T{itemIdx + 1}</Typography>
            <div className="dragItemLocation">
                Feature
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.29498 16.59L12.875 12L8.29498 7.41L9.70498 6L15.705 12L9.70498 18L8.29498 16.59Z" fill="currentColor"></path></svg>
            </div>
            <Typography variant="body2" style={{color:"inherit"}}>{targetItem.columnLogiName}</Typography>
            <TransFunction 
                isPossibleEdit={isPossibleEdit}
                itemIdx={itemIdx}
                dataType={targetItem.targetDataType}
                trgtItem={targetItem}
                columnList={columnList}
                setTargetList={setTargetList!}
            />
            <Stack
                direction="Vertical"
                gap="SM"
                style={{
                    top: "20%",
                    position: "absolute",
                    left: "93%",
                }}
            >
            {isPossibleEdit ? (
                <Button size="SM" onClick={onClickDeleteHandler}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"></path>
                    </svg>
                </Button>
            ) : (
                <></>
            )}
            </Stack>
        </Stack>
    )
}

export default FeatDropItem