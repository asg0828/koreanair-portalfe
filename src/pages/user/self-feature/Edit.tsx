import { 
  useEffect, 
  useState 
} from "react"
import { 
  useLocation, 
  useNavigate 
} from "react-router-dom"
import { cloneDeep } from 'lodash'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { SelectValue } from '@mui/base/useSelect';

import HorizontalTable from "@/components/table/HorizontalTable"
import CalcValid from '@/components/self-feature/CalcValid';
import DropList from "@/components/self-feature/DropList";
import DragList from "@/components/self-feature/DragList";
import FeatQueryRsltButton from "@/components/self-feature/FeatQueryRsltButton";
import { 
  Button, 
  Select, 
  SelectOption, 
  Stack, 
  TD, 
  TH, 
  TR, 
  TextField, 
  Typography 
} from '@components/ui'

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
  subFeatStatus,
  selfFeatPgPpNm,
} from './data'

const lCategory = [
  { value: '1', text: '회원' },
  { value: '2', text: '항공' },
]
const mCategory = [
  { value: '1', text: '항공권' },
]
const calcUnit = [
  { value: '1', text: '원' },
  { value: '2', text: '명' },
]

const SelfFeatureEdit = () => {

  const navigate = useNavigate()

  const location = useLocation()

  // update 데이터
  const [ updtFeatureInfo, setUpdtFeatureInfo ] = useState<FeatureInfo>(cloneDeep(initSelfFeatureInfo))

  // 기본정보
  const [ custFeatRule, setCustFeatRule ] = useState<TbRsCustFeatRule>(cloneDeep(initTbRsCustFeatRule))
  // 대상선택
  const [ targetList, setTargetList ] = useState<Array<TbRsCustFeatRuleTrgt>>([])
  const [ trgtFilterList, setTrgtFilterList ] = useState<Array<TbRsCustFeatRuleTrgtFilter>>([])
  // 계산식
  const [ custFeatRuleCalc, setCustFeatRuleCalc ] = useState<TbRsCustFeatRuleCalc>(cloneDeep(initTbRsCustFeatRuleCalc))
  const [ custFeatRuleCaseList, setCustFeatRuleCaseList ] = useState<Array<TbRsCustFeatRuleCase>>([])
  const [ formulaTrgtList, setFormulaTrgtList ] = useState<Array<string>>([])
  const [ isValidFormula, setIsValidFormula ] = useState<Boolean>(true)
  // 속성 및 행동 데이터
  const [ mstrSgmtTableandColMetaInfo, setMstrSgmtTableandColMetaInfo ] = useState<MstrSgmtTableandColMetaInfo>(cloneDeep(initMstrSgmtTableandColMetaInfo))

  useEffect(() => {
    getTableandColumnMetaInfoByMstrSgmtRuleId()
  }, [])

  useEffect(() => {
    setCustFeatRule(cloneDeep(location.state.tbRsCustFeatRule))
    setTargetList(cloneDeep(location.state.tbRsCustFeatRuleTrgtList))
    setTrgtFilterList(cloneDeep(location.state.tbRsCustFeatRuleTrgtFilterList))
    setCustFeatRuleCalc(cloneDeep(location.state.tbRsCustFeatRuleCalc))
    setCustFeatRuleCaseList(cloneDeep(location.state.tbRsCustFeatRuleCaseList))
  }, [location.state])

  // 기본 정보 입력시 formData setting
  useEffect(() => {
    setUpdtFeatureInfo((state: FeatureInfo) => {
      let rtn = cloneDeep(state)
      rtn.tbRsCustFeatRule = cloneDeep(custFeatRule)
      return rtn
    })
  }, [custFeatRule])
  
  // 대상 선택시 formData setting
  useEffect(() => {
    setUpdtFeatureInfo((state: FeatureInfo) => {
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
    setUpdtFeatureInfo((state: FeatureInfo) => {
      let rtn = cloneDeep(state)
      rtn.tbRsCustFeatRuleTrgtFilterList = cloneDeep(trgtFilterList)
      return rtn
    })
  }, [trgtFilterList])
  
  // 계산식 입력시 formData setting
  useEffect(() => {
    setUpdtFeatureInfo((state: FeatureInfo) => {
      let rtn = cloneDeep(state)
      rtn.tbRsCustFeatRuleCalc = cloneDeep(custFeatRuleCalc)
      return rtn
    })
  }, [custFeatRuleCalc])
  useEffect(() => {
    setUpdtFeatureInfo((state: FeatureInfo) => {
      let rtn = cloneDeep(state)
      rtn.tbRsCustFeatRuleCaseList = cloneDeep(custFeatRuleCaseList)
      return rtn
    })
  }, [custFeatRuleCaseList])

  // 대상 선택 list가 없는 경우 formula reset
  useEffect(() => {
    if (formulaTrgtList.length > 0) return 

    if (location.state.tbRsCustFeatRuleCalc.formula === "") {
      setCustFeatRuleCalc((state: TbRsCustFeatRuleCalc) => {
        let rtn = cloneDeep(state)
        rtn.formula = ''
        return rtn
      })
    }
    
  }, [formulaTrgtList, location.state.tbRsCustFeatRuleCalc.formula])

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

  const onSubmitUpdateHandler = () => {
    /*
      Method      :: PUT
      Url         :: /api/v1/customerfeatures
      path param  :: {custFeatRuleId}
      query param :: 
      body param  :: updtFeatureInfo
    */
    
    if (!isValidFormula) {
      alert("계산식을 확인해주세요.")
      return null
    }
    
    console.log("createCustFeatRule API CALL!")
    console.log("Self Feature update data :: ", updtFeatureInfo)
  }

  return (
    <Stack direction="Vertical" gap="MD" justifyContent="Between" className='height-100'>
    {/* 정보 영역 */}
      <Stack direction="Vertical" gap="MD" >
        {/* 상단 버튼 영역 */}
        <FeatQueryRsltButton />
        
        {/* 기본 정보 */}
        <Typography variant="h3">Feature 기본 정보</Typography>
        <HorizontalTable>
          <TR>
            <TH colSpan={1} align="center">대구분</TH>
            <TD colSpan={3}>
              <Select 
                appearance="Outline" 
                placeholder="대구분" 
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
            <TH colSpan={1} align="center">중구분</TH>
            <TD colSpan={3}>
              <Select 
                appearance="Outline" 
                placeholder="중구분" 
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
            <TH colSpan={1} align="center">Feature ID</TH>
            <TD colSpan={3}>
              <TextField 
                className="width-100" 
                id="id" 
                value={custFeatRule.id}
                onChange={onchangeInputHandler}
              />
            </TD>
            <TH colSpan={1} align="center">Feature 타입</TH>
            <TD colSpan={3}>
              <TextField 
                className="width-100" 
                id="dataType"
                value={custFeatRule.dataType}
                onChange={onchangeInputHandler}
              />
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="center">한글명</TH>
            <TD colSpan={3}>
              <TextField 
                className="width-100" 
                id="name" 
                value={custFeatRule.name}
                onChange={onchangeInputHandler}
              />
            </TD>
            <TH colSpan={1} align="center">영문명</TH>
            <TD colSpan={3}>
              {/* <TextField 
                className="width-100" 
                id="name" 
                value={custFeatRule.name}
                onChange={onchangeInputHandler}
              /> */}
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="center">Feature 정의</TH>
            <TD colSpan={7}>
              <TextField 
                className="width-100" 
                id="description" 
                value={custFeatRule.description}
                onChange={onchangeInputHandler}
              />
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="center">산출 단위</TH>
            <TD colSpan={3}>
              <Select 
                appearance="Outline" 
                placeholder="산출 단위" 
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
            <TD colSpan={4}>
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="center">산출 로직</TH>
            <TD colSpan={7}>
              {/* <TextField className="width-100" id="description" onChange={onchangeInputHandler}/> */}
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="center">비고</TH>
            <TD colSpan={7}>
              {/* <TextField className="width-100" id="description" onChange={onchangeInputHandler}/> */}
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
              targetList={targetList} 
              trgtFilterList={trgtFilterList} 
              setTargetList={setTargetList} 
              setTrgtFilterList={setTrgtFilterList} 
            />
            {/* drop 영역 */}

            {/* drag 영역 */}
            {mstrSgmtTableandColMetaInfo && 
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
            <Button type="button" priority="Primary" appearance="Contained" size="LG" onClick={onSubmitUpdateHandler}>
              수정
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
export default SelfFeatureEdit