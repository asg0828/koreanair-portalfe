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
import { 
    TbRsCustFeatRuleTrgt,
    TbRsCustFeatRuleTrgtFilter,
    TransFuncProps 
} from "@/models/selfFeature/FeatureInfo"

const TransFunction = ({
    isPossibleEdit,
    itemIdx,
    trgtItem,
    setTargetList,
    setTrgtFilterList,
}: TransFuncProps) => {

    const [ funcStr, setFuncStr ] = useState<string>('')
    const [ transFuncChecked, setTransFuncChecked ] = useState(false)
    const [ isOpenTransFunctionPop, setIsOpenTransFunctionPop ] = useState<boolean>(false)

    const onCheckedChange = () => {
        setTransFuncChecked(!transFuncChecked)
        setTargetList && setTargetList((state: Array<TbRsCustFeatRuleTrgt>) => {
            let rtn = cloneDeep(state)
            rtn[itemIdx].function = ''
            rtn[itemIdx].variable1 = ''
            rtn[itemIdx].variable2 = ''
            rtn[itemIdx].variable3 = ''
            return rtn
        })
        setTrgtFilterList && setTrgtFilterList((state: Array<TbRsCustFeatRuleTrgtFilter>) => {
            let rtn = cloneDeep(state)
            // target과 그에 해당하는 targetFilter의 인덱싱은 바뀔 수 있음.
            let updtTrgtFilterList = rtn.filter((trgtFilter: TbRsCustFeatRuleTrgtFilter) => trgtFilter.targetId === trgtItem.targetId)
            updtTrgtFilterList[itemIdx].function = ''
            updtTrgtFilterList[itemIdx].variable1 = ''
            updtTrgtFilterList[itemIdx].variable2 = ''
            updtTrgtFilterList[itemIdx].variable3 = ''
            rtn = rtn.filter((trgtFilter: TbRsCustFeatRuleTrgtFilter) => trgtFilter.targetId !== trgtItem.targetId)
            rtn = [...rtn, ...updtTrgtFilterList]
            return rtn
        })

        if (!transFuncChecked) {
            // 팝업 오픈
            setIsOpenTransFunctionPop((prevState) => !prevState)
        }
        
    }

    const onClickTransFuncHandler = () => {
        setIsOpenTransFunctionPop((prevState) => !prevState)
    }

    return (
        <>
        <Checkbox
            disabled={!isPossibleEdit}
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

        {/* 팝업 */}
        <TransFunctionPop
            isOpen={isOpenTransFunctionPop}
            onClose={(isOpen) => setIsOpenTransFunctionPop(isOpen)}
            isPossibleEdit={isPossibleEdit}
            itemIdx={itemIdx}
            trgtItem={trgtItem}
            funcStr={funcStr}
            setFuncStr={setFuncStr}
            setTargetList={setTargetList}
            setTrgtFilterList={setTrgtFilterList}
            setTransFuncChecked={setTransFuncChecked}
        />
        </>
    )

}

export default TransFunction