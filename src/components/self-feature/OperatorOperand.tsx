import { useEffect, useState } from 'react'
import { SelectValue } from '@mui/base/useSelect'
import { cloneDeep, isEmpty } from 'lodash'

import {
    //DatePicker,
    Select,
    SelectOption,
    Stack,
    TextField,
    Typography,
} from '@/components/ui'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { OperatorOperandProps, TbRsCustFeatRuleCase, TbRsCustFeatRuleTrgtFilter } from "@/models/selfFeature/FeatureModel"
import { ColDataType, CommonCode, CommonCodeInfo, initCommonCodeInfo } from '@/models/selfFeature/FeatureCommon'
import { useCommCodes } from '@/hooks/queries/self-feature/useSelfFeatureCmmQueries'
import dayjs from 'dayjs'

const OperatorOperand = ({
    isPossibleEdit,
    //trgtFormulaInput,
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

    const { data: cmmCodeOprtRes, } = useCommCodes(CommonCode.OPERATOR)
    const { data: cmmCodeDlimRes, } = useCommCodes(CommonCode.SGMT_DELIMITER)
    const { data: cmmCodeFrmtRes, } = useCommCodes(CommonCode.FORMAT)

    const [operatorOption, setOperatorOption] = useState<Array<CommonCodeInfo>>([])
    const [delimiterOption, setDelimiterOption] = useState<Array<CommonCodeInfo>>([])
    const [tsDateFormatOption, setTsDateFormatOption] = useState<Array<CommonCodeInfo>>([])

    const [oprd2DpValue, setOprd2DpValue] = useState<string>("")
    const [oprd5DpValue, setOprd5DpValue] = useState<string>("")

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
    // 수정시 delimiter 값이 있는 경우 option setting
    useEffect(() => {
        if (isEmpty(item?.delimiter) || item?.delimiter === "null") return

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
    }, [item?.delimiter])

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
        console.log(slctDateType)
        console.log(item)
    }, [item])

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
            <Stack
                style={{
                    flex: "0 1 20%",
                    maxWidth: "20%",
                }}
            >
                {(isPossibleEdit) &&
                    <Select
                        value={item?.operator}
                        shape="Square"
                        size="SM"
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
            </Stack>
            <Stack
                gap="LG"
                style={{
                    flex: "0 1 70%",
                    maxWidth: "70%",
                    display: "inline-flex",
                }}
            >
                {(delimiterSelected && isPossibleEdit) &&
                <Stack
                    style={{
                        flex: "0 1 30%",
                        maxWidth: "30%",
                    }}
                >
                    <Select
                        appearance="Outline"
                        value={item?.delimiter}
                        placeholder='구분자 선택'
                        shape="Square"
                        size="SM"
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
                </Stack>
                }
                {(delimiterSelected && !isPossibleEdit) &&
                    <Typography variant='h5'>{item?.delimiter}</Typography>
                }
                {(isPossibleEdit && dataType === ColDataType.NUM) &&
                <Stack
                    style={{
                        flex: "0 1 30%",
                        maxWidth: "30%",
                    }}
                >
                    <TextField
                        size="SM"
                        type='number'
                        placeholder="피연산자 입력"
                        value={item?.operand1}
                        id='operand1'
                        onChange={onchangeInputHandler}
                    />
                </Stack>
                }
                {(isPossibleEdit && dataType === ColDataType.STR) &&
                <Stack
                    style={{
                        flex: "0 1 30%",
                        maxWidth: "30%",
                    }}
                >
                    <TextField
                        size="SM"
                        placeholder="피연산자 입력"
                        value={item?.operand1}
                        id='operand1'
                        onChange={onchangeInputHandler}
                    />
                </Stack>
                }
                {(
                    isPossibleEdit
                    && dataType === ColDataType.TIME
                    && (slctDateType === "before" || slctDateType === "after")
                ) &&
                    <>
                        <Stack
                            style={{
                                flex: "0 1 30%",
                                maxWidth: "30%",
                            }}
                        >
                            <Select
                                appearance="Outline"
                                value={item?.operand1}
                                shape="Square"
                                size="SM"
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
                        </Stack>
                        {item?.operand1 === "date" &&
                        <Stack
                            style={{
                                flex: "0 1 25%",
                                maxWidth: "25%",
                            }}
                        >
                            <DatePicker
                                // value={oprd2DpValue}
                                // appearance="Outline"
                                // calendarViewMode="days"
                                // mode="single"
                                // shape="Square"
                                // size="SM"
                                // onChange={(e) => { e.target.value = "" }}
                                // onValueChange={(nextVal) => {
                                //     //operand2
                                //     setOprd2DpValue(nextVal)
                                //     onChangeDatePickerHandler("operand2", nextVal)
                                //     /*
                                //     setSearch((prevState: SearchProps) => {
                                //         let rtn = cloneDeep(prevState)
                                //         rtn.requestDateFrom = `${nextVal}T19:20:30+01:00`
                                //         return rtn
                                //     });
                                //     */
                                // }}
                                value={oprd2DpValue}
                                onChange={(date) => {
                                    let d = dayjs(date).format("YYYY-MM-DD").toString()
                                    setOprd2DpValue(d)
                                    onChangeDatePickerHandler("operand2", d)
                                }}
                            />
                        </Stack>
                        }
                        {item?.operand1 === "now" &&
                        <Stack
                            gap="MD"
                            style={{
                                flex: "0 1 75%",
                                maxWidth: "75%",
                            }}
                        >
                            <TextField
                                size="SM"
                                readOnly
                                value="now"
                            />
                            <TextField
                                size="SM"
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
                                size="SM"
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
                        </Stack>
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
                        style={{
                            display: "inline-flex"
                        }}
                    >
                        <Stack
                            direction="Horizontal"
                            justifyContent="Start"
                            gap="SM"
                        >
                            <Typography style={{minWidth: "8%"}} variant='h5'>From</Typography>
                            <Stack
                                style={{
                                    flex: "0 1 30%",
                                    maxWidth: "30%",
                                }}
                            >
                                <Select
                                    appearance="Outline"
                                    value={item?.operand1}
                                    shape="Square"
                                    size="SM"
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
                            </Stack>
                            {item?.operand1 === "date" &&
                            <Stack
                                style={{
                                    flex: "0 1 40%",
                                    maxWidth: "40%",
                                }}
                            >   
                                <DatePicker
                                    // value={oprd2DpValue}
                                    // appearance="Outline"
                                    // calendarViewMode="days"
                                    // mode="single"
                                    // shape="Square"
                                    // size="SM"
                                    // onChange={(e) => { e.target.value = "" }}
                                    // onValueChange={(nextVal) => {
                                    //     //operand2
                                    //     setOprd2DpValue(nextVal)
                                    //     onChangeDatePickerHandler("operand2", nextVal)
                                    //     /*
                                    //     setRequestDateFrom(nextVal)
                                    //     setSearch((prevState: SearchProps) => {
                                    //         let rtn = cloneDeep(prevState)
                                    //         rtn.requestDateFrom = `${nextVal}T19:20:30+01:00`
                                    //         return rtn
                                    //     });
                                    //     */
                                    // }}
                                    value={oprd2DpValue}
                                    onChange={(date) => {
                                        let d = dayjs(date).format("YYYY-MM-DD").toString()
                                        setOprd2DpValue(d)
                                        onChangeDatePickerHandler("operand2", d)
                                    }}
                                />
                            </Stack>
                            }
                            {item?.operand1 === "now" &&
                            <Stack
                                gap="MD"
                                style={{
                                    flex: "0 1 80%",
                                    maxWidth: "80%",
                                    display: "inline-flex"
                                }}
                            >
                                    <TextField
                                        size="SM"
                                        readOnly
                                        value="now"
                                    />
                                    <TextField
                                        className='width-100'
                                        size="SM"
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
                                        size="SM"
                                        status="default"
                                        className='width-100'
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
                                </Stack>
                            }
                        </Stack>
                        <Stack
                            direction="Horizontal"
                            justifyContent="Start"
                            gap="SM"
                            className="width-100"
                        >
                            <Typography style={{minWidth: "8%"}} variant='h5'>To</Typography>
                            <Stack
                                style={{
                                    flex: "0 1 30%",
                                    maxWidth: "30%",
                                }}
                            >
                                <Select
                                    appearance="Outline"
                                    value={item?.operand4}
                                    shape="Square"
                                    size="SM"
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
                            </Stack>
                            {item?.operand4 === "date" &&
                            <Stack
                                style={{
                                    flex: "0 1 40%",
                                    maxWidth: "40%",
                                }}
                            >
                                <DatePicker
                                    // value={oprd5DpValue}
                                    // appearance="Outline"
                                    // calendarViewMode="days"
                                    // mode="single"
                                    // shape="Square"
                                    // size="SM"
                                    // onChange={(e) => { e.target.value = "" }}
                                    // onValueChange={(nextVal) => {
                                    //     //operand5
                                    //     setOprd5DpValue(nextVal)
                                    //     onChangeDatePickerHandler("operand5", nextVal)
                                    //     /*
                                    //     setRequestDateFrom(nextVal)
                                    //     setSearch((prevState: SearchProps) => {
                                    //         let rtn = cloneDeep(prevState)
                                    //         rtn.requestDateFrom = `${nextVal}T19:20:30+01:00`
                                    //         return rtn
                                    //     });
                                    //     */
                                    // }}
                                    value={oprd5DpValue}
                                    onChange={(date) => {
                                        let d = dayjs(date).format("YYYY-MM-DD").toString()
                                        setOprd5DpValue(d)
                                        onChangeDatePickerHandler("operand5", d)
                                    }}
                                />
                            </Stack>
                            }
                            {item?.operand4 === "now" &&
                            <Stack
                                gap="MD"
                                style={{
                                    flex: "0 1 80%",
                                    maxWidth: "80%",
                                    display: "inline-flex"
                                }}
                            >
                                <TextField
                                    size="SM"
                                    readOnly
                                    value="now"
                                />
                                <TextField
                                    className='width-100'
                                    size="SM"
                                    type='number'
                                    placeholder='피연산자 입력'
                                    value={item?.operand5}
                                    id="operand5"
                                    onChange={onchangeInputHandler}
                                />
                                <Select
                                    className='width-100'
                                    placeholder='기간 단위'
                                    appearance="Outline"
                                    value={item?.operand6}
                                    shape="Square"
                                    size="SM"
                                    status="default"
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
                            </Stack>
                            }
                        </Stack>
                    </Stack>
                }
                {!isPossibleEdit &&
                    <Typography variant='h5'>{item?.operand1}</Typography>
                }
            </Stack>
        </>
    )

}

export default OperatorOperand