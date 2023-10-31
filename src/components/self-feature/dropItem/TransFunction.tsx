import { 
    useState,
    useEffect, 
} from "react"
import { cloneDeep } from 'lodash'

import { 
    Button, 
    Checkbox, 
    Tooltip 
} from "@components/ui"
import TransFunctionPop from "./TransFunctionPop"
import { TbRsCustFeatRuleTrgt, TbRsCustFeatRuleTrgtFilter } from "@/models/selfFeature/FeatureInfo"

const TransFunction = (props: any) => {

    const [ funcStr, setFuncStr ] = useState<string>('')
    const [ funcVal, setFuncVal ] = useState<string>('')
    const [ transFuncChecked, setTransFuncChecked ] = useState(false)
    const [ isOpenTransFunctionPop, setIsOpenTransFunctionPop ] = useState<boolean>(false)

    // 속성 데이터 FuncVal 셋팅
    useEffect(() => {
        // 변환식이 비어 있으면 check 해제
        if (!props.targetItem) return
        
        if (props.targetItem.function === "") {
            setTransFuncChecked(false)
        }

        setFuncVal(cloneDeep(props.targetItem.function))
        
    }, [props.targetItem])
    // 행동 데이터 FuncVal 셋팅
    useEffect(() => {
        if (!props.trgtFilterItem) return
        // 변환식이 비어 있으면 check 해제
        if (props.trgtFilterItem.function === "") {
            setTransFuncChecked(false)
        }
        setFuncVal(cloneDeep(props.trgtFilterItem.function))
    }, [props.trgtFilterItem])

    const onCheckedChange = () => {
        setTransFuncChecked(!transFuncChecked)

        if (!transFuncChecked) {
            // 팝업 오픈
            setIsOpenTransFunctionPop((prevState) => !prevState)
        } else {
            // 속성 데이터의 경우 targetItem 만 넘김(filter list도 넘겨주지만 사용여부는 확인 필요)
            props.targetItem && props.setTargetList((state: Array<TbRsCustFeatRuleTrgt>) => {
                let rtn = cloneDeep(state)
                rtn[props.itemIdx].function  = ''
                rtn[props.itemIdx].variable1  = ''
                rtn[props.itemIdx].variable2  = ''
                rtn[props.itemIdx].variable3  = ''
                return rtn
            })

            // 행동 데이터의 경우 trgtFilterItem 만 넘김
            props.trgtFilterItem && props.setTrgtFilterList((state: Array<TbRsCustFeatRuleTrgtFilter>) => {
                let rtn = cloneDeep(state)
                rtn[props.itemIdx].function  = ''
                rtn[props.itemIdx].variable1  = ''
                rtn[props.itemIdx].variable2  = ''
                rtn[props.itemIdx].variable3  = ''
                return rtn
            })
        }
    }

    const onClickTransFuncHandler = () => {
        setIsOpenTransFunctionPop((prevState) => !prevState)
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

        {/* 팝업 
        <TransFunctionPop
            isOpen={isOpenTransFunctionPop}
            onClose={(isOpen) => setIsOpenTransFunctionPop(isOpen)}
            itemIdx={props.itemIdx}
            colNm={props.targetItem.columnName}
            targetItem={props.targetItem}
            trgtFilterItem={props.trgtFilterItem}
            setTargetList={props.setTargetList}
            setTrgtFilterList={props.setTrgtFilterList}
            funcStr={funcStr}
            funcVal={props.targetItem.function}
            setFuncStr={setFuncStr}
            var1={props.targetItem.variable1}
            var2={props.targetItem.variable2}
            var3={props.targetItem.variable3}
        />
        */}
        </>
    )

}

export default TransFunction