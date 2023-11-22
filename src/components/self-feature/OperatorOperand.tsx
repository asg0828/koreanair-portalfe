import { useEffect, useState } from 'react'
import { SelectValue } from '@mui/base/useSelect'
import { cloneDeep } from 'lodash'

import { 
    DatePicker,
    Select, 
    SelectOption,
    Stack,
    TextField, 
    Typography, 
} from '@/components/ui'

import { OperatorOperandProps, TbRsCustFeatRuleCase, TbRsCustFeatRuleTrgtFilter } from "@/models/selfFeature/FeatureModel"
import { ColDataType, CommonCode, CommonCodeInfo, initCommonCodeInfo } from '@/models/selfFeature/FeatureCommon'
import { useCommCodes } from '@/hooks/queries/self-feature/useSelfFeatureCmmQueries'

const OperatorOperand = ({
    isPossibleEdit,
    trgtFormulaInput,
    itemIdx,
    item,
    dataType,
    delimiterSelected,
    slctDateType,
    setCustFeatRuleCaseList,
    setTrgtFilterList,
    onchangeInputHandler,
    onchangeSelectHandler,
}: OperatorOperandProps) => {

    const { 
        data: cmmCodeOprtRes, 
        isError: cmmCodeOprtErr, 
        refetch: cmmCodeOprtRefetch 
    } = useCommCodes(CommonCode.OPERATOR)
    const { 
        data: cmmCodeDlimRes, 
        isError: cmmCodeDlimErr, 
        refetch: cmmCodeDlimRefetch 
    } = useCommCodes(CommonCode.SGMT_DELIMITER)
    const { 
        data: cmmCodeFrmtRes, 
        isError: cmmCodeFrmtErr, 
        refetch: cmmCodeFrmtRefetch 
    } = useCommCodes(CommonCode.FORMAT)

    const [ operatorOption, setOperatorOption ] = useState<Array<CommonCodeInfo>>([])
    const [ delimiterOption, setDelimiterOption ] = useState<Array<CommonCodeInfo>>([])
    const [ tsDateFormatOption, setTsDateFormatOption ] = useState<Array<CommonCodeInfo>>([])

    const [ oprd2DpValue, setOprd2DpValue ] = useState<string>("")
    const [ oprd5DpValue, setOprd5DpValue ] = useState<string>("")

    useEffect(() => {
        if (cmmCodeOprtRes) {
            setOperatorOption((prevState: Array<CommonCodeInfo>) => {
                let rtn = cloneDeep(prevState)
                rtn = cmmCodeOprtRes.result.filter((v: CommonCodeInfo) => (dataType !== "" && v.attr1.includes(dataType)))
                return [...cloneDeep([initCommonCodeInfo]), ...rtn]
            })
        }
        if (delimiterSelected) {
            if (cmmCodeDlimRes) {
                setDelimiterOption((prevState: Array<CommonCodeInfo>) => {
                    let rtn = cloneDeep(prevState)
                    rtn = cmmCodeDlimRes.result.filter((v: CommonCodeInfo) => {
                        if (dataType !== "") {
                            if ((dataType === ColDataType.NUM) && v.cdv === ",") return true
                            else if (dataType !== ColDataType.NUM) return true
                            else return false
                        }
                    })
                    return [...cloneDeep([initCommonCodeInfo]), ...rtn]
                })
            }
        }
    }, [dataType, delimiterSelected])

    useEffect(() => {
        if (cmmCodeFrmtRes) {
            setTsDateFormatOption((prevState: Array<CommonCodeInfo>) => {
                let rtn = cloneDeep(prevState)
                rtn = cmmCodeFrmtRes.result.filter((v: CommonCodeInfo) => (v.attr1.includes("Y")))
                return [...cloneDeep([initCommonCodeInfo]), ...rtn]
            })
        }
    }, [cmmCodeFrmtRes])

    useEffect(() => {
        if (!item) return
        setOprd2DpValue(item.operand2)
    }, [item?.operand2])

    useEffect(() => {
        if (!item) return
        setOprd5DpValue(item.operand5)
    }, [item?.operand5])

    const onChangeDatePickerHandler = (targetKey: string, date: string) => {
        setTrgtFilterList && setTrgtFilterList((state: Array<TbRsCustFeatRuleTrgtFilter>) => {
            let tl = cloneDeep(state)
            let updtTrgtFilterList = tl.filter((trgtFilter: TbRsCustFeatRuleTrgtFilter) => trgtFilter.targetId === item?.targetId)
            updtTrgtFilterList[itemIdx][targetKey] = date
            tl = tl.filter((trgtFilter: TbRsCustFeatRuleTrgtFilter) => trgtFilter.targetId !== item?.targetId)
            tl = [...tl, ...updtTrgtFilterList]
            return tl
        })
        setCustFeatRuleCaseList && setCustFeatRuleCaseList((state: Array<TbRsCustFeatRuleCase>) => {
            let rtn = cloneDeep(state)
            rtn[itemIdx][targetKey] = date
            return rtn
        })
    }

    return (
        <>
        {(isPossibleEdit) &&
        <Select 
            value={item?.operator}
            shape="Square"
            size="MD"
            status="default"
            style={{
            width: '11.25rem'
            }}
            appearance="Outline" 
            placeholder="연산자 선택" 
            onChange={(
                e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                value: SelectValue<{}, false>
            ) => {
                onchangeSelectHandler(e, value, "operator")
            }}
        >
            {operatorOption.map((item, index) => (
                <SelectOption key={index} value={item.cdv}>{item.cdvNm}</SelectOption>
            ))}
            {operatorOption.length < 1 &&
                <SelectOption value="">연산자 선택</SelectOption>
            }
        </Select>
        }
        {(!isPossibleEdit) &&
            <Typography variant='h5'>{item?.operator}</Typography>
        }
        {(delimiterSelected && isPossibleEdit) &&
        <Select 
            appearance="Outline"
            value={item?.delimiter}
            shape="Square"
            size="MD"
            status="default"
            style={{
            width: '11.25rem'
            }}
            onChange={(
                e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                value: SelectValue<{}, false>
            ) => {
                // 구분자 선택
                onchangeSelectHandler(e, value, "delimiter")
            }}
        >
        {delimiterOption.map((item, index) => (
            <SelectOption key={index} value={item.cdv}>{item.cdvNm}</SelectOption>
        ))}
        {delimiterOption.length < 1 &&
            <SelectOption value="">구분자 선택</SelectOption>
        }
        </Select>
        }
        {(delimiterSelected && !isPossibleEdit) &&
            <Typography variant='h5'>{item?.delimiter}</Typography>
        }
        {(isPossibleEdit && dataType === ColDataType.NUM) &&
        <TextField 
            type='number'
            placeholder="피연산자 입력"
            value={item?.operand1}
            id='operand1'
            onChange={onchangeInputHandler} 
        />
        }
        {(isPossibleEdit && dataType === ColDataType.STR) &&
        <TextField 
            placeholder="피연산자 입력"
            value={item?.operand1}
            id='operand1'
            onChange={onchangeInputHandler} 
        />
        }
        {(
            isPossibleEdit 
            && dataType === ColDataType.TIME 
            && (slctDateType === "before" || slctDateType === "after")
        ) &&
        <>
        <Select 
            appearance="Outline"
            value={item?.operand1}
            shape="Square"
            size="MD"
            status="default"
            style={{
            width: '11.25rem'
            }}
            onChange={(
                e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                value: SelectValue<{}, false>
            ) => {
                // 구분자 선택
                onchangeSelectHandler(e, value, "operand1")
            }}
        >
            <SelectOption value="date">날짜</SelectOption>
            <SelectOption value="now">조건식</SelectOption>
        </Select>
        {item?.operand1 === "date" &&
        <DatePicker
            value={oprd2DpValue}
            appearance="Outline"
            calendarViewMode="days"
            mode="single"
            shape="Square"
            size="MD"
            onChange={(e) => {e.target.value = ""}}
            onValueChange={(nextVal) => {
                //operand2
                setOprd2DpValue(nextVal)
                onChangeDatePickerHandler("operand2", nextVal)
                /*
                setSearch((prevState: SearchProps) => {
                    let rtn = cloneDeep(prevState)
                    rtn.requestDateFrom = `${nextVal}T19:20:30+01:00`
                    return rtn
                });
                */
            }}
        />
        }
        {item?.operand1 === "now" &&
        <>
        <TextField 
            readOnly
            value="now"
        />
        <TextField 
            type='number'
            placeholder='피연산자 입력'
            value={item?.operand2}
            id="operand2"
            onChange={onchangeInputHandler} 
        />
        <Select 
            placeholder='기간 단위'
            appearance="Outline"
            value={item?.operand3}
            shape="Square"
            size="MD"
            status="default"
            style={{
            width: '11.25rem'
            }}
            onChange={(
                e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                value: SelectValue<{}, false>
            ) => {
                // 기간 단위
                onchangeSelectHandler(e, value, "operand3")
            }}
        >
        {tsDateFormatOption.map((item, index) => (
            <SelectOption key={index} value={item.cdv}>{item.cdvNm}</SelectOption>
        ))}
        {tsDateFormatOption.length < 1 &&
            <SelectOption value="">선택</SelectOption>
        }
        </Select>
        </>
        }
        </>
        }
        {(
            isPossibleEdit 
            && dataType === ColDataType.TIME 
            && (slctDateType === "between")
        ) &&
        <Stack
            direction="Vertical"
            justifyContent="Start" 
            gap="SM" 
            className="width-100"
        >
            <Stack
                direction="Horizontal"
                justifyContent="Start" 
                gap="SM" 
                className="width-100"
            >
                <Typography variant='h5'>From</Typography>
                <Select 
                    appearance="Outline"
                    value={item?.operand1}
                    shape="Square"
                    size="MD"
                    status="default"
                    style={{
                    width: '11.25rem'
                    }}
                    onChange={(
                        e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                        value: SelectValue<{}, false>
                    ) => {
                        // 구분자 선택
                        onchangeSelectHandler(e, value, "operand1")
                    }}
                >
                    <SelectOption value="date">날짜</SelectOption>
                    <SelectOption value="now">조건식</SelectOption>
                </Select>
                {item?.operand1 === "date" &&
                <DatePicker
                    value={oprd2DpValue}
                    appearance="Outline"
                    calendarViewMode="days"
                    mode="single"
                    shape="Square"
                    size="MD"
                    onChange={(e) => {e.target.value = ""}}
                    onValueChange={(nextVal) => {
                        //operand2
                        setOprd2DpValue(nextVal)
                        onChangeDatePickerHandler("operand2", nextVal)
                        /*
                        setRequestDateFrom(nextVal)
                        setSearch((prevState: SearchProps) => {
                            let rtn = cloneDeep(prevState)
                            rtn.requestDateFrom = `${nextVal}T19:20:30+01:00`
                            return rtn
                        });
                        */
                    }}
                />
                }
                {item?.operand1 === "now" &&
                <>
                <TextField 
                    readOnly
                    value="now"
                />
                <TextField 
                    type='number'
                    placeholder='피연산자 입력'
                    value={item?.operand2}
                    id="operand2"
                    onChange={onchangeInputHandler} 
                />
                <Select 
                    placeholder='기간 단위'
                    appearance="Outline"
                    value={item?.operand3}
                    shape="Square"
                    size="MD"
                    status="default"
                    style={{
                    width: '11.25rem'
                    }}
                    onChange={(
                        e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                        value: SelectValue<{}, false>
                    ) => {
                        // 기간 단위
                        onchangeSelectHandler(e, value, "operand3")
                    }}
                >
                {tsDateFormatOption.map((item, index) => (
                    <SelectOption key={index} value={item.cdv}>{item.cdvNm}</SelectOption>
                ))}
                {tsDateFormatOption.length < 1 &&
                    <SelectOption value="">선택</SelectOption>
                }
                </Select>
                </>
                }
            </Stack>
            <Stack
                direction="Horizontal"
                justifyContent="Start" 
                gap="SM" 
                className="width-100"
            >
                <Typography variant='h5'>To</Typography>
                <Select 
                    appearance="Outline"
                    value={item?.operand4}
                    shape="Square"
                    size="MD"
                    status="default"
                    style={{
                    width: '11.25rem'
                    }}
                    onChange={(
                        e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                        value: SelectValue<{}, false>
                    ) => {
                        // 구분자 선택
                        onchangeSelectHandler(e, value, "operand4")
                    }}
                >
                    <SelectOption value="date">날짜</SelectOption>
                    <SelectOption value="now">조건식</SelectOption>
                </Select>
                {item?.operand4 === "date" &&
                <DatePicker
                    value={oprd5DpValue}
                    appearance="Outline"
                    calendarViewMode="days"
                    mode="single"
                    shape="Square"
                    size="MD"
                    onChange={(e) => {e.target.value = ""}}
                    onValueChange={(nextVal) => {
                        //operand5
                        setOprd5DpValue(nextVal)
                        onChangeDatePickerHandler("operand5", nextVal)
                        /*
                        setRequestDateFrom(nextVal)
                        setSearch((prevState: SearchProps) => {
                            let rtn = cloneDeep(prevState)
                            rtn.requestDateFrom = `${nextVal}T19:20:30+01:00`
                            return rtn
                        });
                        */
                    }}
                />
                }
                {item?.operand4 === "now" &&
                <>
                <TextField 
                    readOnly
                    value="now"
                />
                <TextField 
                    type='number'
                    placeholder='피연산자 입력'
                    value={item?.operand5}
                    id="operand5"
                    onChange={onchangeInputHandler} 
                />
                <Select 
                    placeholder='기간 단위'
                    appearance="Outline"
                    value={item?.operand6}
                    shape="Square"
                    size="MD"
                    status="default"
                    style={{
                    width: '11.25rem'
                    }}
                    onChange={(
                        e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                        value: SelectValue<{}, false>
                    ) => {
                        // 기간 단위
                        onchangeSelectHandler(e, value, "operand6")
                    }}
                >
                {tsDateFormatOption.map((item, index) => (
                    <SelectOption key={index} value={item.cdv}>{item.cdvNm}</SelectOption>
                ))}
                {tsDateFormatOption.length < 1 &&
                    <SelectOption value="">선택</SelectOption>
                }
                </Select>
                </>
                }
            </Stack>
        </Stack>
        }
        {!isPossibleEdit &&
            <Typography variant='h5'>{item?.operand1}</Typography>
        }
        </>
    )

}

export default OperatorOperand