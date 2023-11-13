import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { cloneDeep } from 'lodash';
import { SelectValue } from '@mui/base/useSelect';

import DragList from '@/components/self-feature/DragList';
import DropList from '@/components/self-feature/DropList';
import CalcValid from '@/components/self-feature/CalcValid';
import HorizontalTable from '@/components/table/HorizontalTable';
import { Button, Select, SelectOption, Stack, TD, TH, TR, TextField, Typography } from '@components/ui'
import ConfirmModal from '@/components/modal/ConfirmModal';

import { 
  FeatureInfo,
  TbRsCustFeatRuleCalc,
  TbRsCustFeatRule,
  TbRsCustFeatRuleTrgt,
  TbRsCustFeatRuleTrgtFilter,
  TbRsCustFeatRuleCase,
  MstrSgmtTableandColMetaInfo,
  FeatureTemp,
  TbRsCustFeatRuleSql,
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
  initFeatureTemp,
  initTbRsCustFeatRuleSql,
  protoTypeMstrSgmtTableandColMetaInfo,
} from './data'
import { Method, callApi } from '@/utils/ApiUtil';
import {
  subFeatStatus,
  selfFeatPgPpNm,
  initConfig,
  initApiRequest,
  initCommonResponse,
  ModalType,
  ModalTitCont,
} from '@/models/selfFeature/FeatureCommon';

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
  const location = useLocation()

  const [ regType, setRegType ] = useState<string>(location.state.regType)

  // formData
  const [ featureInfo, setFeatureInfo ] = useState<FeatureInfo>(cloneDeep(initSelfFeatureInfo))

  // 기본정보
  const [ featureTempInfo, setFeatureTempInfo ] = useState<FeatureTemp>(cloneDeep(initFeatureTemp))
  const [ custFeatRule, setCustFeatRule ] = useState<TbRsCustFeatRule>(cloneDeep(initTbRsCustFeatRule))
  // 대상선택
  const [ targetList, setTargetList ] = useState<Array<TbRsCustFeatRuleTrgt>>([])
  const [ trgtFilterList, setTrgtFilterList ] = useState<Array<TbRsCustFeatRuleTrgtFilter>>([])
  // SQL 입력
  const [ sqlQueryInfo, setSqlQueryInfo ] = useState<TbRsCustFeatRuleSql>(cloneDeep(initTbRsCustFeatRuleSql))
  // 계산식
  const [ custFeatRuleCalc, setCustFeatRuleCalc ] = useState<TbRsCustFeatRuleCalc>(cloneDeep(initTbRsCustFeatRuleCalc))
  const [ custFeatRuleCaseList, setCustFeatRuleCaseList ] = useState<Array<TbRsCustFeatRuleCase>>([cloneDeep(initTbRsCustFeatRuleCase)])
  const [ formulaTrgtList, setFormulaTrgtList ] = useState<Array<string>>([])
  const [ isValidFormula, setIsValidFormula ] = useState<Boolean>(true)
  // SQL 등록
  // 속성 및 행동 데이터
  const [ mstrSgmtTableandColMetaInfo, setMstrSgmtTableandColMetaInfo ] = useState<MstrSgmtTableandColMetaInfo>(cloneDeep(initMstrSgmtTableandColMetaInfo))
  // Top 집계함수 선택 여부
  const [ isSelectAggregateTop, setIsSelectAggregateTop ] = useState<Boolean>(false)

  const [ isOpenConfirmModal, setIsOpenConfirmModal ] = useState<boolean>(false)
  const [ confirmModalTit, setConfirmModalTit ] = useState<string>('')
  const [ confirmModalCont, setConfirmModalCont ] = useState<string>('')
  const [ modalType, setModalType ] = useState<string>('')

  // modal 확인/취소 이벤트
  const onConfirm = () => {
    if (modalType === ModalType.CONFIRM) {
      if (regType === selfFeatPgPpNm.SQL_REG) {
        createCustFeatSQL()
      } else if (regType === selfFeatPgPpNm.RULE_REG) {
        createCustFeatRule()
      }
    }
    setIsOpenConfirmModal(false)
  }
  const onCancel = () => {
    setIsOpenConfirmModal(false)
  }

  useEffect(() => {
    // 초기 setting API Call
    initCustFeatRule()
    if (regType === selfFeatPgPpNm.RULE_REG) 
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
  useEffect(() => {
    setFeatureInfo((state: FeatureInfo) => {
      let rtn = cloneDeep(state)
      rtn.featureTemp = cloneDeep(featureTempInfo)
      return rtn
    })
  }, [featureTempInfo])
  
  // 대상 선택시 formData setting
  useEffect(() => {
    // 선택 대상이 없을 경우 우측 drag 영역 노출
    if (targetList.length < 1) setIsSelectAggregateTop(false)

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

  // SQL 입력시 formData setting
  useEffect(() => {
    setFeatureInfo((state: FeatureInfo) => {
      let rtn = cloneDeep(state)
      rtn.tbRsCustFeatRuleSql = cloneDeep(sqlQueryInfo)
      return rtn
    })
  }, [sqlQueryInfo])
  
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

  const getTableandColumnMetaInfoByMstrSgmtRuleId = async () => {
    /*
      Method      :: GET
      Url         :: /api/v1/mastersegment/table-columns-meta-info
      path param  :: {mstrSgmtRuleId}
      query param :: 
    */
    let mstrSgmtRuleId = 'MS_0006'
    let config = cloneDeep(initConfig)
    config.isLoarding = true
    let request = cloneDeep(initApiRequest)
    request.method = Method.GET
    request.url = `/api/v1/mastersegment/table-columns-meta-info/${mstrSgmtRuleId}`
    console.log("[getTableandColumnMetaInfoByMstrSgmtRuleId] Request  :: ", request)

    let response = cloneDeep(initCommonResponse)
    response = await callApi(request)
    console.log("[getTableandColumnMetaInfoByMstrSgmtRuleId] Response header       :: ", response.header)
    console.log("[getTableandColumnMetaInfoByMstrSgmtRuleId] Response statusCode   :: ", response.statusCode)
    console.log("[getTableandColumnMetaInfoByMstrSgmtRuleId] Response status       :: ", response.status)
    console.log("[getTableandColumnMetaInfoByMstrSgmtRuleId] Response successOrNot :: ", response.successOrNot)
    console.log("[getTableandColumnMetaInfoByMstrSgmtRuleId] Response result       :: ", response.result)

    setMstrSgmtTableandColMetaInfo(cloneDeep(response.result))
  }

  const createCustFeatRule = async () => {
    if (!isValidFormula) {
      setModalType(ModalType.ALERT)
      setConfirmModalCont(ModalTitCont.REG_VALID.context)
      setIsOpenConfirmModal(true)
      return
    }
    /*
      Method      :: POST
      Url         :: /api/v1/customerfeatures
      path param  :: 
      query param :: 
      body param  :: featureInfo
    */
    let config = cloneDeep(initConfig)
    config.isLoarding = true
    let request = cloneDeep(initApiRequest)
    request.method = Method.POST
    request.url = "/api/v1/customerfeatures"
    featureInfo.tbRsCustFeatRule.sqlDirectInputYn = "N"
    request.params!.bodyParams = featureInfo
    console.log("[createCustFeatRule] Request  :: ", request)

    let response = cloneDeep(initCommonResponse)
    //response = await callApi(request)
    console.log("[createCustFeatRule] Response :: ", response)

    // API 정상 응답시 페이지 redirect
    
  }

  const createCustFeatSQL = async () => {
    /*
      Method      :: POST
      Url         :: /api/v1/korean-air/customerfeatures
      path param  :: 
      query param :: 
      body param  :: featureInfo
    */
    let config = cloneDeep(initConfig)
    config.isLoarding = true
    let request = cloneDeep(initApiRequest)
    request.method = Method.POST
    request.url = "/api/v1/korean-air/customerfeatures"
    featureInfo.tbRsCustFeatRule.sqlDirectInputYn = "Y"
    request.params!.bodyParams = featureInfo
    console.log("[createCustFeatSQL] Request  :: ", request)

    let response = cloneDeep(initCommonResponse)
    //response = await callApi(request)
    console.log("[createCustFeatSQL] Response :: ", response)

    // API 정상 응답시 페이지 redirect
    
  }

  const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target

    setCustFeatRule((state: TbRsCustFeatRule) => {
      let rtn = cloneDeep(state)
      Object.keys(rtn).map((key) => {
        if (key === id) {
          rtn[key] = value
        }
      })
      return rtn
    })

    setSqlQueryInfo((state: TbRsCustFeatRuleSql) => {
      let rtn = cloneDeep(state)
      Object.keys(rtn).map((key) => {
        if (key === id) {
          rtn[key] = value
        }
      })
      return rtn
    })

    setFeatureTempInfo((state: FeatureTemp) => {
      let rtn = cloneDeep(state)
      Object.keys(rtn).map((key) => {
        if (key === id) {
          rtn[key] = value
        }
      })
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
      Object.keys(rtn).map((key) => {
        if (key === keyNm) {
          rtn[key] = v
        }
      })
      return rtn
    })

    setSqlQueryInfo((state: TbRsCustFeatRuleSql) => {
      let rtn = cloneDeep(state)
      Object.keys(rtn).map((key) => {
        if (key === keyNm) {
          rtn[key] = v
        }
      })
      return rtn
    })

    setFeatureTempInfo((state: FeatureTemp) => {
      let rtn = cloneDeep(state)
      Object.keys(rtn).map((key) => {
        if (key === keyNm) {
          rtn[key] = v
        }
      })
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
    setModalType(ModalType.CONFIRM)
    setConfirmModalTit(ModalTitCont.REG.title)
    setConfirmModalCont(ModalTitCont.REG.context)
    setIsOpenConfirmModal(true)
  }

  return (
    <Stack direction="Vertical" gap="MD" justifyContent="Between" className='height-100'>
    {/* 정보 영역 */}
      <Stack direction="Vertical" gap="MD">
          {/* 기본 정보 */}
          <Typography variant="h4">Feature 기본 정보</Typography>
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
                <TextField className="width-100" id="featureId" readOnly onChange={onchangeInputHandler}/>
              </TD>
              <TH colSpan={1} align="right" required>Feature 타입</TH>
              <TD colSpan={2}>
                <TextField className="width-100" id="featureTyp" value={"self-feature"} readOnly onChange={onchangeInputHandler}/>
              </TD>
            </TR>
            <TR>
              <TH colSpan={1} align="right" required>한글명</TH>
              <TD colSpan={2}>
                <Stack gap="SM" className='width-100'>
                  <TextField className="width-100" id="featureNm" onChange={onchangeInputHandler}/>
                  <Button>중복확인</Button>
                </Stack>
              </TD>
              <TH colSpan={1} align="right" required>영문명</TH>
              <TD colSpan={2}>
                <Stack gap="SM" className='width-100'>
                  <TextField className="width-100" id="featureEngNm" onChange={onchangeInputHandler}/>
                  <Button>중복확인</Button>
                </Stack>
              </TD>
            </TR>
            <TR>
              <TH colSpan={1} align="right" required>Feature 정의</TH>
              <TD colSpan={5.01}>
                <TextField className="width-100" id="featureDef" multiline onChange={onchangeInputHandler}/>
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
                <TextField className="width-100" multiline id="featureFm" onChange={onchangeInputHandler}/>
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
          {(regType && (regType === selfFeatPgPpNm.RULE_REG)) &&
          <>
          <Typography variant="h4">대상 선택</Typography>
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
          </>
          }
          {/* 대상 선택 */}
          {/* SQL 입력 */}
          {(regType && (regType === selfFeatPgPpNm.SQL_REG)) &&
          <>
          <Typography variant="h4">Feature 생성 Query</Typography>
          <Stack 
              direction="Horizontal"
              gap="MD"
              justifyContent="Between"
              style={{
                height: '400px',
              }}
          >
            <TextField className="width-100 height-100" multiline id="sqlQuery" onChange={onchangeInputHandler}/>
          </Stack>
          </>
          }
          {/* SQL 입력 */}

          {/* 계산식 */}
          {(regType && (regType === selfFeatPgPpNm.RULE_REG) && (formulaTrgtList.length > 0)) &&
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

    {/* Confirm 모달 */}
      <ConfirmModal
          isOpen={isOpenConfirmModal}
          onClose={(isOpen) => setIsOpenConfirmModal(isOpen)}
          title={confirmModalTit}
          content={confirmModalCont}
          onConfirm={onConfirm}
          onCancle={onCancel}
          btnType={modalType}
      />

    </Stack>
  )

}

export default SelfFeatureReg;