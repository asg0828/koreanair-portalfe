import { Button, Stack, Typography } from "@components/ui"
import TransFunction from "./TransFunction"

const AttrDropItem = (props: any) => {

    const onClickDeleteHandler = () => {
        props.delTargetInfo(props.itemIdx, props.targetItem.targetId)
    }

    return (
        <Stack 
            justifyContent="Start" 
            gap="SM" 
            className="width-100"
            style={{
                backgroundColor: '#FF9999',
                border: '0.1em solid',
                borderRadius: '5px',
            }}
        >
            <Typography variant="h6">T{props.itemIdx + 1}</Typography>
            <Typography variant="h6">속성</Typography>
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

export default AttrDropItem