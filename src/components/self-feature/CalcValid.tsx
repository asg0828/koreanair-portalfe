import {Button, Checkbox, Stack, Typography} from '@components/ui'
import { useEffect, useState } from 'react'
import { cloneDeep } from 'lodash'

import CaseComponent from './CaseComponent';
import FormulaComponent from './FormulaComponent';

import { 
    FeatCalcValidProps,
    TbRsCustFeatRuleCase, 
} from '@/models/selfFeature/FeatureInfo'
import { 
    initTbRsCustFeatRuleCase, 
} from '@/pages/user/self-feature/data';
import {
    selfFeatPgPpNm, 
    subFeatStatus 
} from '@/models/selfFeature/FeatureCommon';

const ClacValid = ({
    featStatus,
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
            (featStatus === subFeatStatus.REG 
            || featStatus === subFeatStatus.SUBREG )
            && featStatus !== selfFeatPgPpNm.DETL
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
    const onCheckedCaseChange = () => {
        setFormulaCaseChecked(!formulaCaseChecked)

        if (!formulaCaseChecked) {
            //console.log("checked")
        } else {
            // case문 사용 체크 해제시 입력값 초기화
            setCustFeatRuleCaseList((state: Array<TbRsCustFeatRuleCase>) => {
                let rtn = [cloneDeep(initTbRsCustFeatRuleCase)]
                return rtn
            })

        }
    }
    // case문 구문 추가시
    const onClickAddRuleCaseHandler = () => {
        setCustFeatRuleCaseList((state: Array<TbRsCustFeatRuleCase>) => {
            let rtn = cloneDeep(state)
            let addRuleCase: TbRsCustFeatRuleCase = cloneDeep(initTbRsCustFeatRuleCase)
            rtn.push(addRuleCase)
            return rtn
        })
    }

    return (
        // check box 선택시 case문 조건 설정 항목 show/hide 필요
        <>
        <Stack
            direction="Horizontal"
            justifyContent="Start" 
            gap="MD" 
        >
            <Typography variant="h4">계산식</Typography>
            {isPossibleEdit &&
            <>
            <Typography variant='body2'>CASE 사용</Typography>
            <Checkbox
                checked={formulaCaseChecked}
                onCheckedChange={onCheckedCaseChange}
            />
            </>
            }
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
        </>
    )
}

export default ClacValid