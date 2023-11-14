import { 
    useState, 
    useEffect, 
    useCallback 
} from 'react'
import { cloneDeep } from 'lodash'
import { SelectValue } from '@mui/base/useSelect';

import { 
    Modal, 
    Button,
    Stack,
    TextField,
    Select,
    SelectOption,
    TR,
    TH,
    TD,
} from '@components/ui';
import HorizontalTable from '@/components/table/HorizontalTable';

import { 
    transFuncOtion 
} from '@/pages/user/self-feature/data';
import { 
    TbRsCustFeatRuleTrgt,
    TbRsCustFeatRuleTrgtFilter,
    TransFuncProps
} from '@/models/selfFeature/FeatureInfo';
import { transFuncCalcStr } from '@/utils/self-feature/FormulaValidUtil';

const columns = [
    { value: '',        text: '선택' },
    { value: 'column1', text: 'column1' },
    { value: 'column2', text: 'column2' },
    { value: 'column3', text: 'column3' },
]

const TransFunctionPop = (
    { 
        isOpen = false, 
        onClose, 
        itemIdx,
        trgtItem,
        setTargetList,
        setTrgtFilterList,
        setTransFuncChecked,
    }: TransFuncProps) => {
    
    const [ isOpenPopUp, setIsOpenPopUp ] = useState<boolean>(false)

    const [ funcStrVal, setFuncStrVal ] = useState<string>('')
    const [ functionVal,  setFunctionVal ] = useState<string>('')
    const [ variable1Val, setVariable1Val ] = useState<string>('')
    const [ variable2Val, setVariable2Val ] = useState<string>('')
    const [ variable3Val, setVariable3Val ] = useState<string>('')

    useEffect(() => {
        setIsOpenPopUp(isOpen)
        // 팝업 오픈시
        if (isOpen) {
            transFuncCalcStr({
                colNm: trgtItem.columnName,
                setFuncStr: setFuncStrVal,
                funcType: trgtItem.function,
                var1: trgtItem.variable1,
                var2: trgtItem.variable2,
                var3: trgtItem.variable3,
            })
            setTempTrgtItem(trgtItem.function, trgtItem.variable1, trgtItem.variable2, trgtItem.variable3)
        }
    }, [isOpen])

    useEffect(() => {
        transFuncCalcStr({
            colNm: trgtItem.columnName,
            setFuncStr: setFuncStrVal,
            funcType: functionVal,
            var1: '',
            var2: '',
            var3: '',
        })
    }, [functionVal])

    useEffect(() => {
        transFuncCalcStr({
            colNm: trgtItem.columnName,
            setFuncStr: setFuncStrVal,
            funcType: functionVal,
            var1: variable1Val,
            var2: variable2Val,
            var3: variable3Val,
        })
    }, [variable1Val, variable2Val, variable3Val])

    const handleClose = useCallback(
        (isOpenPopUp: boolean) => {
            if (onClose) {
                onClose(isOpenPopUp)
            } else {
                setIsOpenPopUp(isOpenPopUp)
            }
        },
        [onClose]
    )

    const setTrgtItem = (
        funcType: string,
        var1: string,
        var2: string,
        var3: string,
    ) => {

        setTargetList && setTargetList((state: Array<TbRsCustFeatRuleTrgt>) => {
            let rtn = cloneDeep(state)
            rtn[itemIdx].function = funcType
            rtn[itemIdx].variable1 = var1
            rtn[itemIdx].variable2 = var2
            rtn[itemIdx].variable3 = var3
            return rtn
        })
        setTrgtFilterList && setTrgtFilterList((state: Array<TbRsCustFeatRuleTrgtFilter>) => {
            let rtn = cloneDeep(state)
            let updtTrgtFilterList = rtn.filter((trgtFilter: TbRsCustFeatRuleTrgtFilter) => trgtFilter.targetId === trgtItem.targetId)
            updtTrgtFilterList[itemIdx].function = funcType
            updtTrgtFilterList[itemIdx].variable1 = var1
            updtTrgtFilterList[itemIdx].variable2 = var2
            updtTrgtFilterList[itemIdx].variable3 = var3
            rtn = rtn.filter((trgtFilter: TbRsCustFeatRuleTrgtFilter) => trgtFilter.targetId !== trgtItem.targetId)
            rtn = [...rtn, ...updtTrgtFilterList]
            return rtn
        })
    }

    const setTempTrgtItem = (
        funcType: string,
        var1: string,
        var2: string,
        var3: string,
    ) => {
        setFunctionVal(funcType)
        setVariable1Val(var1)
        setVariable2Val(var2)
        setVariable3Val(var3)
    }

    // 적용
    const handleConfirm = () => {
        if (functionVal === "") {
            setTransFuncChecked && setTransFuncChecked(false)
            setTrgtItem('', '', '', '')
        } else {
            setTrgtItem(functionVal, variable1Val, variable2Val, variable3Val)
        }
        handleClose(false)
    }

    const handleClosePop = () => {
        if (trgtItem.function === "") {
            setTransFuncChecked && setTransFuncChecked(false)
        }
        // 이전 값을 기억하고 있어야한다.
        setTrgtItem(trgtItem.function, trgtItem.variable1, trgtItem.variable2, trgtItem.variable3)
        setTempTrgtItem('', '', '', '')
        handleClose(false)
    }

    const handleResetTransFunc = () => {
        setTransFuncChecked && setTransFuncChecked(false)
        setTrgtItem('', '', '', '')
        setTempTrgtItem('', '', '', '')
        // 팝업 close
        handleClose(false)
    }

    const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        if (id === "functionVal") setFunctionVal(value)
        else if (id === "variable1Val") setVariable1Val(value)
        else if (id === "variable2Val") setVariable2Val(value)
        else if (id === "variable3Val") setVariable3Val(value)
    }

    const onchangeSelectHandler = (
        e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
        value: SelectValue<{}, false>,
        id?: string,
    ) => {
        let keyNm = String(id)
        let v = String(value)

        if (keyNm === "functionVal") {
            setTempTrgtItem(v, '', '', '')
        } else if (keyNm === "variable1Val") {
            setVariable1Val(v)
        } else if (keyNm === "variable2Val") {
            setVariable2Val(v)
        } else if (keyNm === "variable3Val") {
            setVariable3Val(v)
        }
    }    

    return (
        <Modal 
            open={isOpenPopUp} 
            onClose={handleClose} 
            size='SM'
            closeOnOutsideClick={false}
        >
            <Modal.Header>변환식</Modal.Header>
            <Modal.Body className="width-100">
                <Stack
                    direction="Vertical"
                    className="width-100"
                    gap="MD"
                >
                    <HorizontalTable className="width-100">
                        <TR>
                            <TH colSpan={1} align="right">
                            변환식
                            </TH>
                            <TD colSpan={2}>
                                <Stack gap="SM" className="width-100">
                                    <TextField className="width-100" readOnly value={funcStrVal} ></TextField>
                                </Stack>
                            </TD>
                        </TR>
                    </HorizontalTable>
                    <HorizontalTable className="width-100 bdtb">
                    <TR>
                        <TH colSpan={1} align="right">
                        함수
                        </TH>
                        <TD colSpan={2}>
                            <Select
                                appearance="Outline"
                                className="width-100"
                                value={functionVal}
                                onChange={(
                                    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                                    value: SelectValue<{}, false>
                                ) => {
                                    onchangeSelectHandler(e, value, "functionVal")
                                }}
                            >
                                {transFuncOtion.map((item, index) => (
                                <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                                ))}
                            </Select>
                        </TD>
                    </TR>
                    {functionVal === "NVL" &&
                    <TR>
                        <TH colSpan={1} align="right">
                        대체값
                        </TH>
                        <TD colSpan={2}>
                            <TextField 
                                className="width-100" 
                                value={variable1Val} 
                                id='variable1Val' 
                                onChange={onchangeInputHandler}
                            ></TextField>
                        </TD>
                    </TR>
                    }
                    {functionVal === "SUBSTRING" &&
                    <>
                    <TR>
                        <TH colSpan={1} align="right">
                        시작위치
                        </TH>
                        <TD colSpan={2}>
                            <TextField 
                                className="width-100"
                                value={variable1Val} 
                                id='variable1Val' 
                                onChange={onchangeInputHandler}
                            ></TextField>
                        </TD>
                    </TR>
                    <TR>
                        <TH colSpan={1} align="right">
                        길이
                        </TH>
                        <TD colSpan={2}>
                            <TextField 
                                className="width-100"
                                value={variable2Val} 
                                id='variable2Val' 
                                onChange={onchangeInputHandler}
                            ></TextField>
                        </TD>
                    </TR>
                    </>
                    }
                    {functionVal === "CONCAT" &&
                    <>
                    <TR>
                        <TH colSpan={1} align="right">
                        컬럼1
                        </TH>
                        <TD colSpan={2}>
                            <Select 
                                appearance="Outline"
                                className="width-100"
                                value={variable1Val}
                                onChange={(
                                    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                                    value: SelectValue<{}, false>
                                ) => {
                                    onchangeSelectHandler(e, value, "variable1Val")
                                }}
                            >
                                {columns.map((item, index) => (
                                <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                                ))}
                            </Select>
                        </TD>
                    </TR>
                    <TR>
                        <TH colSpan={1} align="right">
                        컬럼2
                        </TH>
                        <TD colSpan={2}>
                            <Select 
                                appearance="Outline"
                                className="width-100"
                                value={variable2Val}
                                onChange={(
                                    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                                    value: SelectValue<{}, false>
                                ) => {
                                    onchangeSelectHandler(e, value, "variable2Val")
                                }}
                            >
                                {columns.map((item, index) => (
                                <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                                ))}
                            </Select>
                        </TD>
                    </TR>
                    <TR>
                        <TH colSpan={1} align="right">
                        컬럼3
                        </TH>
                        <TD colSpan={2}>
                            <Select 
                                appearance="Outline"
                                className="width-100"
                                value={variable3Val}
                                onChange={(
                                    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                                    value: SelectValue<{}, false>
                                ) => {
                                    onchangeSelectHandler(e, value, "variable3Val")
                                }}
                            >
                                {columns.map((item, index) => (
                                <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                                ))}
                            </Select>
                        </TD>
                    </TR>
                    </>
                    }
                    </HorizontalTable>
                </Stack>
            </Modal.Body>
            <Modal.Footer>
                <Button priority="Normal" appearance="Outline" size="LG" onClick={handleResetTransFunc}>
                초기화
                </Button>
                <Button priority="Primary" appearance="Contained" size="LG" onClick={handleConfirm}>
                적용
                </Button>
                <Button priority="Normal" appearance="Outline" size="LG" onClick={handleClosePop}>
                닫기
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default TransFunctionPop