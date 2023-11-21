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
    Checkbox,
    DatePicker,
} from '@components/ui';
import HorizontalTable from '@/components/table/HorizontalTable';

import { 
    tsDtAddDiffOption,
    tsToCharOption, 
} from '@/pages/user/self-feature/data';
import { 
    AggregateCol,
    TbRsCustFeatRuleTrgt,
    TbRsCustFeatRuleTrgtFilter,
    TransFuncProps
} from '@/models/selfFeature/FeatureInfo';
import { transFuncCalcStr } from '@/utils/self-feature/FormulaValidUtil';
import { ColDataType, CommonCode, CommonCodeInfo, initCommonCodeInfo } from '@/models/selfFeature/FeatureCommon';
import { useCommCodes } from '@/hooks/queries/self-feature/useSelfFeatureCmmQueries';

const TransFunctionPop = (
    { 
        isOpen = false, 
        onClose, 
        itemIdx,
        dataType,
        trgtItem,
        columnList,
        setTargetList,
        setTrgtFilterList,
        setTransFuncChecked,
    }: TransFuncProps) => {

    const { 
        data: cmmCodeFuncRes, 
        isError: cmmCodeFuncErr, 
        refetch: cmmCodeFuncRefetch 
    } = useCommCodes(CommonCode.FUNCTION)
    const { 
        data: cmmCodeFrmtRes, 
        isError: cmmCodeFrmtErr, 
        refetch: cmmCodeFrmtRefetch 
    } = useCommCodes(CommonCode.FORMAT)

    const [ isOpenPopUp, setIsOpenPopUp ] = useState<boolean>(false)

    const [ transFuncOtion, setTransFuncOtion ] = useState<Array<CommonCodeInfo>>([])
    const [ tsDateFormatOption, setTsDateFormatOption ] = useState<Array<CommonCodeInfo>>([])

    const [ funcStrVal, setFuncStrVal ] = useState<string>('')
    const [ functionVal,  setFunctionVal ] = useState<string>('')
    const [ variable1Val, setVariable1Val ] = useState<string>('')
    const [ variable2Val, setVariable2Val ] = useState<string>('')
    const [ variable3Val, setVariable3Val ] = useState<string>('')

    const [ enableColList, setEnableColList ] = useState<Array<AggregateCol>>([])
    const [ variable1SlctOpt, setVariable1SlctOpt ] = useState<Array<AggregateCol>>([])
    const [ variable2SlctOpt, setVariable2SlctOpt ] = useState<Array<AggregateCol>>([])
    const [ variable3SlctOpt, setVariable3SlctOpt ] = useState<Array<AggregateCol>>([])

    const [ dtSlctOpt, setDtSlctOpt ] = useState<Array<AggregateCol>>([])
    const [ strtDtChecked, setStrtDtChecked ] = useState(false)
    const [ endDtChecked, setEndDtChecked ] = useState(false)

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
        if (cmmCodeFuncRes) {
            setTransFuncOtion((prevState: Array<CommonCodeInfo>) => {
                let rtn = cloneDeep(prevState)
                rtn = cmmCodeFuncRes.result.filter((v: CommonCodeInfo) => {
                    if (dataType !== "" && v.attr1.includes(dataType)) {
                        if (enableColList.length < 1 && v.cdv === "CONCAT") return false
                        else return true
                    } else {
                        return false
                    }
                })
                return [...cloneDeep([initCommonCodeInfo]), ...rtn]
            })
        }
    }, [dataType, enableColList])

    useEffect(() => {
        transFuncCalcStr({
            colNm: trgtItem.columnName,
            setFuncStr: setFuncStrVal,
            funcType: functionVal,
            var1: '',
            var2: '',
            var3: '',
        })

        // 형식 select option 변경
        if (cmmCodeFrmtRes) {
            if (functionVal === "TO_CHAR") {
                setTsDateFormatOption((prevState: Array<CommonCodeInfo>) => {
                    let rtn = cloneDeep(prevState)
                    rtn = cmmCodeFrmtRes.result.filter((v: CommonCodeInfo) => (v.attr4.includes("Y")))
                    return [...cloneDeep([initCommonCodeInfo]), ...rtn]
                })
            } else if (functionVal === "DATEADD") {
                setTsDateFormatOption((prevState: Array<CommonCodeInfo>) => {
                    let rtn = cloneDeep(prevState)
                    rtn = cmmCodeFrmtRes.result.filter((v: CommonCodeInfo) => (v.attr2.includes("Y")))
                    return [...cloneDeep([initCommonCodeInfo]), ...rtn]
                })
            } else if (functionVal === "DATEDIFF") {
                setTsDateFormatOption((prevState: Array<CommonCodeInfo>) => {
                    let rtn = cloneDeep(prevState)
                    rtn = cmmCodeFrmtRes.result.filter((v: CommonCodeInfo) => (v.attr3.includes("Y")))
                    return [...cloneDeep([initCommonCodeInfo]), ...rtn]
                })
            }
        }

        // 달력 체크 취소
        setStrtDtChecked(false)
        setEndDtChecked(false)

        if (!columnList) return
        let strColList = cloneDeep(columnList).filter((col: AggregateCol) => (col.dataType === ColDataType.STR && col.text !== trgtItem.columnName))
        setVariable1SlctOpt(strColList)
        setVariable2SlctOpt(strColList)
        setVariable3SlctOpt(strColList)

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
        // concat 함수 사용시 컬럼1,2,3 값이 바뀔 경우 select option 재설정
        if (functionVal === "CONCAT") {
            setVariable2SlctOpt(() => {
                let rtn = cloneDeep(enableColList)
                rtn = rtn.filter((col: AggregateCol) => col.value !== variable1Val)
                rtn = rtn.filter((col: AggregateCol) => col.value !== variable3Val)
                return rtn
            })
            setVariable3SlctOpt(() => {
                let rtn = cloneDeep(enableColList)
                rtn = rtn.filter((col: AggregateCol) => col.value !== variable1Val)
                rtn = rtn.filter((col: AggregateCol) => col.value !== variable2Val)
                return rtn
            })
        }
    }, [variable1Val])

    useEffect(() => {
        
        transFuncCalcStr({
            colNm: trgtItem.columnName,
            setFuncStr: setFuncStrVal,
            funcType: functionVal,
            var1: variable1Val,
            var2: variable2Val,
            var3: variable3Val,
        })
        // concat 함수 사용시 컬럼1,2,3 값이 바뀔 경우 select option 재설정
        if (functionVal === "CONCAT") {
            setVariable1SlctOpt(() => {
                let rtn = cloneDeep(enableColList)
                rtn = rtn.filter((col: AggregateCol) => col.value !== variable2Val)
                rtn = rtn.filter((col: AggregateCol) => col.value !== variable3Val)
                return rtn
            })
            setVariable3SlctOpt(() => {
                let rtn = cloneDeep(enableColList)
                rtn = rtn.filter((col: AggregateCol) => col.value !== variable1Val)
                rtn = rtn.filter((col: AggregateCol) => col.value !== variable2Val)
                return rtn
            })
        }
        // date diff 함수 사용일 경우 날짜 형식 판별
        if (functionVal === "DATEDIFF") {
            if (!isNaN(Date.parse(variable2Val))) {
                //날짜 형식이면
                setStrtDtChecked(true)
            }
        }
    }, [variable2Val])

    useEffect(() => {
        transFuncCalcStr({
            colNm: trgtItem.columnName,
            setFuncStr: setFuncStrVal,
            funcType: functionVal,
            var1: variable1Val,
            var2: variable2Val,
            var3: variable3Val,
        })
        // concat 함수 사용시 컬럼1,2,3 값이 바뀔 경우 select option 재설정
        if (functionVal === "CONCAT") {
            setVariable1SlctOpt(() => {
                let rtn = cloneDeep(enableColList)
                rtn = rtn.filter((col: AggregateCol) => col.value !== variable2Val)
                rtn = rtn.filter((col: AggregateCol) => col.value !== variable3Val)
                return rtn
            })
            setVariable2SlctOpt(() => {
                let rtn = cloneDeep(enableColList)
                rtn = rtn.filter((col: AggregateCol) => col.value !== variable1Val)
                rtn = rtn.filter((col: AggregateCol) => col.value !== variable3Val)
                return rtn
            })
        }
        // date diff 함수 사용일 경우 날짜 형식 판별
        if (functionVal === "DATEDIFF") {
            if (!isNaN(Date.parse(variable3Val))) {
                //날짜 형식이면
                setEndDtChecked(true)
            }
        }
    }, [variable3Val])

    useEffect(() => {
        if (!columnList) return
        // concat 함수 선택시 필요한 variable option 설정
        let strColList = cloneDeep(columnList).filter((col: AggregateCol) => (col.dataType === ColDataType.STR && col.text !== trgtItem.columnName))
        
        setEnableColList(strColList)
        setVariable1SlctOpt(strColList)
        setVariable2SlctOpt(strColList)
        setVariable3SlctOpt(strColList)
        // datediff 함수 선택시 필요한 column option 설정
        setDtSlctOpt(() => {
            let rtn = [{
                value: "now",
                text: "현재",
                dataType: "timestamp",
            }]
            let tempList = cloneDeep(columnList).filter((col: AggregateCol) => (col.text === trgtItem.columnName))
            return [...rtn, ...tempList]
        })

    }, [columnList])

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
    // 초기화
    const handleResetTransFunc = () => {
        setTransFuncChecked && setTransFuncChecked(false)
        setTrgtItem('', '', '', '')
        setTempTrgtItem('', '', '', '')
        // 달력 체크 취소
        setStrtDtChecked(false)
        setEndDtChecked(false)
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
        let v = (String(value) && String(value) !== "null" && String(value) !== "undefined") ? String(value) : ''

        if (keyNm === "functionVal") {
            setTempTrgtItem(v, '', '', '')
        } else if (keyNm === "variable1Val") {
            setVariable1Val(v)
        } else if (keyNm === "variable2Val") {
            setVariable2Val(v)
        } else if (keyNm === "variable3Val") {
            setVariable3Val(v)
        }

        // date diff 함수 적용시 시작일/종료일 select box 선택
        if (functionVal === "DATEDIFF" && (keyNm === "variable2Val" || keyNm === "variable3Val")) {
            // 어떤 select이든 Date Diff 함수 적용이고, select 선택시 달력 check 해제
            setStrtDtChecked(false)
            setEndDtChecked(false)
            // date diff 함수 선택이고 변수2,3을 선택하지 않은 경우 v === "" 이므로 값 설정 bypass
            if (v === "") return

            if (v === "now") {
                // 현재 select 선택
                if (keyNm === "variable2Val") {
                    // 시작일
                    setVariable3Val(dtSlctOpt[dtSlctOpt.length-1].value)
                } else if (keyNm === "variable3Val") {
                    // 종료일
                    setVariable2Val(dtSlctOpt[dtSlctOpt.length-1].value)
                }
            } else {
                // 컬럼명 select 선택
                if (keyNm === "variable2Val") {
                    // 시작일
                    setVariable3Val("now")
                } else if (keyNm === "variable3Val") {
                    // 종료일
                    setVariable2Val("now")
                }
            }
        }

    } 
    // 달력 체크박스 선택시
    const handleChecked = (dtTp: string) => {

        if (dtTp === "variable2Val") {
            setStrtDtChecked(true)
            setEndDtChecked(false)
            setVariable2Val("")
            setVariable3Val(dtSlctOpt[dtSlctOpt.length-1].value)
        } else if (dtTp === "variable3Val") {
            setStrtDtChecked(false)
            setEndDtChecked(true)
            setVariable2Val(dtSlctOpt[dtSlctOpt.length-1].value)
            setVariable3Val("")
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
                                    <SelectOption key={index} value={item.cdv}>{item.cdvNm}</SelectOption>
                                ))}
                                {transFuncOtion.length < 1 &&
                                    <SelectOption value="">함수 선택</SelectOption>
                                }
                            </Select>
                        </TD>
                    </TR>
                    {functionVal === "NVL" && dataType === ColDataType.NUM &&
                    <TR>
                        <TH colSpan={1} align="right">
                        대체값
                        </TH>
                        <TD colSpan={2}>
                            <TextField 
                                type='number'
                                className="width-100" 
                                value={variable1Val} 
                                id='variable1Val' 
                                onChange={onchangeInputHandler}
                            ></TextField>
                        </TD>
                    </TR>
                    }
                    {functionVal === "NVL" && dataType === ColDataType.STR &&
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
                                {variable1SlctOpt.map((item, index) => (
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
                                {variable2SlctOpt.map((item, index) => (
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
                                {variable3SlctOpt.map((item, index) => (
                                <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                                ))}
                            </Select>
                        </TD>
                    </TR>
                    </>
                    }
                    {(functionVal === "TO_CHAR" || functionVal === "DATEADD" || functionVal === "DATEDIFF") &&
                    <TR>
                        <TH colSpan={1} align="right">
                        형식
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
                                {tsDateFormatOption.map((item, index) => (
                                <SelectOption key={index} value={item.cdv}>{item.cdvNm}</SelectOption>
                                ))}
                            </Select>
                        </TD>
                    </TR>
                    }
                    {functionVal === "DATEADD" &&
                    <TR>
                        <TH colSpan={1} align="right">
                        숫자
                        </TH>
                        <TD colSpan={2}>
                            <TextField 
                                type='number'
                                className="width-100" 
                                value={variable2Val} 
                                id='variable2Val' 
                                onChange={onchangeInputHandler}
                            ></TextField>
                        </TD>
                    </TR>
                    }
                    {functionVal === "DATEDIFF" &&
                    <>
                    <TR>
                        <TH colSpan={1} align="right">
                        시작 일자
                        </TH>
                        <TD colSpan={2}>
                            <Stack gap="MD" className="width-100">
                                <Checkbox 
                                    label="달력" 
                                    checked={strtDtChecked}
                                    onCheckedChange={() => {
                                        handleChecked("variable2Val")
                                    }}
                                />
                                {strtDtChecked &&
                                <DatePicker
                                    value={variable2Val}
                                    appearance="Outline"
                                    calendarViewMode="days"
                                    mode="single"
                                    shape="Square"
                                    size="MD"
                                    //onChange={(e) => {e.target.value = ""}}
                                    onValueChange={(nextVal) => {
                                        setVariable2Val(nextVal)
                                    }}
                                />
                                }
                                {!strtDtChecked &&
                                <Select 
                                    value={variable2Val}
                                    appearance="Outline" 
                                    placeholder="선택" 
                                    className="width-100"
                                    onChange={(
                                        e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                                        value: SelectValue<{}, false>
                                    ) => {
                                        // 구분자 선택
                                        onchangeSelectHandler(e, value, "variable2Val")
                                    }}
                                >
                                    {dtSlctOpt.map((item, index) => (
                                    <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                                    ))}
                                </Select>
                                }
                            </Stack>
                        </TD>
                    </TR>
                    <TR>
                        <TH colSpan={1} align="right">
                        종료 일자
                        </TH>
                        <TD colSpan={2}>
                            <Stack gap="MD" className="width-100">
                                <Checkbox 
                                    label="달력" 
                                    checked={endDtChecked}
                                    onCheckedChange={() => {
                                        handleChecked("variable3Val")
                                    }}
                                />
                                {endDtChecked &&
                                <DatePicker
                                    value={variable3Val}
                                    appearance="Outline"
                                    calendarViewMode="days"
                                    mode="single"
                                    shape="Square"
                                    size="MD"
                                    //onChange={(e) => {e.target.value = ""}}
                                    onValueChange={(nextVal) => {
                                        setVariable3Val(nextVal)
                                    }}
                                />
                                }
                                {!endDtChecked &&
                                <Select 
                                    value={variable3Val}
                                    appearance="Outline" 
                                    placeholder="선택" 
                                    className="width-100"
                                    onChange={(
                                        e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                                        value: SelectValue<{}, false>
                                    ) => {
                                        // 구분자 선택
                                        onchangeSelectHandler(e, value, "variable3Val")
                                    }}
                                >
                                    {dtSlctOpt.map((item, index) => (
                                    <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                                    ))}
                                </Select>
                                }
                            </Stack>
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