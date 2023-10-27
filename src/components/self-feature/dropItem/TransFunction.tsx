import { useState } from "react"

import { Button, Checkbox, Tooltip } from "@components/ui"

const TransFunction = (props: any) => {

    const [ funcStr, setFuncStr ] = useState<string>('')
    const [ transFuncChecked, setTransFuncChecked ] = useState(false)
    
    const onCheckedChange = () => {
        setTransFuncChecked(!transFuncChecked)

        if (!transFuncChecked) {
            console.log("변환식 팝업 open!")
            // 팝업 오픈
        } else {
            console.log("초기화 진행")
            /*
                초기화
                props.trgtFilterItem.function = ''
                props.trgtFilterItem.delimiter = ''
                props.trgtFilterItem.variable1 = ''
                props.trgtFilterItem.variable2 = ''
                props.trgtFilterItem.variable3 = ''
            */
        }
    }

    const onClickTransFuncHandler = () => {
        console.log("변환식 팝업 open!")
    }

    return (
        <>
        <Checkbox
            disabled={!props.isPossibleEdit}
            checked={transFuncChecked}
            onCheckedChange={onCheckedChange}
        />
        {transFuncChecked ? (
            <Tooltip
                align="center"
                content={funcStr}
                delayDuration={700}
                position="bottom"
                shape="Square"
            >
                <Button
                    appearance="Outline"
                    disabled={!transFuncChecked}
                    priority="Normal"
                    shape="Square"
                    size="MD"
                    onClick={() => onClickTransFuncHandler()}
                >
                변환
                </Button>
            </Tooltip>
        ) : (
            <Button
                appearance="Outline"
                disabled={!transFuncChecked}
                priority="Normal"
                shape="Square"
                size="MD"
                onClick={() => onClickTransFuncHandler()}
            >
            변환
            </Button>
        )}
        </>
    )

}

export default TransFunction