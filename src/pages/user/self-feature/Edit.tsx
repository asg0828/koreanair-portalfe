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
import ConfirmModal from "@/components/modal/ConfirmModal";
import ApprovalList from "@/components/self-feature/ApprovalList";
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
  FeatureTemp,
  TbRsCustFeatRuleSql,
  FormulaTrgtListProps,
} from '@/models/selfFeature/FeatureInfo';
import {
  initSelfFeatureInfo,
  initMstrSgmtTableandColMetaInfo,
  initTbRsCustFeatRule,
  initTbRsCustFeatRuleCalc,
  initFeatureTemp,
  initTbRsCustFeatRuleSql,
} from './data'
import { Method, callApi } from "@/utils/ApiUtil";
import {
  subFeatStatus,
  selfFeatPgPpNm,
  initConfig,
  initApiRequest,
  initCommonResponse,
  ModalType,
  ModalTitCont,
  ColDataType,
} from '@/models/selfFeature/FeatureCommon';
import { StatusCode } from "@/models/common/CommonResponse";
import { SfSubmissionApproval, SfSubmissionRequestInfo } from "@/models/selfFeature/FeatureSubmissionInfo";
import { initSfSubmissionApproval, initSfSubmissionRequestInfo } from "../self-feature-submission/data";

const lCategory = [
  { value: '온라인행동', text: '온라인행동' },
  { value: '2', text: '항공' },
]
const mCategory = [
  { value: '홈페이지', text: '홈페이지' },
]
const calcUnit = [
  { value: '횟수', text: '횟수' },
  { value: '2', text: '명' },
]

const SelfFeatureEdit = () => {

  const navigate = useNavigate()

  const location = useLocation()

  // update 데이터
  const [ updtFeatureInfo, setUpdtFeatureInfo ] = useState<FeatureInfo>(cloneDeep(initSelfFeatureInfo))

  const [ regType, setRegType ] = useState<string>(location.state.regType)

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
  const [ custFeatRuleCaseList, setCustFeatRuleCaseList ] = useState<Array<TbRsCustFeatRuleCase>>([])
  const [ formulaTrgtList, setFormulaTrgtList ] = useState<Array<FormulaTrgtListProps>>([])
  const [ isValidFormula, setIsValidFormula ] = useState<Boolean>(true)  
  // 승인 정보
  const [ sfSubmissionRequestData, setSfSubmissionRequestData ] = useState<SfSubmissionRequestInfo>(cloneDeep(initSfSubmissionRequestInfo))
  const [ sfSubmissionApprovalList, setSfSubmissionApprovalList ] = useState<Array<SfSubmissionApproval>>(cloneDeep([initSfSubmissionApproval]))

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
      if (custFeatRule.sqlDirectInputYn === 'Y') {
        updateCustFeatSQL()
      } else if (
        custFeatRule.sqlDirectInputYn === '' 
        || custFeatRule.sqlDirectInputYn === 'N'
      ) {
        updateCustFeatRule()
      }

      if (regType === "trgtClear") {
        setTargetList([])
        setTrgtFilterList([])
      }
    }
    setIsOpenConfirmModal(false)
  }
  const onCancel = () => {
    setIsOpenConfirmModal(false)
  }

  useEffect(() => {
    //useQuery(['mstrSgmtTableandColMetaInfo'], () => )
    if (location.state.featureInfo.tbRsCustFeatRule.sqlDirectInputYn !== "Y")
      getTableandColumnMetaInfoByMstrSgmtRuleId()
  }, [])

  useEffect(() => {
    setFeatureTempInfo(cloneDeep(location.state.featureInfo.featureTemp))
    setCustFeatRule(cloneDeep(location.state.featureInfo.tbRsCustFeatRule))
    setTargetList(cloneDeep(location.state.featureInfo.tbRsCustFeatRuleTrgtList))
    setTrgtFilterList(cloneDeep(location.state.featureInfo.tbRsCustFeatRuleTrgtFilterList))
    setCustFeatRuleCalc(cloneDeep(location.state.featureInfo.tbRsCustFeatRuleCalc))
    setCustFeatRuleCaseList(cloneDeep(location.state.featureInfo.tbRsCustFeatRuleCaseList))
    setSqlQueryInfo(cloneDeep(location.state.featureInfo.tbRsCustFeatRuleSql))
    setSfSubmissionRequestData(cloneDeep(location.state.sfSubmissionRequestData))
    setSfSubmissionApprovalList(cloneDeep(location.state.sfSubmissionApprovalList))
  }, [location.state])

  // 기본 정보 입력시 formData setting
  useEffect(() => {
    setUpdtFeatureInfo((state: FeatureInfo) => {
      let rtn = cloneDeep(state)
      rtn.featureTemp = cloneDeep(featureTempInfo)
      return rtn
    })
  }, [featureTempInfo])
  useEffect(() => {
    setUpdtFeatureInfo((state: FeatureInfo) => {
      let rtn = cloneDeep(state)
      rtn.tbRsCustFeatRule = cloneDeep(custFeatRule)
      return rtn
    })
  }, [custFeatRule])
  
  // 대상 선택시 formData setting
  useEffect(() => {
    // 선택 대상이 없을 경우 우측 drag 영역 노출
    if (targetList.length < 1) setIsSelectAggregateTop(false)

    setUpdtFeatureInfo((state: FeatureInfo) => {
      let rtn = cloneDeep(state)
      rtn.tbRsCustFeatRuleTrgtList = cloneDeep(targetList)
      return rtn
    })
    // 계산식 validation을 위한 대상 list 추출
    let fList = []
    for (let i = 0; i < targetList.length; i++) {
      let t = { targetId: `T${i+1}`, dataType: "" }
      let dataType = targetList[i].targetDataType
      // 집계함수 선택시 대상의 dataType 수정
      if (
        targetList[i].operator === "count"
        || targetList[i].operator === "distinct_count"
      ) {
        dataType = ColDataType.NUM
      }
      t.dataType = dataType

      fList.push(t)
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
  useEffect(() => {
    setUpdtFeatureInfo((state: FeatureInfo) => {
      let rtn = cloneDeep(state)
      rtn.tbRsCustFeatRuleSql = cloneDeep(sqlQueryInfo)
      return rtn
    })
  }, [sqlQueryInfo])
  
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
    
    if (
      location.state.featureInfo.tbRsCustFeatRuleCalc
      && location.state.featureInfo.tbRsCustFeatRuleCalc.formula === ""
    ) {
      setCustFeatRuleCalc((state: TbRsCustFeatRuleCalc) => {
        let rtn = cloneDeep(state)
        rtn.formula = ''
        return rtn
      })
    }
    
  }, [formulaTrgtList, location.state.featureInfo.tbRsCustFeatRuleCalc?.formula])

  const getTableandColumnMetaInfoByMstrSgmtRuleId = async () => {
    /*
      Method      :: GET
      Url         :: /api/v1/mastersegment/table-columns-meta-info
      path param  :: {mstrSgmtRuleId}
      query param :: 
    */
    let mstrSgmtRuleId = 'MS_0032'
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

    if (response.statusCode === StatusCode.SUCCESS) {
      setMstrSgmtTableandColMetaInfo(cloneDeep(response.result))
    }
  }

  const updateCustFeatRule = async () => {

    if (!isValidFormula) {
      setModalType(ModalType.ALERT)
      setConfirmModalCont(ModalTitCont.EDIT_VALID.context)
      setIsOpenConfirmModal(true)
      return
    }
    /*
      Method      :: PUT
      Url         :: /api/v1/customerfeatures
      path param  :: {custFeatRuleId}
      query param :: 
      body param  :: updtFeatureInfo
    */
    let custFeatRuleId = ''
    let config = cloneDeep(initConfig)
    config.isLoarding = true
    let request = cloneDeep(initApiRequest)
    request.method = Method.PUT
    request.url = `/api/v1/customerfeatures/${custFeatRuleId}`
    request.params!.bodyParams = Object.assign(updtFeatureInfo, {sfSubmissionRequestData: sfSubmissionRequestData})
    request.params!.bodyParams = Object.assign(request.params!.bodyParams, {sfSubmissionApprovalList: sfSubmissionApprovalList})
    console.log("[updateCustFeatRule] Request  :: ", request)
    
    let response = cloneDeep(initCommonResponse)
    //response = await callApi(request)
    console.log("[updateCustFeatRule] Response :: ", response)

    // API 정상 응답시 페이지 redirect
    
  }

  const updateCustFeatSQL = async () => {
    /*
      Method      :: PUT
      Url         :: /api/v1/korean-air/customerfeatures/${custFeatRuleId}
      path param  :: custFeatRuleId
      query param :: 
      body param  :: updtFeatureInfo
    */
    let custFeatRuleId = ''
    let config = cloneDeep(initConfig)
    config.isLoarding = true
    let request = cloneDeep(initApiRequest)
    request.method = Method.PUT
    request.url = `/api/v1/korean-air/customerfeatures/${custFeatRuleId}`
    request.params!.bodyParams = Object.assign(updtFeatureInfo, {sfSubmissionRequestData: sfSubmissionRequestData})
    request.params!.bodyParams = Object.assign(request.params!.bodyParams, {sfSubmissionApprovalList: sfSubmissionApprovalList})
    console.log("[updateCustFeatSQL] Request  :: ", request)

    let response = cloneDeep(initCommonResponse)
    //response = await callApi(request)
    console.log("[updateCustFeatSQL] Response :: ", response)

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
        return key
      })
      return rtn
    })

    setSqlQueryInfo((state: TbRsCustFeatRuleSql) => {
      let rtn = cloneDeep(state)
      Object.keys(rtn).map((key) => {
        if (key === id) {
          rtn[key] = value
        }
        return key
      })
      return rtn
    })

    setFeatureTempInfo((state: FeatureTemp) => {
      let rtn = cloneDeep(state)
      Object.keys(rtn).map((key) => {
        if (key === id) {
          rtn[key] = value
        }
        return key
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
        return key
      })
      return rtn
    })

    setSqlQueryInfo((state: TbRsCustFeatRuleSql) => {
      let rtn = cloneDeep(state)
      Object.keys(rtn).map((key) => {
        if (key === keyNm) {
          rtn[key] = v
        }
        return key
      })
      return rtn
    })

    setFeatureTempInfo((state: FeatureTemp) => {
      let rtn = cloneDeep(state)
      Object.keys(rtn).map((key) => {
        if (key === keyNm) {
          rtn[key] = v
        }
        return key
      })
      return rtn
    })

  }

  const onClickPageMovHandler = (pageNm: string) => {
      if (pageNm === selfFeatPgPpNm.LIST)
        //navigate('..')
        navigate(-1)
      else
        navigate(`../${pageNm}`)
  }

  const targetClearHanbler = () => {
    setModalType(ModalType.CONFIRM)
    setRegType("trgtClear")
    setConfirmModalTit(ModalTitCont.TRGT_CLEAR.title)
    setConfirmModalCont(ModalTitCont.TRGT_CLEAR.context)
    setIsOpenConfirmModal(true)
  }

  const onSubmitUpdateHandler = () => {
    setModalType(ModalType.CONFIRM)
    setConfirmModalTit(ModalTitCont.EDIT.title)
    setConfirmModalCont(ModalTitCont.EDIT.context)
    setIsOpenConfirmModal(true)
  }

  return (
    <Stack direction="Vertical" gap="MD" justifyContent="Between" className='height-100'>
    {/* 정보 영역 */}
      <Stack direction="Vertical" gap="MD" >
        {/* 상단 버튼 영역 */}
        <FeatQueryRsltButton />
        
        {/* 기본 정보 */}
        <Typography variant="h4">Feature 기본 정보</Typography>
        <HorizontalTable>
          <TR>
            <TH colSpan={1} align="center">대구분</TH>
            <TD colSpan={3}>
              <Select 
                defaultValue={location.state.featureInfo.featureTemp?.featureLSe}
                appearance="Outline" 
                placeholder="대구분" 
                className="width-100" 
                onChange={(
                  e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                  value: SelectValue<{}, false>
                ) => {
                  onchangeSelectHandler(e, value, "featureLSe")
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
                defaultValue={location.state.featureInfo.featureTemp?.featureMSe}
                appearance="Outline" 
                placeholder="중구분" 
                className="width-100" 
                onChange={(
                  e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                  value: SelectValue<{}, false>
                ) => {
                  onchangeSelectHandler(e, value, "featureMSe")
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
                defaultValue={location.state.featureInfo.featureTemp?.featureId}
                onChange={onchangeInputHandler}
              />
            </TD>
            <TH colSpan={1} align="center">Feature 타입</TH>
            <TD colSpan={3}>
              <TextField 
                className="width-100" 
                id="dataType"
                readOnly
                defaultValue={location.state.featureInfo.featureTemp?.featureTyp}
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
                defaultValue={location.state.featureInfo.featureTemp?.featureNm}
                onChange={onchangeInputHandler}
              />
            </TD>
            <TH colSpan={1} align="center">영문명</TH>
            <TD colSpan={3}>
              <TextField 
                className="width-100" 
                id="name" 
                defaultValue={location.state.featureInfo.featureTemp?.featureEngNm}
                onChange={onchangeInputHandler}
              />
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="center">Feature 정의</TH>
            <TD colSpan={7}>
              <TextField 
                className="width-100" 
                multiline
                id="description" 
                defaultValue={featureTempInfo?.featureDef}
                onChange={onchangeInputHandler}
              />
            </TD>
          </TR>
          <TR>
            <TH colSpan={1} align="center">산출 단위</TH>
            <TD colSpan={3}>
              <Select 
                defaultValue={location.state.featureInfo.featureTemp?.calcUnt}
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
              <TextField 
                style={{
                  height: "150px"
                }}
                className="width-100" 
                multiline
                id="featureFm" 
                defaultValue={featureTempInfo?.featureFm}
                onChange={onchangeInputHandler}/>
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
        {(
          custFeatRule.sqlDirectInputYn === "" 
          || custFeatRule.sqlDirectInputYn === "N"
        ) &&
        <>
        {/* 대상 선택 */}
        <Stack direction="Horizontal" gap="LG" justifyContent="start">
          <Typography variant="h4">대상 선택</Typography>
          <Button type="button" priority="Normal" appearance="Outline" size="SM" onClick={targetClearHanbler}>
            초기화
          </Button>
        </Stack>
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
              attributes={mstrSgmtTableandColMetaInfo.attributes} 
              behaviors={mstrSgmtTableandColMetaInfo.behaviors}
              setFormulaTrgtList={setFormulaTrgtList}
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
            isSelectAggregateTop={isSelectAggregateTop}
            setIsValidFormula={setIsValidFormula}
            formulaTrgtList={formulaTrgtList}
            custFeatRuleCalc={custFeatRuleCalc}
            custFeatRuleCaseList={custFeatRuleCaseList}
            setCustFeatRuleCalc={setCustFeatRuleCalc}
            setCustFeatRuleCaseList={setCustFeatRuleCaseList}
          />
        }
        {/* 계산식 */}
        </>
        }
        {custFeatRule.sqlDirectInputYn === "Y" &&
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
          <TextField 
            className="width-100 height-100" 
            multiline 
            id="sqlQuery" 
            value={sqlQueryInfo?.sqlQuery}
            onChange={onchangeInputHandler}
          />
        </Stack>
        </>
        }
        {/* 결재선 */}
        <ApprovalList
          sfSubmissionRequestData={sfSubmissionRequestData}
          sfSubmissionApprovalList={sfSubmissionApprovalList}
          setSfSubmissionApprovalList={setSfSubmissionApprovalList}
        />
        {/* 결재선 */}
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
export default SelfFeatureEdit