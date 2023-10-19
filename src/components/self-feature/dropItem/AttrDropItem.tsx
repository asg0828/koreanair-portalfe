import { Button, Stack, TextField } from "@components/ui"

const AttrDropItem = (props: any) => {

    const onClickDeleteHandler = () => {
        props.deleteInfo(props.itemIdx)
    }

    return (
        <Stack justifyContent="Start" gap="SM" className="width-100">
            <TextField 
                style={{backgroundColor: '#FF9999', color: 'white'}}
                appearance="Filled"
                defaultValue={props.dropItem?.content}
                placeholder=""
                disabled
                readOnly
                shape="Round"
                size="LG"
            />
            <Button priority="Primary" appearance="Contained" size="LG" onClick={onClickDeleteHandler}>
            삭제
            </Button>
        </Stack>
    )
}

export default AttrDropItem