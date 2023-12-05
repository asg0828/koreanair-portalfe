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
import TransFunctionModal from "../modal/TransFunctionModal"
import { 
    TbRsCustFeatRuleTrgt,
    TbRsCustFeatRuleTrgtFilter,
    TransFuncProps 
} from "@/models/selfFeature/FeatureModel"
import { transFuncCalcStr } from "@/utils/self-feature/FormulaValidUtil"

const TransFunction = ({
    isPossibleEdit,
    itemIdx,
    dataType,
    trgtItem,
    columnList,
    setTargetList,
    setTrgtFilterList,
}: TransFuncProps) => {

    const [ funcStr, setFuncStr ] = useState<string>('')
    const [ transFuncChecked, setTransFuncChecked ] = useState(false)
    const [ isOpenTransFunctionModal, setIsOpenTransFunctionModal ] = useState<boolean>(false)

    useEffect(() => {
        if (trgtItem.function !== "") {
            setTransFuncChecked(true)
        } else {
            setTransFuncChecked(false)
        }
        transFuncCalcStr({
            colNm: trgtItem.columnName,
            setFuncStr: setFuncStr,
            funcType: trgtItem.function,
            var1: trgtItem.variable1,
            var2: trgtItem.variable2,
            var3: trgtItem.variable3,
        })
    }, [trgtItem.function, trgtItem.variable1, trgtItem.variable2, trgtItem.variable3])

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
            setIsOpenTransFunctionModal((prevState) => !prevState)
        }
        
    }

    const onClickTransFuncHandler = () => {
        setIsOpenTransFunctionModal((prevState) => !prevState)
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
                position="top"
                shape="Square"
            >
                <Button
                    appearance="Outline"
                    disabled={!isPossibleEdit || !transFuncChecked}
                    priority="Normal"
                    shape="Square"
                    size="SM"
                    onClick={() => onClickTransFuncHandler()}
                >
                변환
                </Button>
            </Tooltip>
        ) : (
            <Button
                appearance="Outline"
                disabled={!isPossibleEdit || !transFuncChecked}
                priority="Normal"
                shape="Square"
                size="SM"
                onClick={() => onClickTransFuncHandler()}
            >
            변환
            </Button>
        )}

        {/* 팝업 */}
        <TransFunctionModal
            isOpen={isOpenTransFunctionModal}
            onClose={(isOpen) => setIsOpenTransFunctionModal(isOpen)}
            itemIdx={itemIdx}
            dataType={dataType}
            trgtItem={trgtItem}
            columnList={columnList}
            setTargetList={setTargetList}
            setTrgtFilterList={setTrgtFilterList}
            setTransFuncChecked={setTransFuncChecked}
        />
        </>
    )

}

export default TransFunction