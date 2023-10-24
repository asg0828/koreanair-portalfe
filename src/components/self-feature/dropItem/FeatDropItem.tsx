import { Button, Stack, Typography } from "@components/ui"

const FeatDropItem = (props: any) => {

    const onClickDeleteHandler = () => {
        props.delTargetInfo(props.itemIdx, props.targetItem.targetId)
    }

    return (
        <>
        {props.isPossibleEdit ? (
            <Stack justifyContent="Start" gap="SM" className="width-100">
                <Typography variant="h6">T{props.itemIdx + 1}</Typography>
                <Typography variant="h6">{props.targetItem.columnName}</Typography>
                <Button priority="Primary" appearance="Contained" size="LG" onClick={onClickDeleteHandler}>
                삭제
                </Button>
            </Stack>
        ) : (
            <Stack justifyContent="Start" gap="SM" className="width-100">
                <Typography variant="h6">T{props.itemIdx + 1}</Typography>
                <Typography variant="h6">{props.targetItem.columnName}</Typography>
            </Stack>
        )}
        </>
    )
}

export default FeatDropItem