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
                {props.isPossibleEdit ? (
                    <>
                    <Typography variant="h6">{props.trgtFilterItem.columnName}</Typography>
                    <Button priority="Primary" appearance="Contained" size="SM" onClick={onClickTrgtFilterDeleteHandler}>
                    컬럼삭제
                    </Button>
                    </>
                ) : (
                    <Typography variant="h6">{props.trgtFilterItem.columnName}</Typography>
                )}
            </Stack>
        }
        </>
    )
}

export default BehvColDropItem