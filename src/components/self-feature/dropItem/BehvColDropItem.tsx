import { Button, Stack, Typography } from '@components/ui'

const BehvColDropItem = (props: any) => {

    const onClickTrgtFilterDeleteHandler = () => {
        props.deleteTrgtFilterInfo(props.itemIdx)
    }

    return (
        <>
        {props.trgtFilterItem &&
            <Stack 
                justifyContent="Start"
                gap="SM"
                className="width-100"
            >  
                <Typography variant="h6">{props.trgtFilterItem.columnName}</Typography>
                {/* 변환식 함수, 구분자, 변수1, 변수2, 변수3 */}
                <Typography variant="h6">{props.trgtFilterItem.function}</Typography>
                <Typography variant="h6">{props.trgtFilterItem.delimiter}</Typography>
                <Typography variant="h6">{props.trgtFilterItem.variable1}</Typography>
                <Typography variant="h6">{props.trgtFilterItem.variable2}</Typography>
                <Typography variant="h6">{props.trgtFilterItem.variable3}</Typography>
                {props.isPossibleEdit ? (
                    <Button priority="Primary" appearance="Contained" size="SM" onClick={onClickTrgtFilterDeleteHandler}>
                    컬럼삭제
                    </Button>
                ) : (
                    <></>
                )}
            </Stack>
        }
        </>
    )
}

export default BehvColDropItem