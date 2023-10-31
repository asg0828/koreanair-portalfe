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
    Typography,
} from '@components/ui';

import { 
    transFuncOtion 
} from '@/pages/user/self-feature/data';
import { 
    TbRsCustFeatRuleTrgt,
    TbRsCustFeatRuleTrgtFilter,
    TransFuncProps
} from '@/models/selfFeature/FeatureInfo';

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
        funcStr,
        setFuncStr,
        setTargetList,
        setTrgtFilterList,
        setTransFuncChecked,
    }: TransFuncProps) => {
    
    const [ isOpenPopUp, setIsOpenPopUp ] = useState<boolean>(false)

    useEffect(() => {
        setIsOpenPopUp(isOpen)
        // 팝업 오픈시
        if (isOpen) {

        }
    }, [isOpen])

    useEffect(() => {
        transFuncCalcStr(trgtItem.function, '', '', '')
    }, [trgtItem.function])

    useEffect(() => {
        transFuncCalcStr(trgtItem.function, trgtItem.variable1, trgtItem.variable2, trgtItem.variable3)
    }, [trgtItem.variable1])

    useEffect(() => {
        transFuncCalcStr(trgtItem.function, trgtItem.variable1, trgtItem.variable2, trgtItem.variable3)
    }, [trgtItem.variable2])

    useEffect(() => {
        transFuncCalcStr(trgtItem.function, trgtItem.variable1, trgtItem.variable2, trgtItem.variable3)
    }, [trgtItem.variable3])

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

    const transFuncCalcStr = (funcType: string, var1: string, var2: string, var3: string) => {
        let rtnStr = `${funcType}(${trgtItem.columnName}`

        if (funcType === "NVL") {

            if (var1 === "") rtnStr += ', [대체값])'
            else rtnStr += `, [${var1}])`

        } else if (funcType === "SUBSTRING") {

            if (var1 === "") rtnStr += ', [시작위치]'
            else rtnStr += `, [${var1}]`

            if (var2 === "") rtnStr += ', [길이])'
            else rtnStr += `, [${var2}])`
            
        } else if (funcType === "LENGTH") {
            rtnStr += ')'
        } else if (funcType === "CONCAT") {

            if (var1 === "") rtnStr += ', [컬럼1]'
            else rtnStr += `, [${var1}]`

            if (var2 === "") rtnStr += ', [컬럼2])'
            else rtnStr += `, [${var2}]`

            if (var3 === "") rtnStr += ', [컬럼3])'
            else rtnStr += `, [${var3}])`

        } else if (funcType === "TO_NUMBER") {
            rtnStr += ')'
        } else {
            rtnStr = ""
        }

        setFuncStr && setFuncStr(rtnStr)

    }

    const setTrgtItem = (funcType: string, var1: string, var2: string, var3: string) => {

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
            // target과 그에 해당하는 targetFilter의 인덱싱은 바뀔 수 있음.
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
    // 적용
    const handleConfirm = () => {
        if (trgtItem.function === "") {
            setTransFuncChecked && setTransFuncChecked(false)
            setTrgtItem('', '', '', '')
        } else {
            setTrgtItem(trgtItem.function, trgtItem.variable1, trgtItem.variable2, trgtItem.variable3)
        }
        handleClose(false)
    }

    const handleClosePop = () => {
        // 변환식 적용 전 팝업 닫기인 경우
        if (trgtItem.function === "") {
            setTransFuncChecked && setTransFuncChecked(false)
            setTrgtItem('', '', '', '')
        }
        handleClose(false)
    }

    const handleResetTransFunc = () => {
        setTransFuncChecked && setTransFuncChecked(false)
        setTrgtItem('', '', '', '')
        // 팝업 close
        handleClose(false)
    }

    const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        
        setTargetList && setTargetList((state: Array<TbRsCustFeatRuleTrgt>) => {
            let rtn = cloneDeep(state)
            rtn[itemIdx][id] = value
            return rtn
        })
        setTrgtFilterList && setTrgtFilterList((state: Array<TbRsCustFeatRuleTrgtFilter>) => {
            let rtn = cloneDeep(state)
            // target과 그에 해당하는 targetFilter의 인덱싱은 바뀔 수 있음.
            let updtTrgtFilterList = rtn.filter((trgtFilter: TbRsCustFeatRuleTrgtFilter) => trgtFilter.targetId === trgtItem.targetId)
            updtTrgtFilterList[itemIdx][id] = value
            rtn = rtn.filter((trgtFilter: TbRsCustFeatRuleTrgtFilter) => trgtFilter.targetId !== trgtItem.targetId)
            rtn = [...rtn, ...updtTrgtFilterList]
            return rtn
        })
        
    }

    const onchangeSelectHandler = (
        e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
        value: SelectValue<{}, false>,
        id?: string,
    ) => {
        let keyNm = String(id)
        let v = String(value)
        let t = false

        if (keyNm === "function") {
            t = true
        }

        setTargetList && setTargetList((state: Array<TbRsCustFeatRuleTrgt>) => {
            let rtn = cloneDeep(state)
            rtn[itemIdx][keyNm] = v
            return rtn
        })
        setTrgtFilterList && setTrgtFilterList((state: Array<TbRsCustFeatRuleTrgtFilter>) => {
            let rtn = cloneDeep(state)
            // target과 그에 해당하는 targetFilter의 인덱싱은 바뀔 수 있음.
            let updtTrgtFilterList = rtn.filter((trgtFilter: TbRsCustFeatRuleTrgtFilter) => trgtFilter.targetId === trgtItem.targetId)
            updtTrgtFilterList[itemIdx][keyNm] = v
            if (t) {
                updtTrgtFilterList[itemIdx].variable1 = ''
                updtTrgtFilterList[itemIdx].variable2 = ''
                updtTrgtFilterList[itemIdx].variable3 = ''
            }
            rtn = rtn.filter((trgtFilter: TbRsCustFeatRuleTrgtFilter) => trgtFilter.targetId !== trgtItem.targetId)
            rtn = [...rtn, ...updtTrgtFilterList]
            return rtn
        })

    }    

    return (
        <Modal 
            open={isOpenPopUp} 
            onClose={handleClose} 
            size='LG'
            closeOnOutsideClick={false}
        >
            <Modal.Header>변환식</Modal.Header>
            <Modal.Body>
                <Stack
                    direction="Vertical"
                    gap="MD"
                    justifyContent="Start"
                >
                    
                    <Stack
                        direction="Horizontal"
                        gap="MD"
                        justifyContent="Start"
                    >
                        <Typography variant='h6'>변환식</Typography>
                        <TextField style={{width: '450px'}} readOnly value={funcStr} ></TextField>
                    </Stack>
                    <Stack
                        direction="Horizontal"
                        gap="MD"
                        justifyContent="Start"
                    >
                        <Typography variant='h6'>함수</Typography>
                        <Select
                            appearance="Outline"
                            value={trgtItem.function}
                            shape="Square"
                            size="SM"
                            status="default"
                            style={{
                                width: '11.25rem',
                            }}
                            onChange={(
                                e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                                value: SelectValue<{}, false>
                            ) => {
                                onchangeSelectHandler(e, value, "function")
                            }}
                        >
                            {transFuncOtion.map((item, index) => (
                            <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                            ))}
                        </Select>
                    </Stack>
                    {trgtItem.function === "NVL" &&
                        <>
                        <Stack
                            direction="Horizontal"
                            gap="MD"
                            justifyContent="Start"
                        >
                            <Typography variant='h6'>대체값</Typography>
                            <TextField value={trgtItem.variable1} id='variable1' onChange={onchangeInputHandler}></TextField>
                        </Stack>
                        </>
                    }
                    {trgtItem.function === "SUBSTRING" &&
                        <>
                        <Stack
                            direction="Horizontal"
                            gap="MD"
                            justifyContent="Start"
                        >
                            <Typography variant='h6'>시작위치</Typography>
                            <TextField value={trgtItem.variable1} id='variable1' onChange={onchangeInputHandler}></TextField>
                        </Stack>
                        <Stack
                            direction="Horizontal"
                            gap="MD"
                            justifyContent="Start"
                        >
                            <Typography variant='h6'>길이</Typography>
                            <TextField value={trgtItem.variable2} id='variable2' onChange={onchangeInputHandler}></TextField>
                        </Stack>
                        </>
                    }
                    {trgtItem.function === "CONCAT" &&
                        <>
                        <Stack
                            direction="Horizontal"
                            gap="MD"
                            justifyContent="Start"
                        >
                            <Typography variant='h6'>컬럼1</Typography>
                            <Select 
                                appearance="Outline"
                                value={trgtItem.variable1}
                                shape="Square"
                                size="SM"
                                status="default"
                                style={{
                                    width: '11.25rem',
                                }}
                                onChange={(
                                    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                                    value: SelectValue<{}, false>
                                ) => {
                                    onchangeSelectHandler(e, value, "variable1")
                                }}
                            >
                                {columns.map((item, index) => (
                                <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                                ))}
                            </Select>
                        </Stack>
                        <Stack
                            direction="Horizontal"
                            gap="MD"
                            justifyContent="Start"
                        >
                            <Typography variant='h6'>컬럼2</Typography>
                            <Select 
                                appearance="Outline"
                                value={trgtItem.variable2}
                                shape="Square"
                                size="SM"
                                status="default"
                                style={{
                                    width: '11.25rem',
                                }}
                                onChange={(
                                    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                                    value: SelectValue<{}, false>
                                ) => {
                                    onchangeSelectHandler(e, value, "variable2")
                                }}
                            >
                                {columns.map((item, index) => (
                                <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                                ))}
                            </Select>
                        </Stack>
                        <Stack
                            direction="Horizontal"
                            gap="MD"
                            justifyContent="Start"
                        >
                            <Typography variant='h6'>컬럼3</Typography>
                            <Select 
                                appearance="Outline"
                                value={trgtItem.variable3}
                                shape="Square"
                                size="SM"
                                status="default"
                                style={{
                                    width: '11.25rem',
                                }}
                                onChange={(
                                    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                                    value: SelectValue<{}, false>
                                ) => {
                                    onchangeSelectHandler(e, value, "variable3")
                                }}
                            >
                                {columns.map((item, index) => (
                                <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                                ))}
                            </Select>
                        </Stack>
                        </>
                    }
                </Stack>
            </Modal.Body>
            <Modal.Footer>
                <Button priority="Normal" appearance="Contained" onClick={handleResetTransFunc}>
                초기화
                </Button>
                <Button priority="Normal" appearance="Contained" onClick={handleConfirm}>
                적용
                </Button>
                <Button priority="Normal" appearance="Contained" onClick={handleClosePop}>
                닫기
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default TransFunctionPop