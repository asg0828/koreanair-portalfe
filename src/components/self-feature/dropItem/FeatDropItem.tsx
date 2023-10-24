import { Button, Stack, Typography } from "@components/ui"

const FeatDropItem = (props: any) => {

    const onClickDeleteHandler = () => {
        props.delTargetInfo(props.itemIdx, props.targetItem.targetId)
    }

    return (
        <Stack justifyContent="Start" gap="SM" className="width-100">
            <Typography variant="h6">T{props.itemIdx + 1}</Typography>
            <Typography variant="h6">Feature</Typography>
            <Typography variant="h6">{props.targetItem.columnName}</Typography>
                {/* 변환식 함수, 변수1, 변수2, 변수3 */}
            <Typography variant="h6">{props.targetItem.function}</Typography>
            <Typography variant="h6">{props.targetItem.variable1}</Typography>
            <Typography variant="h6">{props.targetItem.variable2}</Typography>
            <Typography variant="h6">{props.targetItem.variable3}</Typography>
        {props.isPossibleEdit ? (
            <Button priority="Primary" appearance="Contained" size="LG" onClick={onClickDeleteHandler}>
            삭제
            </Button>
        ) : (
            <></>
        )}
        </Stack>
    )
}

export default FeatDropItem