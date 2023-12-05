import {
    useState,
    useEffect,
    useCallback
} from 'react'
import { cloneDeep } from 'lodash'
import { SelectValue } from '@mui/base/useSelect';
//import DatePicker from 'react-datepicker'
//import 'react-datepicker/dist/react-datepicker.css'

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
    AggregateCol,
    TbRsCustFeatRuleTrgt,
    TbRsCustFeatRuleTrgtFilter,
    TransFuncProps
} from '@/models/selfFeature/FeatureModel';
import { transFuncCalcStr } from '@/utils/self-feature/FormulaValidUtil';
import { ColDataType, CommonCode, CommonCodeInfo, ModalType, initCommonCodeInfo } from '@/models/selfFeature/FeatureCommon';
import { useCommCodes } from '@/hooks/queries/self-feature/useSelfFeatureCmmQueries';
import ConfirmModal from '@/components/modal/ConfirmModal';
import dayjs from 'dayjs';
import '@/assets/styles/SelfFeature.scss'

const TransFunctionModal = ({
    isOpen = false,
    onClose,
    itemIdx,
    dataType,
    trgtItem,
    columnList,
    setTargetList,
    setTrgtFilterList,
    setTransFuncChecked, }: TransFuncProps) => {

    const { data: cmmCodeFuncRes } = useCommCodes(CommonCode.FUNCTION)
    const { data: cmmCodeFrmtRes } = useCommCodes(CommonCode.FORMAT)

    const [isOpenTransFuncModal, setIsOpenTransFuncModal] = useState<boolean>(false)

    const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)
    const [confirmModalTit, setConfirmModalTit] = useState<string>('')
    const [confirmModalCont, setConfirmModalCont] = useState<string>('')
    const [modalType, setModalType] = useState<string>('')
    const [btnType, setBtnType] = useState<string>("")

    const [transFuncOtion, setTransFuncOtion] = useState<Array<CommonCodeInfo>>([])
    const [tsDateFormatOption, setTsDateFormatOption] = useState<Array<CommonCodeInfo>>([])

    const [funcStrVal, setFuncStrVal] = useState<string>('')
    const [functionVal, setFunctionVal] = useState<string>('')
    const [variable1Val, setVariable1Val] = useState<string>('')
    const [variable2Val, setVariable2Val] = useState<string>('')
    const [variable3Val, setVariable3Val] = useState<string>('')

    const [enableColList, setEnableColList] = useState<Array<AggregateCol>>([])
    const [variable1SlctOpt, setVariable1SlctOpt] = useState<Array<AggregateCol>>([])
    const [variable2SlctOpt, setVariable2SlctOpt] = useState<Array<AggregateCol>>([])
    const [variable3SlctOpt, setVariable3SlctOpt] = useState<Array<AggregateCol>>([])

    const [dtSlctOpt, setDtSlctOpt] = useState<Array<AggregateCol>>([])
    const [strtDtChecked, setStrtDtChecked] = useState(false)
    const [endDtChecked, setEndDtChecked] = useState(false)

    useEffect(() => {
        setIsOpenTransFuncModal(isOpen)
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

    // modal 확인/취소 이벤트
    const onConfirm = () => {
        if (modalType === ModalType.CONFIRM) {
            if (btnType === "transClear") {
                transPopClear()
                setIsOpenConfirmModal(false)
            }
            if (btnType === "transApply") {
                validationCheckModal()
            }
        }
        if (modalType === ModalType.ALERT) {
            setIsOpenConfirmModal(false)
        }
    }
    const onCancel = () => {
        setIsOpenConfirmModal(false)
    }
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
        // 모달 open false
        setIsOpenConfirmModal(false)

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
            let tempList = cloneDeep(columnList).filter((col: AggregateCol) => (col.value === trgtItem.columnName))
            return [...rtn, ...tempList]
        })

    }, [columnList])
    // 변환식 팝업 close
    const handleClose = useCallback(
        (isOpenTransFuncModal: boolean) => {
            if (onClose) {
                if (trgtItem.function === "") setTransFuncChecked && setTransFuncChecked(false)
                onClose(isOpenTransFuncModal)
            } else {
                setIsOpenTransFuncModal(isOpenTransFuncModal)
            }
        },
        [onClose]
    )
    // 변환식 항목 값 setting
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
    // 팝업에서 보여지는 값 setting
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
    // 적용시 값 validation check
    const validationCheckModal = () => {
        if (functionVal === "") {
            setModalType(ModalType.ALERT)
            setConfirmModalTit("변환식")
            setConfirmModalCont("선택된 함수가 없습니다.")
            setIsOpenConfirmModal(true)
            //setTransFuncChecked && setTransFuncChecked(false)
            //setTrgtItem('', '', '', '')
        } else {
            if (functionVal === "NVL") {
                if (!variable1Val || variable1Val === "") {
                    setModalType(ModalType.ALERT)
                    setConfirmModalTit("변환식")
                    setConfirmModalCont("대체값을 입력해 주세요.")
                    setIsOpenConfirmModal(true)
                } else {
                    setTrgtItem(functionVal, variable1Val, variable2Val, variable3Val)
                    setIsOpenConfirmModal(false)
                    handleClose(false)
                }
            } else if (functionVal === "SUBSTRING") {
                if (!variable1Val) {
                    setModalType(ModalType.ALERT)
                    setConfirmModalTit("변환식")
                    setConfirmModalCont("시작위치을 입력해 주세요.")
                    setIsOpenConfirmModal(true)
                } else if (!variable2Val) {
                    setModalType(ModalType.ALERT)
                    setConfirmModalTit("변환식")
                    setConfirmModalCont("길이를 입력해 주세요.")
                    setIsOpenConfirmModal(true)
                } else {
                    setTrgtItem(functionVal, variable1Val, variable2Val, variable3Val)
                    setIsOpenConfirmModal(false)
                    handleClose(false)
                }
            } else if (functionVal === "CONCAT") {
                if (!variable1Val && !variable2Val && !variable3Val) {
                    setModalType(ModalType.ALERT)
                    setConfirmModalTit("변환식")
                    setConfirmModalCont("컬럼을 1개 이상 선택해 주세요.")
                    setIsOpenConfirmModal(true)
                } else {
                    setTrgtItem(functionVal, variable1Val, variable2Val, variable3Val)
                    setIsOpenConfirmModal(false)
                    handleClose(false)
                }
            } else if (functionVal === "TO_CHAR") {
                if (!variable1Val) {
                    setModalType(ModalType.ALERT)
                    setConfirmModalTit("변환식")
                    setConfirmModalCont("단위를 선택해 주세요.")
                    setIsOpenConfirmModal(true)
                } else {
                    setTrgtItem(functionVal, variable1Val, variable2Val, variable3Val)
                    setIsOpenConfirmModal(false)
                    handleClose(false)
                }
            } else if (functionVal === "DATEADD") {
                if (!variable1Val) {
                    setModalType(ModalType.ALERT)
                    setConfirmModalTit("변환식")
                    setConfirmModalCont("단위를 선택해 주세요.")
                    setIsOpenConfirmModal(true)
                } else if (!variable2Val) {
                    setModalType(ModalType.ALERT)
                    setConfirmModalTit("변환식")
                    setConfirmModalCont("숫자를 입력해 주세요.")
                    setIsOpenConfirmModal(true)
                } else {
                    setTrgtItem(functionVal, variable1Val, variable2Val, variable3Val)
                    setIsOpenConfirmModal(false)
                    handleClose(false)
                }
            } else if (functionVal === "DATEDIFF") {
                if (!variable1Val) {
                    setModalType(ModalType.ALERT)
                    setConfirmModalTit("변환식")
                    setConfirmModalCont("단위를 선택해 주세요.")
                    setIsOpenConfirmModal(true)
                } else if (!variable2Val || variable2Val === "") {
                    setModalType(ModalType.ALERT)
                    setConfirmModalTit("변환식")
                    setConfirmModalCont("시작일자를 설정해 주세요.")
                    setIsOpenConfirmModal(true)
                } else if (!variable3Val || variable3Val === "") {
                    setModalType(ModalType.ALERT)
                    setConfirmModalTit("변환식")
                    setConfirmModalCont("종료일자를 설정해 주세요.")
                    setIsOpenConfirmModal(true)
                } else {
                    setTrgtItem(functionVal, variable1Val, variable2Val, variable3Val)
                    setIsOpenConfirmModal(false)
                    handleClose(false)
                }
            } else {
                setTrgtItem(functionVal, variable1Val, variable2Val, variable3Val)
                setIsOpenConfirmModal(false)
                handleClose(false)
            }
        }
    }
    // 적용
    const handleConfirm = () => {
		setModalType(ModalType.CONFIRM)
        setBtnType("transApply")
		setConfirmModalTit("변환식")
		setConfirmModalCont("정말로 적용 하시겠습니까?")
		setIsOpenConfirmModal(true)
    }
    // 닫기 버튼 클릭
    const handleClosePop = () => {
        if (trgtItem.function === "") {
            setTransFuncChecked && setTransFuncChecked(false)
        }
        // 이전 값을 기억하고 있어야한다.
        setTrgtItem(trgtItem.function, trgtItem.variable1, trgtItem.variable2, trgtItem.variable3)
        setTempTrgtItem('', '', '', '')
        handleClose(false)
    }
    // 초기화 버튼 클릭
    const handleResetTransFunc = () => {
		setModalType(ModalType.CONFIRM)
        setBtnType("transClear")
		setConfirmModalTit("변환식")
		setConfirmModalCont("정말로 초기화 하시겠습니까?")
		setIsOpenConfirmModal(true)
    }
    // 변환식 팝업 항목 초기화
    const transPopClear = () => {
        // setTransFuncChecked && setTransFuncChecked(false)
        // setTrgtItem('', '', '', '')
        setTempTrgtItem('', '', '', '')
        // 달력 체크 취소
        setStrtDtChecked(false)
        setEndDtChecked(false)
        // 팝업 close
        //handleClose(false)
    }
    // input 값 변경시
    const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        if (id === "functionVal") setFunctionVal(value)
        else if (id === "variable1Val") setVariable1Val(value)
        else if (id === "variable2Val") setVariable2Val(value)
        else if (id === "variable3Val") setVariable3Val(value)
    }
    // select 선택시
    const onchangeSelectHandler = (
        e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
        value: SelectValue<{}, false>,
        id?: string,
    ) => {
        let keyNm = String(id)
        let v = String(value)

        if (v === "null" || v === "undefined") return

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
                    setVariable3Val(dtSlctOpt[dtSlctOpt.length - 1].value)
                } else if (keyNm === "variable3Val") {
                    // 종료일
                    setVariable2Val(dtSlctOpt[dtSlctOpt.length - 1].value)
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
            setVariable3Val(dtSlctOpt[dtSlctOpt.length - 1].value)
        } else if (dtTp === "variable3Val") {
            setStrtDtChecked(false)
            setEndDtChecked(true)
            setVariable2Val(dtSlctOpt[dtSlctOpt.length - 1].value)
            setVariable3Val("")
        }
    }

    return (
        <Modal
            open={isOpenTransFuncModal}
            onClose={handleClose}
            size='MD'
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
                                            type='number'
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
                                            type='number'
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
                                    단위
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
                                        <Stack 
                                            alignItems="Center"
                                            direction="Horizontal" 
                                            gap="MD" 
                                            className="width-100"
                                        >
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
                                                    popupOptionWhenPopup="fixed"
                                                    onChange={(e) => {e.target.value = ""}}
                                                    onValueChange={(nextVal) => {
                                                        setVariable2Val(nextVal)
                                                    }}
                                                    // placeholderText='날짜 선택'
                                                    // value={variable2Val}
                                                    // //onChange={(e) => {e.target.value = ""}}
                                                    // onChange={(date) => {
                                                    //     setVariable2Val(dayjs(date).format("YYYY-MM-DD").toString())
                                                    // }}
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
                                        <Stack 
                                            alignItems="Center"
                                            direction="Horizontal" 
                                            gap="MD" 
                                            className="width-100"
                                        >
                                            <Checkbox
                                                label="달력"
                                                checked={endDtChecked}
                                                onCheckedChange={() => {
                                                    handleChecked("variable3Val")
                                                }}
                                            />
                                            {endDtChecked &&
                                                <DatePicker
                                                    //placeholderText='날짜 선택'
                                                    value={variable3Val}
                                                    appearance="Outline"
                                                    calendarViewMode="days"
                                                    mode="single"
                                                    shape="Square"
                                                    size="MD"
                                                    onChange={(e) => {e.target.value = ""}}
                                                    popupOptionWhenPopup="fixed"
                                                    onValueChange={(nextVal) => {
                                                        setVariable3Val(nextVal)
                                                    }}
                                                    //onChange={(date) => {
                                                    //    setVariable3Val(dayjs(date).format("YYYY-MM-DD").toString())
                                                    //}}
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


            {/* Confirm 모달 */}
            <ConfirmModal
                isOpen={isOpenConfirmModal}
                onClose={(isOpen) => setIsOpenConfirmModal(isOpen)}
                title={confirmModalTit}
                content={confirmModalCont}
                onConfirm={onConfirm}
                onCancle={onCancel}
                btnType={modalType}
            />
        </Modal>
    )
}

export default TransFunctionModal