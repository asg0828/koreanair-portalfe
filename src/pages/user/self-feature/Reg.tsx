import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { cloneDeep } from 'lodash';
import { SelectValue } from '@mui/base/useSelect';

import DragList from '@/components/self-feature/DragList';
import DropList from '@/components/self-feature/DropList';
import CalcValid from '@/components/self-feature/CalcValid';
import HorizontalTable from '@/components/table/HorizontalTable';
import { Button, Select, SelectOption, Stack, TD, TH, TR, TextField, Typography } from '@components/ui'

import { 
  FeatureInfo,
  TbRsCustFeatRuleCalc,
  TbRsCustFeatRule,
  TbRsCustFeatRuleTrgt,
  TbRsCustFeatRuleTrgtFilter,
  TbRsCustFeatRuleCase,
  MstrSgmtTableandColMetaInfo,
} from '@/models/selfFeature/FeatureInfo';
import {
  initSelfFeatureInfo,
  initMstrSgmtTableandColMetaInfo,
  initBehavior,
  initTbCoMetaTblClmnInfo,
  initAttribute,
  initTbRsCustFeatRule,
  initTbRsCustFeatRuleCalc,
  initTbRsCustFeatRuleCase,
  subFeatStatus,
  selfFeatPgPpNm,
} from './data'

const lCategory = [
  { value: '', text: '선택' },
  { value: '1', text: '회원' },
  { value: '2', text: '항공' },
]
const mCategory = [
  { value: '', text: '선택' },
  { value: '1', text: '항공권' },
]
const calcUnit = [
  { value: '', text: '선택' },
  { value: '1', text: '원' },
  { value: '2', text: '명' },
]

const SelfFeatureReg = () => {

  const navigate = useNavigate()
  // formData
  const [ featureInfo, setFeatureInfo ] = useState<FeatureInfo>(cloneDeep(initSelfFeatureInfo))

  // 기본정보
  const [ custFeatRule, setCustFeatRule ] = useState<TbRsCustFeatRule>(cloneDeep(initTbRsCustFeatRule))
  // 대상선택
  const [ targetList, setTargetList ] = useState<Array<TbRsCustFeatRuleTrgt>>([])
  const [ trgtFilterList, setTrgtFilterList ] = useState<Array<TbRsCustFeatRuleTrgtFilter>>([])
  // 계산식
  const [ custFeatRuleCalc, setCustFeatRuleCalc ] = useState<TbRsCustFeatRuleCalc>(cloneDeep(initTbRsCustFeatRuleCalc))
  const [ custFeatRuleCaseList, setCustFeatRuleCaseList ] = useState<Array<TbRsCustFeatRuleCase>>([cloneDeep(initTbRsCustFeatRuleCase)])
  const [ formulaTrgtList, setFormulaTrgtList ] = useState<Array<string>>([])
  const [ isValidFormula, setIsValidFormula ] = useState<Boolean>(true)
  // 속성 및 행동 데이터
  const [ mstrSgmtTableandColMetaInfo, setMstrSgmtTableandColMetaInfo ] = useState<MstrSgmtTableandColMetaInfo>(cloneDeep(initMstrSgmtTableandColMetaInfo))
  // Top 집계함수 선택 여부
  const [ isSelectAggregateTop, setIsSelectAggregateTop ] = useState<Boolean>(false)

  useEffect(() => {
    // 초기 setting API Call
    initCustFeatRule()
    getTableandColumnMetaInfoByMstrSgmtRuleId()
  }, [])

  const initCustFeatRule = () => {
    setFeatureInfo((state: FeatureInfo) => {
      let rtn = cloneDeep(state)
      rtn = cloneDeep(initSelfFeatureInfo)
      return rtn
    })
  }

  // 기본 정보 입력시 formData setting
  useEffect(() => {
    setFeatureInfo((state: FeatureInfo) => {
      let rtn = cloneDeep(state)
      rtn.tbRsCustFeatRule = cloneDeep(custFeatRule)
      return rtn
    })
  }, [custFeatRule])
  
  // 대상 선택시 formData setting
  useEffect(() => {
    setFeatureInfo((state: FeatureInfo) => {
      let rtn = cloneDeep(state)
      rtn.tbRsCustFeatRuleTrgtList = cloneDeep(targetList)
      return rtn
    })
    // 계산식 validation을 위한 대상 list 추출
    let fList = []
    for (let i = 0; i < targetList.length; i++) {
      let t = i + 1
      fList.push(`T${t}`)
    }
    setFormulaTrgtList(fList)
  }, [targetList])

  useEffect(() => {
    setFeatureInfo((state: FeatureInfo) => {
      let rtn = cloneDeep(state)
      rtn.tbRsCustFeatRuleTrgtFilterList = cloneDeep(trgtFilterList)
      return rtn
    })
  }, [trgtFilterList])
  
  // 계산식 입력시 formData setting
  useEffect(() => {
    setFeatureInfo((state: FeatureInfo) => {
      let rtn = cloneDeep(state)
      rtn.tbRsCustFeatRuleCalc = cloneDeep(custFeatRuleCalc)
      return rtn
    })
  }, [custFeatRuleCalc])

  useEffect(() => {
    setFeatureInfo((state: FeatureInfo) => {
      let rtn = cloneDeep(state)
      rtn.tbRsCustFeatRuleCaseList = cloneDeep(custFeatRuleCaseList)
      return rtn
    })
  }, [custFeatRuleCaseList])

  // 대상 선택 list가 없는 경우 formula reset
  useEffect(() => {
    if (formulaTrgtList.length > 0) return 
    
    setCustFeatRuleCalc((state: TbRsCustFeatRuleCalc) => {
      let rtn = cloneDeep(state)
      rtn.formula = ''
      return rtn
    })
    
  }, [formulaTrgtList])

  const getTableandColumnMetaInfoByMstrSgmtRuleId = () => {
    console.log(`속성/Feature/행동 데이터 API CALL!`)
    /*
      Method      :: GET
      Url         :: /api/v1/mastersegment/table-columns-meta-info
      path param  :: {mstrSgmtRuleId}
      query param :: 
    */
    setMstrSgmtTableandColMetaInfo((state: MstrSgmtTableandColMetaInfo) => {
      let temp = cloneDeep(state)
      let attributes = []
      let behaviors  = []
      if (temp) {
        temp.rslnRuleId = 'featureTest'

        for (let i = 0; i < 4; i++) {

          let behabvior = cloneDeep(initBehavior)

          behabvior.metaTblId = `featureBehvTable${i+1}`
          behabvior.metaTblLogiNm = `픽처테이블${i+1}`
          behabvior.tbCoMetaTbInfo.dbNm = `selfFeature${i+1}`
          behabvior.tbCoMetaTbInfo.metaTblDesc = `메타테이블설명${i+1}`
          behabvior.tbCoMetaTbInfo.metaTblDvCd = `ATTR/BEHV${i+1}`
          behabvior.tbCoMetaTbInfo.metaTblPhysNm = `행동물리명${i+1}`
          behabvior.tbCoMetaTbInfo.metaTblLogiNm = `행동논리명${i+1}`

          let tbCoMetaTblClmnInfoList = []
          for (let j = 0; j < 4; j++) {

            let tbCoMetaTblClmnInfo = cloneDeep(initTbCoMetaTblClmnInfo)

            tbCoMetaTblClmnInfo.metaTblId = `featureBehvTable${i+1}`
            tbCoMetaTblClmnInfo.metaTblClmnId = `featureBehvTable${i+1}Clmn${i+1}`
            tbCoMetaTblClmnInfo.metaTblClmnPhysNm = `컬럼 물리명${j+1}`
            tbCoMetaTblClmnInfo.metaTblClmnLogiNm = `컬럼 논리명${j+1}`
            tbCoMetaTblClmnInfoList.push(tbCoMetaTblClmnInfo)
          }

          behabvior.tbCoMetaTblClmnInfoList = tbCoMetaTblClmnInfoList
          behaviors.push(behabvior)
        }

        for (let i = 0; i < 4; i++) {

          let attribute = cloneDeep(initAttribute)

          attribute.metaTblId = `featureAttrTable${i+1}`
          attribute.metaTblClmnId = `featureAttrTable${i+1}Clmn${i+1}`
          attribute.metaTblClmnPhysNm = `속성컬럼물리명${i+1}`
          attribute.metaTblClmnLogiNm = `속성컬럼논리명${i+1}`
          
          attributes.push(attribute)

        }

        temp.attributes = attributes
        temp.behaviors  = behaviors
      }
      return cloneDeep(temp)
    })
  }

  const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setCustFeatRule((state: TbRsCustFeatRule) => {
      let rtn = cloneDeep(state)
      rtn[id] = value
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
    setCustFeatRule((state: TbRsCustFeatRule) => {
      let rtn = cloneDeep(state)
      rtn[keyNm] = v
      return rtn
    })
  }

  const onClickPageMovHandler = (pageNm: string) => {
      if (pageNm === selfFeatPgPpNm.LIST)
        navigate('..')
      else
        navigate(`../${pageNm}`)
  }

  const onSubmitInsertHandler = () => {
    /*
      Method      :: POST
      Url         :: /api/v1/customerfeatures
      path param  :: 
      query param :: 
      body param  :: featureInfo
    */
    
    if (!isValidFormula) {
      alert("계산식을 확인해주세요.")
      return null
    }
    
    console.log("createCustFeatRule API CALL!")
    console.log("Self Feature insert data :: ", featureInfo)
  }

  return (
    <Stack direction="Vertical" gap="MD" justifyContent="Between" className='height-100'>
    {/* 정보 영역 */}
      <Stack direction="Vertical" gap="MD">
          {/* 기본 정보 */}
          <Typography variant="h3">Feature 기본 정보</Typography>
          <HorizontalTable>
            <TR>
              <TH colSpan={1} align="right" required>대구분</TH>
              <TD colSpan={2}>
                <Select 
                  appearance="Outline" 
                  placeholder="선택" 
                  className="width-100" 
                  onChange={(
                    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                    value: SelectValue<{}, false>
                  ) => {
                    onchangeSelectHandler(e, value, "lCategory")
                  }}
                >
                  {lCategory.map((item, index) => (
                    <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                  ))}
                </Select>
              </TD>
              <TH colSpan={1} align="right" required>중구분</TH>
              <TD colSpan={2}>
                <Select 
                  appearance="Outline" 
                  placeholder="선택" 
                  className="width-100" 
                  onChange={(
                    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                    value: SelectValue<{}, false>
                  ) => {
                    onchangeSelectHandler(e, value, "mCategory")
                  }}
                >
                  {mCategory.map((item, index) => (
                    <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                  ))}
                </Select>
              </TD>
            </TR>
            <TR>
              <TH colSpan={1} align="right" required>Feature ID</TH>
              <TD colSpan={2}>
                <TextField className="width-100" id="id" value={"feature id ex"} readOnly onChange={onchangeInputHandler}/>
              </TD>
              <TH colSpan={1} align="right" required>Feature 타입</TH>
              <TD colSpan={2}>
                <TextField className="width-100" id="dataType" value={"self-feature"} readOnly onChange={onchangeInputHandler}/>
              </TD>
            </TR>
            <TR>
              <TH colSpan={1} align="right" required>한글명</TH>
              <TD colSpan={2}>
                <Stack gap="SM" className='width-100'>
                  <TextField className="width-100" id="id" onChange={onchangeInputHandler}/>
                  <Button>중복확인</Button>
                </Stack>
              </TD>
              <TH colSpan={1} align="right" required>영문명</TH>
              <TD colSpan={2}>
                <Stack gap="SM" className='width-100'>
                  <TextField className="width-100" id="id" onChange={onchangeInputHandler}/>
                  <Button>중복확인</Button>
                </Stack>
              </TD>
            </TR>
            <TR>
              <TH colSpan={1} align="right" required>Feature 정의</TH>
              <TD colSpan={5.01}>
                <TextField className="width-100" id="description" multiline onChange={onchangeInputHandler}/>
              </TD>
            </TR>
            <TR>
              <TH colSpan={1} align="right">산출 단위</TH>
              <TD colSpan={2}>
                <Select 
                  appearance="Outline" 
                  placeholder="선택" 
                  className="width-100" 
                  onChange={(
                    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                    value: SelectValue<{}, false>
                  ) => {
                    onchangeSelectHandler(e, value, "calcUnit")
                  }}
                >
                  {calcUnit.map((item, index) => (
                    <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                  ))}
                </Select>
              </TD>
              <TH colSpan={1} align="right" required>카테고리</TH>
              <TD colSpan={2}>
                <Select className='width-100'  appearance="Outline" >
                    <SelectOption value={1}>test</SelectOption>
                </Select>
              </TD>
            </TR>
            <TR>
              <TH colSpan={1} align="right" required>산출 로직</TH>
              <TD colSpan={5.01}>
                <TextField className="width-100" multiline id="description" onChange={onchangeInputHandler}/>
              </TD>
            </TR>
            <TR>
              <TH colSpan={1} align="right">비고</TH>
              <TD colSpan={5.01}>
                <TextField className="width-100" id="description" onChange={onchangeInputHandler}/>
              </TD>
            </TR>
          </HorizontalTable>
          {/* 기본 정보 */}

          {/* 대상 선택 */}
          <Typography variant="h3">대상 선택</Typography>
          {/* drag && drop 영역*/}
          <Stack 
              direction="Horizontal"
              gap="MD"
              justifyContent="Between"
              style={{
                height: '400px',
              }}
          >
            <DndProvider backend={HTML5Backend}>
              {/* drop 영역 */}
              <DropList 
                featStatus={subFeatStatus.REG}
                setIsSelectAggregateTop={setIsSelectAggregateTop}
                targetList={targetList} 
                trgtFilterList={trgtFilterList} 
                setTargetList={setTargetList} 
                setTrgtFilterList={setTrgtFilterList} 
              />
              {/* drop 영역 */}

              {/* drag 영역 */}
              {(mstrSgmtTableandColMetaInfo && !isSelectAggregateTop) && 
                <DragList 
                  attributes={mstrSgmtTableandColMetaInfo.attributes} 
                  behaviors={mstrSgmtTableandColMetaInfo.behaviors} 
                />}
              {/* drag 영역 */}
            </DndProvider>
          </Stack>
          {/* 대상 선택 */}

          {/* 계산식 */}
          {formulaTrgtList.length > 0 &&
            <CalcValid
              featStatus={subFeatStatus.REG}
              setIsValidFormula={setIsValidFormula}
              formulaTrgtList={formulaTrgtList}
              custFeatRuleCalc={custFeatRuleCalc}
              custFeatRuleCaseList={custFeatRuleCaseList}
              setCustFeatRuleCalc={setCustFeatRuleCalc}
              setCustFeatRuleCaseList={setCustFeatRuleCaseList}
            />
          }
          {/* 계산식 */}
      </Stack>
    {/* 정보 영역 */}

    {/* 버튼 영역 */}
      <Stack direction="Vertical" gap="MD" justifyContent="End">
        <Stack justifyContent="End" gap="SM" className="width-100">
          <Button type="button" priority="Primary" appearance="Contained" size="LG" onClick={onSubmitInsertHandler}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8.79502 15.8749L4.62502 11.7049L3.20502 13.1149L8.79502 18.7049L20.795 6.70492L19.385 5.29492L8.79502 15.8749Z"
                  fill="currentColor"
                ></path>
              </svg>
            저장
          </Button>
          <Button type="button" priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.LIST)}>
            취소
          </Button>
        </Stack> 
      </Stack>
    {/* 버튼 영역 */}
    </Stack>
  )

}

export default SelfFeatureReg;