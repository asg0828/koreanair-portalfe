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
    TbRsCustFeatRuleTrgtFilter 
} from '@/models/selfFeature/FeatureInfo';

export interface Props {
    isOpen?: boolean
    onClose?: (isOpen: boolean) => void
    itemIdx: number
    colNm: string
    targetItem?: TbRsCustFeatRuleTrgt
    trgtFilterItem?: TbRsCustFeatRuleTrgtFilter
    setTargetList: React.Dispatch<React.SetStateAction<Array<TbRsCustFeatRuleTrgt>>>
    setTrgtFilterList: React.Dispatch<React.SetStateAction<Array<TbRsCustFeatRuleTrgtFilter>>>
    funcStr: string
    funcVal: string
    var1: string
    var2: string
    var3: string
    setFuncStr: React.Dispatch<React.SetStateAction<string>>
}

const columns = [
    { value: 'column1', text: 'column1' },
    { value: 'column2', text: 'column2' },
    { value: 'column3', text: 'column3' },
]

const TransFunctionPop = (
    { 
        isOpen = false, 
        onClose, 
        itemIdx,
        colNm,
        targetItem,
        trgtFilterItem,
        setTargetList,
        setTrgtFilterList,
        funcStr,
        funcVal,
        var1,
        var2,
        var3,
        setFuncStr 
    }: Props
    ) => {
    
    const [ isOpenPopUp, setIsOpenPopUp ] = useState<boolean>(false)

    const [ variable1, setVariable1 ] = useState<string>('')
    const [ variable2, setVariable2 ] = useState<string>('')
    const [ variable3, setVariable3 ] = useState<string>('')

    useEffect(() => {
        setIsOpenPopUp(isOpen)
        // 팝업 오픈시
        if (isOpen) {
            
        }
    }, [isOpen])

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

    const handleConfirm = () => {
        handleClose(false)
    }

    const handleResetTransFunc = () => {
        // 속성 데이터의 경우 targetItem 만 넘김(filter list도 넘겨주지만 사용여부는 확인 필요)
        targetItem && setTargetList((state: Array<TbRsCustFeatRuleTrgt>) => {
            let rtn = cloneDeep(state)
            rtn[itemIdx].function  = ''
            rtn[itemIdx].variable1  = ''
            rtn[itemIdx].variable2  = ''
            rtn[itemIdx].variable3  = ''
            return rtn
        })

        // 행동 데이터의 경우 trgtFilterItem 만 넘김
        trgtFilterItem && setTrgtFilterList((state: Array<TbRsCustFeatRuleTrgtFilter>) => {
            let rtn = cloneDeep(state)
            rtn[itemIdx].function  = ''
            rtn[itemIdx].variable1  = ''
            rtn[itemIdx].variable2  = ''
            rtn[itemIdx].variable3  = ''
            return rtn
        })
        // 팝업 close
        handleClose(false)
    }

    const onchangeSelectHandler = (
        e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
        value: SelectValue<{}, false>,
        id?: string,
    ) => {
        let keyNm = String(id)
        let v = String(value)

        // funcstr 수정
        if (funcVal === transFuncOtion[0].value) {
            setFuncStr(`${transFuncOtion[0].text}(${colNm}, [${variable1}])`)
        } else if (funcVal === transFuncOtion[1].value) {
            setFuncStr(`${transFuncOtion[0].text}(${colNm}, [${variable1}], [${variable2}])`)
        } else if (funcVal === transFuncOtion[2].value) {
            setFuncStr(`${transFuncOtion[0].text}(${colNm})`)
        } else if (funcVal === transFuncOtion[3].value) {
            setFuncStr(`${transFuncOtion[0].text}(${colNm}, [${variable1}], [${variable2}], [${variable3}])`)
        } else if (funcVal === transFuncOtion[4].value) {
            setFuncStr(`${transFuncOtion[0].text}(${colNm})`)
        }
        
        // 속성 데이터의 경우 targetItem 만 넘김(filter list도 넘겨주지만 사용여부는 확인 필요)
        targetItem && setTargetList((state: Array<TbRsCustFeatRuleTrgt>) => {
            let rtn = cloneDeep(state)
            rtn[itemIdx][keyNm]  = v
            return rtn
        })

        // 행동 데이터의 경우 trgtFilterItem 만 넘김
        trgtFilterItem && setTrgtFilterList((state: Array<TbRsCustFeatRuleTrgtFilter>) => {
            let rtn = cloneDeep(state)
            rtn[itemIdx][keyNm]  = v
            return rtn
        })
    }    

    return (
        <Modal open={isOpenPopUp} onClose={handleClose} size='LG'>
            <Modal.Header>변환식</Modal.Header>
            <Modal.Body>
                <Stack
                    direction="Vertical"
                    gap="MD"
                    justifyContent="Start"
                >
                    <TextField readOnly value={funcStr} ></TextField>
                    <Select
                        appearance="Outline"
                        value={funcVal}
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
                    {funcVal === transFuncOtion[0].text &&
                        <>
                        <Stack>
                            <Typography variant='h6'>대체값</Typography>
                            <TextField value={variable1}></TextField>
                        </Stack>
                        </>
                    }
                    {funcVal === transFuncOtion[1].text &&
                        <>
                        <Stack>
                            <Typography variant='h6'>시작위치</Typography>
                            <TextField value={variable1}></TextField>
                        </Stack>
                        <Stack>
                            <Typography variant='h6'>길이</Typography>
                            <TextField value={variable2}></TextField>
                        </Stack>
                        </>
                    }
                    {funcVal === transFuncOtion[3].text &&
                        <>
                        <Stack>
                            <Typography variant='h6'>컬럼1</Typography>
                            <Select 
                                appearance="Outline"
                                value={var1}
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
                        <Stack>
                            <Typography variant='h6'>컬럼2</Typography>
                            <Select 
                                appearance="Outline"
                                value={var2}
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
                        <Stack>
                            <Typography variant='h6'>컬럼3</Typography>
                            <Select 
                                appearance="Outline"
                                value={var3}
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
                <Button priority="Normal" appearance="Contained" onClick={handleConfirm}>
                닫기
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default TransFunctionPop