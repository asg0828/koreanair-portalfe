import { Button, Stack, Typography } from "@components/ui"

const AttrDropItem = (props: any) => {

    const onClickDeleteHandler = () => {
        props.delTargetInfo(props.itemIdx, props.targetItem.targetId)
    }

    return (
        <Stack gap="SM">
            <Stack 
            justifyContent="Start" 
            gap="SM" 
            className="width-100"
            style={{
                background:'#eff9f0',
                color:'#00b21e',
                padding:"0.5rem",
                borderRadius: '5px',
            }}
        >
            <Typography variant="h6" style={{color:"inherit"}}>T{props.itemIdx + 1}</Typography>
            <div className="dragItemLocation">
                속성
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.29498 16.59L12.875 12L8.29498 7.41L9.70498 6L15.705 12L9.70498 18L8.29498 16.59Z" fill="currentColor"></path></svg>
            </div>
            <Typography variant="body2" style={{color:"inherit"}}>{props.targetItem.columnName}</Typography>
                {/* 변환식 함수, 변수1, 변수2, 변수3 */}
            <Typography variant="h6">{props.targetItem.function}</Typography>
            <Typography variant="h6">{props.targetItem.variable1}</Typography>
            <Typography variant="h6">{props.targetItem.variable2}</Typography>
            <Typography variant="h6">{props.targetItem.variable3}</Typography>

            </Stack>
            {props.isPossibleEdit ? (
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

export default AttrDropItem