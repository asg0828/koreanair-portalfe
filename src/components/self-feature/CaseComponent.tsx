import { useEffect, useState } from 'react';
import { SelectValue } from '@mui/base/useSelect';
import { cloneDeep } from 'lodash'
import { ValidationFormula } from '@/utils/self-feature/FormulaValidUtil';

import { Button, Select, SelectOption, Stack, TextField, Typography, HelperText } from '@/components/ui'

import { 
    FormulaCaseProps, 
    FormulaTrgtListProps, 
    FormulaValidRslt, 
    TbRsCustFeatRuleCase, 
} from '@/models/selfFeature/FeatureModel';
import { 
    initFormulaValidRslt, 
    whenYn, 
} from '@/pages/user/self-feature/data'
import OperatorOperand from './OperatorOperand';
import { ColDataType } from '@/models/selfFeature/FeatureCommon';

const CaseComponent = ({
    isPossibleEdit,
    index,
    lastIdx,
    custFeatRuleCase,
    setCustFeatRuleCaseList,
    setIsValidFormula,
    formulaTrgtList,
}: FormulaCaseProps) => {

    const [ trgtFormulaInput, setTrgtFormulaInput ] = useState<Boolean>(false)
    const [ formulaValidRslt, setFormulaValidRslt ] = useState<FormulaValidRslt>(cloneDeep(initFormulaValidRslt))
    const [ dataType, setDataType ] = useState<string>("")
    const [ slctDateType, setSlctDateType ] = useState<string>("")

    const [ delimiterSelected, setDelimiterSelected ] = useState<Boolean>(false)
    const [ elseSelected, setElseSelected ] = useState<Boolean>(false)

    useEffect(() => {
        if (!custFeatRuleCase) return

        if (custFeatRuleCase.operator === "in_str" || custFeatRuleCase.operator === "not_in_str"
            || custFeatRuleCase.operator === "in_num" || custFeatRuleCase.operator === "not_in_num") {
            setDelimiterSelected(true)
        } else {
            setDelimiterSelected(false)
        }

        // 연산자가 날짜타입인 경우 초기 setting
        if (
            custFeatRuleCase.operator === "before" 
            || custFeatRuleCase.operator === "after" 
            || custFeatRuleCase.operator === "between"
        ) {
            setSlctDateType(custFeatRuleCase.operator)
        }

    }, [custFeatRuleCase?.operator])

    useEffect(() => {
        if (!custFeatRuleCase) return

        if (custFeatRuleCase.whenYn === "N") {
            setElseSelected(true)
        } else {
            setElseSelected(false)
        }
    }, [custFeatRuleCase?.whenYn])

    useEffect(() => {
        // 각 case문의 target 입력 값이 변경될 경우 validation 수행
        if (!custFeatRuleCase) return

        let targetList: string[] = []
        formulaTrgtList.map((v: FormulaTrgtListProps) => {
            targetList.push(v.targetId)
        })

        if (custFeatRuleCase.targetFormula !== "") {
            setTrgtFormulaInput(true)
        } else {
            setTrgtFormulaInput(false)
        }
        setFormulaValidRslt(cloneDeep(ValidationFormula({
            formula: cloneDeep(custFeatRuleCase.targetFormula),
            targetList: cloneDeep(targetList),
            formulaTrgtList: cloneDeep(formulaTrgtList),
        })))
        
        setIsValidFormula && setIsValidFormula(formulaValidRslt.isValidFormula)
        
    }, [custFeatRuleCase?.targetFormula])

    useEffect(() => {
        // 계산식 validation 수행 이후 validation에 대한 변경(성공/실패)이 생길 경우 처리
        if (formulaValidRslt.isValidFormula){
            setTrgtFormulaInput(true)
            // case문 validation을 위한 dataType setting
            if (custFeatRuleCase?.targetFormula === "") {
                setDataType("")
            } else {
                for (let i = 0; i < formulaTrgtList.length; i++) {
                    let formulaTrgt: FormulaTrgtListProps = formulaTrgtList[i]
                    if (formulaTrgt.targetId === custFeatRuleCase?.targetFormula) {
                        setDataType(formulaTrgt.dataType)
                        break
                    } else {
                        setDataType(ColDataType.NUM)
                    }
                }
            }
        } else { 
            setTrgtFormulaInput(false)
        }
    }, [formulaValidRslt.isValidFormula])

    // 대상선택의 값이 변경될 경우 case문의 연산자 선택 select box 값을 바꾸기 위한 useEffect
    useEffect(() => {
        if (formulaTrgtList.length < 1) return

        // case문 validation을 위한 dataType setting
        if (custFeatRuleCase?.targetFormula === "") {
            setDataType("")
        } else {
            for (let i = 0; i < formulaTrgtList.length; i++) {
                let formulaTrgt: FormulaTrgtListProps = formulaTrgtList[i]
                if (formulaTrgt.targetId === custFeatRuleCase?.targetFormula) {
                    setDataType(formulaTrgt.dataType)
                    break
                } else {
                    setDataType(ColDataType.NUM)
                }
            }
        }

        // 대상선택의 타겟 데이터 타입이 변경될 경우
        let targetList: string[] = []
        formulaTrgtList.map((v: FormulaTrgtListProps) => {
            targetList.push(v.targetId)
        })
        setFormulaValidRslt(cloneDeep(ValidationFormula({
            formula: cloneDeep(custFeatRuleCase!.targetFormula),
            targetList: cloneDeep(targetList),
            formulaTrgtList: cloneDeep(formulaTrgtList),
        })))

    }, [formulaTrgtList])

    const onClickDeleteHandler = () => {
        (setCustFeatRuleCaseList && (index || index === 0)) && setCustFeatRuleCaseList((state: Array<TbRsCustFeatRuleCase>) => {
            let rtn = cloneDeep(state)
            rtn.splice(index, 1)
            return rtn
        })
    }

    const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target

        let t = false
        let inputValue = cloneDeep(value)
        
        if (id === "targetFormula" && value !== "") {
            //입력값이 있는 경우
            setTrgtFormulaInput(true)
            inputValue = inputValue.toUpperCase()
            t = false
        } else if (id === "targetFormula" && value === "") {
            //입력값이 없는 경우
            setTrgtFormulaInput(false)
            t = true
        }

        (setCustFeatRuleCaseList && (index || index === 0)) && setCustFeatRuleCaseList((state: Array<TbRsCustFeatRuleCase>) => {
            let rtn = cloneDeep(state)
            rtn[index][id] = inputValue
            if (t) {
                rtn[index]["targetFormula"] = ''
                rtn[index]["operator"] = ''
                rtn[index]["delimiter"] = ''
                rtn[index]["operand1"] = ''
            }
            return rtn
        })

    }

    const onchangeSelectHandler = (
        e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
        value: SelectValue<{}, false>,
        id?: String
    ) => {
        let keyNm = String(id)
        let v = String(value)
        let isClrDlmt = false // select 변경시 delimiter 초기화를 위한 flag
        let isSlctElse = false // else 구문 선택시 결과값 제외 다른 값 초기화를 위한 flag
        if (
            keyNm === "delimiter" 
            || (keyNm === "operator" && (v === "in_str" || v === "not_in_str" || v === "in_num" || v === "not_in_num"))
        ) {
            setDelimiterSelected(true)
            isClrDlmt = true
        } else if (keyNm === "whenYn") {
            isClrDlmt = true
            if (v === "N") {
                isSlctElse = true
                setElseSelected(true)
            } else {
                isSlctElse = false
                setElseSelected(false)
            }
        } else {
            setDelimiterSelected(false)
            isClrDlmt = false
        }

        // 날짜 타입 select box show를 위한 state 설정
        if (keyNm === "operator" && (v === "before" || v === "after" || v === "between")) {
            setSlctDateType(v)
        }
        // 날짜(between)의 경우 날짜/조건식 중 날짜 선택시 operand 초기화
        let isOprdDate1 = false
        let isOprdDate2 = false
        if (keyNm === "operand1" && v === "date") {
            isOprdDate1 = true
        } else {
            isOprdDate1 = false
        }
        if (keyNm === "operand4" && v === "date") {
            isOprdDate2 = true
        } else {
            isOprdDate2 = false
        }

        (setCustFeatRuleCaseList && (index || index === 0)) && setCustFeatRuleCaseList((state: Array<TbRsCustFeatRuleCase>) => {
            let rtn = cloneDeep(state)
            rtn[index][keyNm] = v
            if (!isClrDlmt) {
                //rtn[index]["delimiter"] = ''
            }
            if (isSlctElse) {
                rtn[index]["targetFormula"] = ''
                rtn[index]["operator"] = ''
                rtn[index]["delimiter"] = ''
                rtn[index]["operand1"] = ''
            }
            if (isOprdDate1) {
                rtn[index]["operand2"] = ''
                rtn[index]["operand3"] = ''
            }
            if (isOprdDate2) {
                rtn[index]["operand5"] = ''
                rtn[index]["operand6"] = ''
            }
            return rtn
        })
    }
    /*
    const onblurInputHandler = (e: React.FocusEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        
        setIsValidFormula && setIsValidFormula(formulaValidRslt.isValidFormula)
        
        setFormulaValidRslt(cloneDeep(ValidationFormula({
            formula: cloneDeep(value),
            targetList: cloneDeep(formulaTrgtList),
        })))
        
    }
    */
    
    return (
        <Stack
            direction="Horizontal"
            justifyContent="Start" 
            gap="MD" 
        >
            {index === 0 && 
                <Typography variant='h5'>WHEN</Typography>
            }
            {index !== 0 && 
                <>
                {isPossibleEdit &&
                    <Button 
                        size="SM" 
                        onClick={onClickDeleteHandler}
                    >
                    삭제
                    </Button>
                }
                {(lastIdx === index && isPossibleEdit) &&
                    <Select 
                        value={custFeatRuleCase?.whenYn}
                        appearance="Outline"
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
                            onchangeSelectHandler(e, value, "whenYn")
                        }}
                    >
                        {whenYn.map((item, index) => (
                        <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                        ))}
                    </Select>
                }
                {(lastIdx === index && !isPossibleEdit) &&
                    <Typography variant='h5'>{custFeatRuleCase?.whenYn === 'Y' ? 'WHEN' : 'ELSE'}</Typography>
                }
                {lastIdx !== index &&
                    <Typography variant='h5'>WHEN</Typography>
                }
                </>
            }
            {(!elseSelected && isPossibleEdit) &&
            <Stack
                direction="Vertical"
            >
                <TextField 
                    placeholder="Target/계산식 입력"
                    value={custFeatRuleCase?.targetFormula}
                    id='targetFormula'
                    onChange={onchangeInputHandler} 
                    //onBlur={onblurInputHandler}
                    validation={!formulaValidRslt.isValidFormula ? 'Error' : 'Default'}
                />
                <div className='flex space-between'>
                    <div>
                    {!formulaValidRslt.isValidFormula ? (
                        <HelperText showIcon={false} type='Error'>
                        {formulaValidRslt.text}
                        </HelperText>
                    ) : (
                        ''
                    )}
                    </div>
                </div>
            </Stack>
            }
            {(!elseSelected && !isPossibleEdit) &&
                <Typography variant='h5'>{custFeatRuleCase?.targetFormula}</Typography>
            }
            {!elseSelected &&
                <OperatorOperand
                    isPossibleEdit={isPossibleEdit}
                    trgtFormulaInput={trgtFormulaInput}
                    itemIdx={(index || index === 0) ? index : 0}
                    item={custFeatRuleCase}
                    setCustFeatRuleCaseList={setCustFeatRuleCaseList}
                    dataType={dataType}
                    delimiterSelected={delimiterSelected}
                    slctDateType={slctDateType}
                    onchangeInputHandler={onchangeInputHandler}
                    onchangeSelectHandler={onchangeSelectHandler}
                />
            }
            <>
            {!elseSelected &&
            <Typography variant='h5'>THEN</Typography>
            }
            {isPossibleEdit &&
                <TextField 
                    placeholder="결과 입력"
                    value={custFeatRuleCase?.result}
                    id='result'
                    onChange={onchangeInputHandler} 
                />
            }
            {!isPossibleEdit &&
                <Typography variant='h5'>{custFeatRuleCase?.result}</Typography>
            }
            </>
        </Stack>
    )
}

export default CaseComponent