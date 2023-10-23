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
                {props.deleteTrgtFilterInfo &&
                    <Button priority="Primary" appearance="Contained" size="SM" onClick={onClickTrgtFilterDeleteHandler}>
                    컬럼삭제
                    </Button>
                }
            </Stack>
        }
        </>
    )
}

export default BehvColDropItem