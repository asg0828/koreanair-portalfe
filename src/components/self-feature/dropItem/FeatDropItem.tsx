import { Button, Stack, Typography } from "@components/ui"
import TransFunction from "./TransFunction"

const FeatDropItem = (props: any) => {

    const onClickDeleteHandler = () => {
        props.delTargetInfo(props.itemIdx, props.targetItem.targetId)
    }

    return (
        <Stack 
            justifyContent="Start" 
            gap="SM" 
            className="width-100"
            style={{
                backgroundColor: '#ff77ff',
                border: '0.1em solid',
                borderRadius: '5px',
            }}
        >
            <Typography variant="h6">T{props.itemIdx + 1}</Typography>
            <Typography variant="h6">Feature</Typography>
            <Typography variant="h6">{props.targetItem.columnName}</Typography>
            <TransFunction 
                isPossibleEdit={props.isPossibleEdit}
            />
            {props.isPossibleEdit ? (
                <Button size="SM" onClick={onClickDeleteHandler}>
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