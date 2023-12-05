import {Button, Checkbox, Stack, Typography} from '@components/ui'
import { useEffect, useState } from 'react'
import { cloneDeep } from 'lodash'

import CaseComponent from './CaseComponent';
import FormulaComponent from './FormulaComponent';

import { 
    FeatCalcValidProps,
    TbRsCustFeatRuleCalc,
    TbRsCustFeatRuleCase, 
} from '@/models/selfFeature/FeatureModel'
import { 
    initTbRsCustFeatRuleCase, 
} from '@/pages/user/self-feature/data';
import {
    SelfFeatPgPpNm, 
} from '@/models/selfFeature/FeatureCommon';

const ClacValid = ({
    featStatus,
    isSelectAggregateTop,
    setIsValidFormula,
    formulaTrgtList,
    custFeatRuleCalc,
    custFeatRuleCaseList,
    setCustFeatRuleCalc,
    setCustFeatRuleCaseList,
}: FeatCalcValidProps) => {

    const [ isPossibleEdit, setIsPossibleEdit ] = useState<Boolean>(false)
    const [ formulaCaseChecked, setFormulaCaseChecked ] = useState(false)
    const [ elseSelected, setElseSelected ] = useState<Boolean>(false)

    // 수정가능 여부 판단
    useEffect(() => {
        // 등록, 품의저장인 상태이면서 상세페이지가 아닌 경우 수정가능
        if (
            // (featStatus === SubFeatStatus.REG 
            // || featStatus === SubFeatStatus.SUBREG )
            // && 
            featStatus !== SelfFeatPgPpNm.DETL
        ) {
            setIsPossibleEdit(true)
        } else {
            setIsPossibleEdit(false)
        }

    }, [featStatus])

    // 수정시 case문 list 값에 따른 else 체크
    useEffect(() => {
        if (custFeatRuleCaseList.length < 1) return

        if (custFeatRuleCaseList.length > 1)
            setFormulaCaseChecked(true)

        for (let i = 0; i < custFeatRuleCaseList.length; i++) {
            if (custFeatRuleCaseList[i].whenYn === "N") {
                setElseSelected(true)
                break
            } else {
                setElseSelected(false)
            }
        }
    }, [custFeatRuleCaseList])

    // case문 사용 체크시
    /*
    const onCheckedCaseChange = () => {
        setFormulaCaseChecked(!formulaCaseChecked)

        if (!formulaCaseChecked) {
            //console.log("checked")
            setCustFeatRuleCalc((state: TbRsCustFeatRuleCalc) => {
                let rtn = cloneDeep(state)
                rtn.formula = ""
                return rtn
            })
        } else {
            // case문 사용 체크 해제시 입력값 초기화
            setCustFeatRuleCaseList((state: Array<TbRsCustFeatRuleCase>) => {
                let rtn = [cloneDeep(initTbRsCustFeatRuleCase)]
                return rtn
            })

        }
    }
    */
    // case문 구문 추가시
    const onClickAddRuleCaseHandler = () => {
        setCustFeatRuleCaseList((state: Array<TbRsCustFeatRuleCase>) => {
            let rtn = cloneDeep(state)
            let addRuleCase: TbRsCustFeatRuleCase = cloneDeep(initTbRsCustFeatRuleCase)
            rtn.push(addRuleCase)
            return rtn
        })
    }
    // Top 선택시
    useEffect(() => {
        if (isSelectAggregateTop) {
            setCustFeatRuleCalc((state: TbRsCustFeatRuleCalc) => {
                let rtn = cloneDeep(state)
                rtn.formula = "T1"
                return rtn
            })
            setCustFeatRuleCaseList((state: Array<TbRsCustFeatRuleCase>) => {
                let rtn = [cloneDeep(initTbRsCustFeatRuleCase)]
                return rtn
            })
            setFormulaCaseChecked(false)
        }
    }, [isSelectAggregateTop])
    return (
        // check box 선택시 case문 조건 설정 항목 show/hide 필요
        <Stack
            direction="Vertical"
            style={{
                margin: "0.5rem"
            }}
        >
            <Stack
                direction="Horizontal"
                justifyContent="Start" 
                gap="MD" 
            >
                <Typography variant="h4">2. 생성 Feature</Typography>
                <Typography variant="caption">숫자 타입의 TARGET명, +, -, *, /, 소괄호만 사용하여 계산식을 입력합니다. 예) (T1+T2)/T3 </Typography>
                {/* 
                {(isPossibleEdit && !isSelectAggregateTop) &&
                <><Typography variant='body2'>CASE 사용</Typography>
                <Checkbox
                    checked={formulaCaseChecked}
                    onCheckedChange={onCheckedCaseChange}
                />
                </>
                } 
                */}
            </Stack>
            <div className='flex row'>
                <Stack 
                    direction="Horizontal"
                    justifyContent="Start" 
                    gap="MD" 
                >
                </Stack>
                {!formulaCaseChecked && 
                    <FormulaComponent 
                        isPossibleEdit={isPossibleEdit}
                        custFeatRuleCalc={custFeatRuleCalc}
                        setCustFeatRuleCalc={setCustFeatRuleCalc}
                        setIsValidFormula={setIsValidFormula!}
                        formulaTrgtList={formulaTrgtList}
                    />
                }
                {formulaCaseChecked &&
                    <>
                    <Stack 
                        direction="Horizontal"
                        justifyContent="Start" 
                        gap="MD" 
                    >
                        <Typography variant='h6'>CASE</Typography>
                        {(!elseSelected && isPossibleEdit) && <Button size="SM" onClick={onClickAddRuleCaseHandler}>
                            추가
                        </Button>}
                    </Stack>
                    {custFeatRuleCaseList.map((ruleCase: TbRsCustFeatRuleCase, index: number) => {
                        return <CaseComponent
                            key={`custFeatRuleCase-${index}`}
                            isPossibleEdit={isPossibleEdit}
                            index={index}
                            lastIdx={(custFeatRuleCaseList.length-1)}
                            custFeatRuleCase={ruleCase}
                            setCustFeatRuleCaseList={setCustFeatRuleCaseList}
                            setIsValidFormula={setIsValidFormula!}
                            formulaTrgtList={formulaTrgtList}
                        />
                    })}
                    </>
                }
            </div>
        </Stack>
    )
}

export default ClacValid