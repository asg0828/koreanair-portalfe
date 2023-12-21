import { useEffect, useState } from 'react'
import { SelectValue } from '@mui/base/useSelect'
import { cloneDeep, isEmpty } from 'lodash'

import {
    DatePicker,
    Select,
    SelectOption,
    Stack,
    TextField,
    Typography,
} from '@/components/ui'
//import DatePicker from 'react-datepicker'
//import 'react-datepicker/dist/react-datepicker.css'

import { OperatorOperandProps, TbRsCustFeatRuleCase, TbRsCustFeatRuleTrgtFilter } from "@/models/selfFeature/FeatureModel"
import { ColDataType, CommonCode, CommonCodeInfo, initCommonCodeInfo } from '@/models/selfFeature/FeatureCommon'
import { useCommCodes } from '@/hooks/queries/self-feature/useSelfFeatureCmmQueries'
import dayjs from 'dayjs'
import { getDateFormat } from '@/utils/DateUtil'

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

    // 최초 등록/수정 판단 flag
    let isUpdtInfo: Boolean = false

    useEffect(() => {
        if (item?.id) isUpdtInfo = true
        else isUpdtInfo = false
    }, [])

    useEffect(() => {
        if (isUpdtInfo) return

        setTrgtFilterList && setTrgtFilterList((state: Array<TbRsCustFeatRuleTrgtFilter>) => {
            let tl = cloneDeep(state)
            let updtTrgtFilterList = tl.filter((trgtFilter: TbRsCustFeatRuleTrgtFilter) => trgtFilter.targetId === item?.targetId)
            updtTrgtFilterList[itemIdx]["operator"] = ""
            updtTrgtFilterList[itemIdx]["operand1"] = ""
            updtTrgtFilterList[itemIdx]["operand2"] = ""
            updtTrgtFilterList[itemIdx]["operand3"] = ""
            updtTrgtFilterList[itemIdx]["operand4"] = ""
            updtTrgtFilterList[itemIdx]["operand5"] = ""
            updtTrgtFilterList[itemIdx]["operand6"] = ""
            tl = tl.filter((trgtFilter: TbRsCustFeatRuleTrgtFilter) => trgtFilter.targetId !== item?.targetId)
            tl = [...tl, ...updtTrgtFilterList]
            return tl
        })
    }, [item?.function])

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
    let dynStyle = {}
    if (isPossibleEdit) {
        dynStyle = {
            flex: "0 1 23%",
            maxWidth: "23%",
        }
    }

    return (
        <>
            <Stack
                style={dynStyle}
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
                        onChange={(e, value) => value && onchangeSelectHandler(e, value, "operator")}
                    >
                        {operatorOption.map((item, index) => (
                            <SelectOption style={{ fontSize: "smaller" }} key={index} value={item.cdv}>{item.cdvNm}</SelectOption>
                        ))}
                        {operatorOption.length < 1 &&
                            <SelectOption style={{ fontSize: "smaller" }} value="">연산자 선택</SelectOption>
                        }
                    </Select>
                }
                {(!isPossibleEdit) &&
                    <Typography variant='body1'>
                        {operatorOption.find((option) => option.cdv === item?.operator)?.cdvNm}
                    </Typography>
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
                            onChange={(e, value) => value && onchangeSelectHandler(e, value, "delimiter")}
                        >
                            {delimiterOption.map((item, index) => (
                                <SelectOption style={{ fontSize: "smaller" }} key={index} value={item.cdv}>{item.cdvNm}</SelectOption>
                            ))}
                            {delimiterOption.length < 1 &&
                                <SelectOption style={{ fontSize: "smaller" }} value="">구분자 선택</SelectOption>
                            }
                        </Select>
                    </Stack>
                }
                {/* {(delimiterSelected && !isPossibleEdit) &&
                    <Typography variant='body1'>{item?.delimiter}</Typography>
                } */}
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
                {(!isPossibleEdit && (dataType === ColDataType.STR || dataType === ColDataType.NUM)) &&
                    <Typography variant='body1'>{item?.operand1}</Typography>
                    // <Stack
                    //     style={{
                    //         flex: "0 1 30%",
                    //         maxWidth: "30%",
                    //     }}
                    // >
                    // </Stack>
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
                                onChange={(e, value) => value && onchangeSelectHandler(e, value, "operand1")}
                            >
                                <SelectOption style={{ fontSize: "smaller" }} value="date">날짜</SelectOption>
                                <SelectOption style={{ fontSize: "smaller" }} value="now">조건식</SelectOption>
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
                                    value={oprd2DpValue}
                                    appearance="Outline"
                                    calendarViewMode="days"
                                    mode="single"
                                    shape="Square"
                                    size="SM"
                                    popupOptionWhenPopup='fixed'
                                    onThisDayClick={[
                                        () => {
                                            let today = getDateFormat(new Date().toString(), "YYYY-MM-DD")
                                            setOprd2DpValue(today)
                                            onChangeDatePickerHandler("operand2", today)
                                        },
                                        true
                                    ]}
                                    onChange={(e) => { e.target.value = "" }}
                                    onValueChange={(nextVal) => {
                                        setOprd2DpValue(nextVal)
                                        onChangeDatePickerHandler("operand2", nextVal)
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
                                    onChange={(e, value) => value && onchangeSelectHandler(e, value, "operand3")}
                                >
                                    {tsDateFormatOption.map((item, index) => (
                                        <SelectOption style={{ fontSize: "smaller" }} key={index} value={item.cdv}>{item.cdvNm}</SelectOption>
                                    ))}
                                    {tsDateFormatOption.length < 1 &&
                                        <SelectOption style={{ fontSize: "smaller" }} value="">선택</SelectOption>
                                    }
                                </Select>
                            </Stack>
                        }
                    </>
                }
                {(
                    !isPossibleEdit
                    && dataType === ColDataType.TIME
                    && (slctDateType === "before" || slctDateType === "after")
                ) &&
                    <>
                        {item?.operand1 === "now" &&
                            <Typography variant='body1'>now</Typography>
                        }
                        {item?.operand1 === "date" &&
                            <Stack
                                style={{
                                    flex: "0 1 40%",
                                    maxWidth: "40%",
                                }}
                            >
                                <Typography variant='body1'>{item?.operand2}</Typography>
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
                                <Typography variant='body1'>{item?.operand2}</Typography>
                                <Typography variant='body1'>
                                    {tsDateFormatOption.find((option) => item?.operand3 === option.cdv)?.cdvNm}
                                </Typography>
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
                            <Typography style={{ minWidth: "8%", fontSize: "0.75rem" }} variant='h5'>From</Typography>
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
                                    onChange={(e, value) => value && onchangeSelectHandler(e, value, "operand1")}
                                >
                                    <SelectOption style={{ fontSize: "smaller" }} value="date">날짜</SelectOption>
                                    <SelectOption style={{ fontSize: "smaller" }} value="now">조건식</SelectOption>
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
                                        value={oprd2DpValue}
                                        appearance="Outline"
                                        calendarViewMode="days"
                                        mode="single"
                                        shape="Square"
                                        size="SM"
                                        popupOptionWhenPopup='fixed'
                                        onThisDayClick={[
                                            () => {
                                                let today = getDateFormat(new Date().toString(), "YYYY-MM-DD")
                                                setOprd2DpValue(today)
                                                onChangeDatePickerHandler("operand2", today)
                                            },
                                            true
                                        ]}
                                        onChange={(e) => { e.target.value = "" }}
                                        onValueChange={(nextVal) => {
                                            setOprd2DpValue(nextVal)
                                            onChangeDatePickerHandler("operand2", nextVal)
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
                                        onChange={(e, value) => value && onchangeSelectHandler(e, value, "operand3")}
                                    >
                                        {tsDateFormatOption.map((item, index) => (
                                            <SelectOption style={{ fontSize: "smaller" }} key={index} value={item.cdv}>{item.cdvNm}</SelectOption>
                                        ))}
                                        {tsDateFormatOption.length < 1 &&
                                            <SelectOption style={{ fontSize: "smaller" }} value="">선택</SelectOption>
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
                            <Typography style={{ minWidth: "8%", fontSize: "0.75rem" }} variant='h5'>To</Typography>
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
                                    onChange={(e, value) => value && onchangeSelectHandler(e, value, "operand4")}
                                >
                                    <SelectOption style={{ fontSize: "smaller" }} value="date">날짜</SelectOption>
                                    <SelectOption style={{ fontSize: "smaller" }} value="now">조건식</SelectOption>
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
                                        value={oprd5DpValue}
                                        appearance="Outline"
                                        calendarViewMode="days"
                                        mode="single"
                                        shape="Square"
                                        size="SM"
                                        popupOptionWhenPopup='fixed'
                                        onThisDayClick={[
                                            () => {
                                                let today = getDateFormat(new Date().toString(), "YYYY-MM-DD")
                                                setOprd5DpValue(today)
                                                onChangeDatePickerHandler("operand5", today)
                                            },
                                            true
                                        ]}
                                        onChange={(e) => { e.target.value = "" }}
                                        onValueChange={(nextVal) => {
                                            setOprd5DpValue(nextVal)
                                            onChangeDatePickerHandler("operand5", nextVal)
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
                                        onChange={(e, value) => value && onchangeSelectHandler(e, value, "operand6")}
                                    >
                                        {tsDateFormatOption.map((item, index) => (
                                            <SelectOption style={{ fontSize: "smaller" }} key={index} value={item.cdv}>{item.cdvNm}</SelectOption>
                                        ))}
                                        {tsDateFormatOption.length < 1 &&
                                            <SelectOption style={{ fontSize: "smaller" }} value="">선택</SelectOption>
                                        }
                                    </Select>
                                </Stack>
                            }
                        </Stack>
                    </Stack>
                }
                {(
                    !isPossibleEdit
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
                            <Stack
                                style={{
                                    flex: "0 1 7%",
                                    maxWidth: "7%",
                                }}
                            >
                                <Typography variant='body1'>From</Typography>
                            </Stack>
                            {item?.operand1 === "date" &&
                                <Typography variant='body1'>{item?.operand2}</Typography>
                            }
                            {item?.operand1 === "now" &&
                                <Stack
                                    gap="MD"
                                >
                                    <Typography variant='body1'>now</Typography>
                                    <Typography variant='body1'>{item?.operand2}</Typography>
                                    <Typography variant='body1'>
                                        {tsDateFormatOption.find((option) => item?.operand3 === option.cdv)?.cdvNm}
                                    </Typography>
                                </Stack>
                            }
                        </Stack>
                        <Stack
                            direction="Horizontal"
                            justifyContent="Start"
                            gap="SM"
                            className="width-100"
                        >
                            <Stack
                                style={{
                                    flex: "0 1 7%",
                                    maxWidth: "7%",
                                }}
                            >
                                <Typography variant='body1'>To</Typography>
                            </Stack>
                            {item?.operand4 === "date" &&
                                <Typography variant='body1'>{item?.operand5}</Typography>
                            }
                            {item?.operand4 === "now" &&
                                <Stack
                                    gap="MD"
                                >
                                    <Typography variant='body1'>now</Typography>
                                    <Typography variant='body1'>{item?.operand5}</Typography>
                                    <Typography variant='body1'>
                                        {tsDateFormatOption.find((option) => item?.operand6 === option.cdv)?.cdvNm}
                                    </Typography>
                                </Stack>
                            }
                        </Stack>
                    </Stack>
                }
            </Stack>
        </>
    )

}

export default OperatorOperand