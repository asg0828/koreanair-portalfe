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
                style={{
                    backgroundColor: 'rgb(0, 37, 108)',
                    color:"#FFF",
                    border: '0.1em solid #777',
                    borderRadius: '5px',
                    padding:"0.25rem"
                }}
            >  
                <Typography variant="h6" style={{color:"inherit"}}>{props.trgtFilterItem.columnName}</Typography>
                {/* 변환식 함수, 구분자, 변수1, 변수2, 변수3 */}
                <Typography variant="h6" style={{color:"inherit"}}>{props.trgtFilterItem.function}</Typography>
                <Typography variant="h6" style={{color:"inherit"}}>{props.trgtFilterItem.delimiter}</Typography>
                <Typography variant="h6" style={{color:"inherit"}}>{props.trgtFilterItem.variable1}</Typography>
                <Typography variant="h6" style={{color:"inherit"}}>{props.trgtFilterItem.variable2}</Typography>
                <Typography variant="h6" style={{color:"inherit"}}>{props.trgtFilterItem.variable3}</Typography>
                {props.isPossibleEdit ? (
                    <Button size="SM" onClick={onClickTrgtFilterDeleteHandler}>
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