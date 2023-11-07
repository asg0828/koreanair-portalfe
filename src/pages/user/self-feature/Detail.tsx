import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { cloneDeep } from "lodash";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import HorizontalTable from '@components/table/HorizontalTable';
import VerticalTable from '@/components/table/VerticalTable';
import DropList from '@/components/self-feature/DropList';
import CalcValid from '@/components/self-feature/CalcValid';
import SubmissionRequestPop from '@/components/self-feature-submission/popup/SubmissionRequestPop';
import {
    TR,
    TH,
    TD,
    Button,
    Stack,
    Typography,
  } from '@components/ui';

import { 
  FeatureInfo, 
  FeatureTemp, 
  TbRsCustFeatRule, 
  TbRsCustFeatRuleCalc, 
  TbRsCustFeatRuleCase, 
  TbRsCustFeatRuleSql, 
  TbRsCustFeatRuleTrgt, 
  TbRsCustFeatRuleTrgtFilter, 
} from '@/models/selfFeature/FeatureInfo';
import { 
  initFeatureTemp,
  initSelfFeatureInfo, 
  initTbRsCustFeatRule, 
  initTbRsCustFeatRuleCalc, 
  initTbRsCustFeatRuleCase, 
  initTbRsCustFeatRuleSql, 
  initTbRsCustFeatRuleTrgt, 
  initTbRsCustFeatRuleTrgtFilter,
} from './data';
import {
  aprvSeqNm,
  sfSubmissionApprovalListColumns as columns, 
  initSfSubmissionApproval, 
  initSfSubmissionRequestInfo,
} from '../self-feature-submission/data'
import {
  subFeatStatus,
  selfFeatPgPpNm,
  initConfig,
  initApiRequest,
  initCommonResponse,
  ModalType,
  ModalTitCont,
} from '@/models/selfFeature/FeatureCommon';
import { 
  SfSubmissionApproval, 
  SfSubmissionRequestInfo 
} from '@/models/selfFeature/FeatureSubmissionInfo';
import { Method } from '@/utils/ApiUtil';
import ConfirmModal from '@/components/modal/ConfirmModal';

const SelfFeatureDetail = () => {

    const location = useLocation()
    const navigate = useNavigate()

    const [ regType, setRegType ] = useState<string>('')
    const [ isOpenConfirmModal, setIsOpenConfirmModal ] = useState<boolean>(false)
    const [ confirmModalTit, setConfirmModalTit ] = useState<string>('')
    const [ confirmModalCont, setConfirmModalCont ] = useState<string>('')
    const [ modalType, setModalType ] = useState<string>('')

    const [ formulaTrgtList, setFormulaTrgtList ] = useState<Array<string>>([])

    const [ featureTempInfo, setFeatureTempInfo ] = useState<FeatureTemp>(cloneDeep(initFeatureTemp))
    const [ featureInfo, setFeatureInfo ] = useState<FeatureInfo>(cloneDeep(initSelfFeatureInfo))
    const [ targetList, setTargetList ] = useState<Array<TbRsCustFeatRuleTrgt>>([])
    const [ trgtFilterList, setTrgtFilterList ] = useState<Array<TbRsCustFeatRuleTrgtFilter>>([])
    const [ custFeatRuleCalc, setCustFeatRuleCalc ] = useState<TbRsCustFeatRuleCalc>(cloneDeep(initTbRsCustFeatRuleCalc))
    const [ custFeatRuleCaseList, setCustFeatRuleCaseList ] = useState<Array<TbRsCustFeatRuleCase>>([])
    // SQL 입력
    const [ sqlQueryInfo, setSqlQueryInfo ] = useState<TbRsCustFeatRuleSql>(cloneDeep(initTbRsCustFeatRuleSql))
    // 승인 정보
    const [ sfSubmissionRequestData, setSfSubmissionRequestData ] = useState<SfSubmissionRequestInfo>(cloneDeep(initSfSubmissionRequestInfo))
    const [ sfSubmissionApprovalList, setSfSubmissionApprovalList ] = useState<Array<SfSubmissionApproval>>(cloneDeep([initSfSubmissionApproval]))


    const [ isOpenSubmissionRequestPop, setIsOpenSubmissionRequestPop ] = useState<boolean>(false)

    useEffect(() => {
      // 초기 상세 정보 조회 API CALL
      initCustFeatRule()
      retrieveCustFeatRuleInfos()
    }, [])

    const initCustFeatRule = () => {
      setFeatureInfo((state: FeatureInfo) => {
        let rtn = cloneDeep(state)
        rtn = cloneDeep(initSelfFeatureInfo)
        return rtn
      })
    }
    // modal 확인/취소 이벤트
    const onConfirm = () => {
      if (modalType === ModalType.CONFIRM) {
        if (regType === "cancel") {
          cancelRequestSubmission()
        }
      }
      setIsOpenConfirmModal(false)
    }

    const onCancel = () => {
      setIsOpenConfirmModal(false)
    }

    useEffect(() => {
      setFeatureTempInfo(cloneDeep(featureInfo.featureTemp))
      setTargetList(cloneDeep(featureInfo.tbRsCustFeatRuleTrgtList))
      setTrgtFilterList(cloneDeep(featureInfo.tbRsCustFeatRuleTrgtFilterList))
      setCustFeatRuleCalc(cloneDeep(featureInfo.tbRsCustFeatRuleCalc))
      setCustFeatRuleCaseList(cloneDeep(featureInfo.tbRsCustFeatRuleCaseList))
      setSqlQueryInfo(cloneDeep(featureInfo.tbRsCustFeatRuleSql))

      if (featureInfo.tbRsCustFeatRule.submissionStatus !== "") {
        retrieveSubmission1()
      }

    }, [featureInfo])

    useEffect(() => {
      // 계산식 validation을 위한 대상 list 추출
      let fList = []
      for (let i = 0; i < targetList.length; i++) {
        let t = i + 1
        fList.push(`T${t}`)
      }
      setFormulaTrgtList(fList)
    }, [targetList])

    const onClickPageMovHandler = (pageNm: string) => {
        if (pageNm === selfFeatPgPpNm.LIST) {
          navigate('..')
        } else if (pageNm === selfFeatPgPpNm.EDIT) {
          navigate(`../${pageNm}`, { state: featureInfo })
        } else if (pageNm === selfFeatPgPpNm.SUBINFO || pageNm === selfFeatPgPpNm.SUBMCFRM) {
          setIsOpenSubmissionRequestPop(true)
        } else if (pageNm === selfFeatPgPpNm.SUB_CANCEL) {
          console.log("요청 취소")
          setModalType(ModalType.CONFIRM)
          setRegType("cancel")
          setConfirmModalTit(ModalTitCont.SUBMISSION_CANCEL.title)
          setConfirmModalCont(ModalTitCont.SUBMISSION_CANCEL.context)
          setIsOpenConfirmModal(true)
        } else {
          navigate(`../${pageNm}`)
        }
    }
    
    const retrieveSubmission1 = () => {
      /*
        Method      :: GET
        Url         :: /api/v1/submissions/${submissionId}
        path param  :: submissionId
        query param :: 
        body param  :: 
      */
      let config = cloneDeep(initConfig)
      config.isLoarding = true
      let request = cloneDeep(initApiRequest)
      request.method = Method.GET
      let submissionId = ""
      request.url = `/api/v1/submissions/${submissionId}`
      console.log("[retrieveSubmission1] Request  :: ", request)

      let response = cloneDeep(initCommonResponse)
      //response = await callApi(request)
      console.log("[retrieveSubmission1] Response :: ", response)
      if (featureInfo.tbRsCustFeatRule.submissionStatus !== "") {
        setSfSubmissionRequestData((state: SfSubmissionRequestInfo) => {
          let rtn = cloneDeep(state)
          rtn.submissionNo = "SUB_00000001"
          rtn.requesterName = "이두나"
          rtn.status = featureInfo.tbRsCustFeatRule.submissionStatus
          rtn.requestDate = "2023-11-07 11:22:33"
          rtn.title = "승인해주세요."
          rtn.content = "승인부탁드립니다."
          return rtn
        })
        setSfSubmissionApprovalList((state: Array<SfSubmissionApproval>) => {
          let rtn = []//cloneDeep(state)
          for (let i = 0; i < 3; i++) {
            let approval: SfSubmissionApproval = cloneDeep(initSfSubmissionApproval)
            approval.approver = `결재자${i + 1}`
            approval.approvalSequence = i + 1
            if (approval.approvalSequence === 1) {
              approval.approvalSequenceNm = aprvSeqNm.FIRST
            } else if (approval.approvalSequence === 2) {
              approval.approvalSequenceNm = aprvSeqNm.SECOND
            } else if (approval.approvalSequence === 3) {
              approval.approvalSequenceNm = aprvSeqNm.LAST
            }
            rtn.push(approval)
          }
          return rtn
        })
      }
    }

    const retrieveCustFeatRuleInfos = () => {
      /*
        Method      :: GET
        Url         :: /api/v1/customerfeatures
        path param  :: {custFeatRuleId}
        query param :: 
        body param  :: 
      */
      setFeatureInfo((state: FeatureInfo) => {
        let rtn = cloneDeep(state)
        let tbRsCustFeatRule : TbRsCustFeatRule = Object.assign(cloneDeep(initTbRsCustFeatRule), cloneDeep(location.state))
        rtn.tbRsCustFeatRule = tbRsCustFeatRule

        let tbRsCustFeatRuleTrgtList = []
        let tbRsCustFeatRuleTrgt: TbRsCustFeatRuleTrgt = Object.assign(
          cloneDeep(initTbRsCustFeatRuleTrgt), 
          {
            columnName:"속성컬럼논리명1",
            divisionCode:"ATTR",
            tableName:"featureAttrTable1",
            targetId:"featureAttrTable1_202392593229538",
          }
        )
        tbRsCustFeatRuleTrgtList.push(tbRsCustFeatRuleTrgt)
        tbRsCustFeatRuleTrgt = Object.assign(
          cloneDeep(initTbRsCustFeatRuleTrgt), 
          {
            columnName:"컬럼 논리명2",
            divisionCode:"BEHV",
            tableName:"featureBehvTable1",
            targetId:"featureBehvTable1_2023925124157637"
          }
        )
        tbRsCustFeatRuleTrgtList.push(tbRsCustFeatRuleTrgt)
        rtn.tbRsCustFeatRuleTrgtList = tbRsCustFeatRuleTrgtList
        
        let tbRsCustFeatRuleTrgtFilterList = []
        let tbRsCustFeatRuleTrgtFilter: TbRsCustFeatRuleTrgtFilter = Object.assign(
          cloneDeep(initTbRsCustFeatRuleTrgtFilter), 
          {
            columnName:"속성컬럼논리명1",
            tableName:"featureAttrTable1",
            targetId:"featureAttrTable1_202392593229538",
          }
        )
        tbRsCustFeatRuleTrgtFilterList.push(tbRsCustFeatRuleTrgtFilter)
        tbRsCustFeatRuleTrgtFilter = Object.assign(
          cloneDeep(initTbRsCustFeatRuleTrgtFilter), 
          {
            columnName:"컬럼 논리명2",
            tableName:"featureBehvTable1",
            function:"NVL",
            targetId:"featureBehvTable1_2023925124157637",
          }
        )
        tbRsCustFeatRuleTrgtFilterList.push(tbRsCustFeatRuleTrgtFilter)
        rtn.tbRsCustFeatRuleTrgtFilterList = tbRsCustFeatRuleTrgtFilterList

        let tbRsCustFeatRuleCalc: TbRsCustFeatRuleCalc = Object.assign(
          cloneDeep(initTbRsCustFeatRuleCalc),
          {
            formula: "T1",
          }
        )
        rtn.tbRsCustFeatRuleCalc = tbRsCustFeatRuleCalc

        let tbRsCustFeatRuleCaseList = []
        let tbRsCustFeatRuleCase: TbRsCustFeatRuleCase = Object.assign(
          cloneDeep(initTbRsCustFeatRuleCase), 
          {
            whenYn: "Y",
            targetFormula: "T1",
            operator: "",
          }
        )
        tbRsCustFeatRuleCaseList.push(tbRsCustFeatRuleCase)
        tbRsCustFeatRuleCase = Object.assign(
          cloneDeep(initTbRsCustFeatRuleCase), 
          {
            whenYn: "N",
          }
        )
        tbRsCustFeatRuleCaseList.push(tbRsCustFeatRuleCase)
        rtn.tbRsCustFeatRuleCaseList = tbRsCustFeatRuleCaseList

        return rtn
      })
    }

    const cancelRequestSubmission = async () => {
      /*
        승인 요청 취소
        Method      :: PUT
        Url         :: /api/v1/users/${email}/submissions/${submissionId}/cancel
        path param  :: email, submissionId
        query param :: 
        body param  :: 
      */
      let config = cloneDeep(initConfig)
      config.isLoarding = true
      let request = cloneDeep(initApiRequest)
      request.method = Method.PUT
      let email = ""
      let submissionId = ""
      request.url = `/api/v1/users/${email}/submissions/${submissionId}/cancel`
      console.log("[CancelRequestSubmission] Request  :: ", request)

      let response = cloneDeep(initCommonResponse)
      //response = await callApi(request)
      console.log("[CancelRequestSubmission] Response :: ", response)
    }

    const DetailBtnComponent = () => {
      if (
        location.state.submissionStatus === ""
        || location.state.submissionStatus === subFeatStatus.SAVE
        || location.state.submissionStatus === subFeatStatus.REJT
      ) {
        // 등록(품의는 저장 x) / 품의 저장 / 반려
        return (
          <Stack justifyContent="End" gap="SM" className="width-100">
            <Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.LIST)}>
              목록
            </Button>
            <Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.EDIT)}>
              수정
            </Button>
            <Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.SUBMCFRM)}>
              승인 정보
            </Button>
          </Stack>
        )
      } else if (location.state.submissionStatus === subFeatStatus.REQ) {
        // 승인 요청
        return (
          <Stack justifyContent="End" gap="SM" className="width-100">
            <Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.LIST)}>
              목록
            </Button>
            <Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.SUB_CANCEL)}>
              요청 취소
            </Button>
          </Stack>
        )
      } else if (location.state.submissionStatus === subFeatStatus.IN_APRV) {
        // 결재 진행
        return (
          <Stack justifyContent="End" gap="SM" className="width-100">
            <Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.LIST)}>
              목록
            </Button>
            <Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.SUBMCFRM)}>
              승인 정보
            </Button>
          </Stack>
        )
      } else if (location.state.submissionStatus === subFeatStatus.APRV) {
        // 승인 완료
        return (
          <Stack justifyContent="End" gap="SM" className="width-100">
            <Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.LIST)}>
              목록
            </Button>
            <Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.SUBMCFRM)}>
              승인 정보
            </Button>
          </Stack>
        )
      } else {
        return (
          <Stack justifyContent="End" gap="SM" className="width-100">
            <Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.LIST)}>
              목록
            </Button>
          </Stack>
        )
      }
    }

    return (
      <Stack direction="Vertical" gap="MD" justifyContent="Between" className='height-100'>
      {/* 정보 영역 */}
        {sfSubmissionRequestData.submissionNo !== "" && 
        <>
        <Typography variant="h2">승인 정보</Typography>
        <Stack direction="Vertical" className="width-100" gap="MD">
            <HorizontalTable className="width-100">
                <TR>
                    <TH colSpan={1} align="right">
                    승인 번호
                    </TH>
                    <TD colSpan={2}>
                        {sfSubmissionRequestData.submissionNo}
                    </TD>
                    <TH colSpan={1} align="right">
                    요청자
                    </TH>
                    <TD colSpan={2}>
                        {sfSubmissionRequestData.requesterName}
                    </TD>
                </TR>
                <TR>
                    <TH colSpan={1} align="right">
                    승인 유형
                    </TH>
                    <TD colSpan={2}>
                        {sfSubmissionRequestData.type}
                    </TD>
                    <TH colSpan={1} align="right">
                    승인 상태
                    </TH>
                    <TD colSpan={2}>
                        {sfSubmissionRequestData.status}
                    </TD>
                </TR>
                <TR>
                    <TH colSpan={1} align="right">
                    요청 일시
                    </TH>
                    <TD colSpan={5.01}>
                        {sfSubmissionRequestData.requestDate}
                    </TD>
                </TR>
                <TR>
                    <TH colSpan={1} align="right">
                    승인 제목
                    </TH>
                    <TD colSpan={5.01}>
                        {sfSubmissionRequestData.title}
                    </TD>
                </TR>
                <TR>
                    <TH colSpan={1} align="right">
                    승인 내용
                    </TH>
                    <TD colSpan={5.01}>
                        {sfSubmissionRequestData.content}
                    </TD>
                </TR>
            </HorizontalTable>

            <Stack justifyContent="Between" className="width-100">
                <Typography variant="h4">결재선</Typography>
            </Stack>
            <VerticalTable
                columns={columns}
                rows={sfSubmissionApprovalList}
                enableSort={false}
            />
        </Stack>
        </>
        }

        <Stack direction="Vertical" gap="MD">
            {/* 기본 정보 */}
            <Typography variant="h4">Feature 기본 정보</Typography>
              <HorizontalTable>
                <TR>
                  <TH colSpan={1} align="right">대구분</TH>
                  <TD colSpan={2} align='left'>
                    {featureInfo.tbRsCustFeatRule && `대구분`}
                  </TD>
                  <TH colSpan={1} align="right">중구분</TH>
                  <TD colSpan={2} align='left'>
                    {featureInfo.tbRsCustFeatRule && `중구분`}
                  </TD>
                </TR>
                <TR>
                  <TH colSpan={1} align="right">Feature ID</TH>
                  <TD colSpan={2} align='left'>
                    {featureInfo.tbRsCustFeatRule && featureInfo.tbRsCustFeatRule.id}
                  </TD>
                  <TH colSpan={1} align="right">Feature 타입</TH>
                  <TD colSpan={2} align='left'>
                    {featureInfo.tbRsCustFeatRule && `Self Feature`}
                  </TD>
                </TR>
                <TR>
                  <TH colSpan={1} align="right">한글명</TH>
                  <TD colSpan={2} align='left'>
                    {featureInfo.tbRsCustFeatRule && `한글명`}
                  </TD>
                  <TH colSpan={1} align="right">영문명</TH>
                  <TD colSpan={2} align='left'>
                    {featureInfo.tbRsCustFeatRule && featureInfo.tbRsCustFeatRule.name}
                  </TD>
                </TR>
                <TR>
                  <TH colSpan={1} align="right">Feature 정의</TH>
                  <TD colSpan={5.01} align='left'>
                    {featureInfo.tbRsCustFeatRule && featureInfo.tbRsCustFeatRule.description}
                  </TD>
                </TR>
                <TR>
                  <TH colSpan={1} align="right">산출 단위</TH>
                  <TD colSpan={2} align='left'>
                    {featureInfo.tbRsCustFeatRule && `산출 단위`}
                  </TD>
                  <TH colSpan={1} align="right">카테고리</TH>
                  <TD colSpan={2} align='left'>
                    {featureInfo.tbRsCustFeatRule && featureInfo.tbRsCustFeatRule.category}
                  </TD>
                </TR>
                <TR>
                  <TH colSpan={1} align="right">산출 로직</TH>
                  <TD colSpan={5.01} align='left'>
                    {featureInfo.tbRsCustFeatRule && `산출 로직`}
                  </TD>
                </TR>
                <TR>
                  <TH colSpan={1} align="right">비고</TH>
                  <TD colSpan={5.01} align='left'>
                    {featureInfo.tbRsCustFeatRule && `비고`}
                  </TD>
                </TR>
              </HorizontalTable>
            {/* 기본 정보 */}

            {/* 대상 선택 */}
            <Typography variant="h4">대상 선택</Typography>
              {/* drag && drop 영역*/}
              <Stack 
                  direction="Horizontal"
                  gap="MD"
                  justifyContent="Between"
                  className='dropChild-100per'
              >
                <DndProvider backend={HTML5Backend}>
                  {/* drop 영역 */}
                  <DropList 
                    featStatus={selfFeatPgPpNm.DETL}
                    targetList={targetList} 
                    trgtFilterList={trgtFilterList} 
                    setTargetList={setTargetList} 
                    setTrgtFilterList={setTrgtFilterList} 
                  />
                  {/* drop 영역 */}

                  {/* drag 영역 */}
                  {/* drag 영역 */}
                </DndProvider>
              </Stack>
            {/* 대상 선택 */}

            {/* 계산식 */}
            {formulaTrgtList.length > 0 &&
              <CalcValid
                featStatus={selfFeatPgPpNm.DETL}
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
          {/* 
            등록 / 품의 저장 -> 목록,수정,승인요청 버튼
            승인요청/결제진행/승인완료/반려 -> 목록,승인 확인 버튼
          */}
          <DetailBtnComponent/>
        </Stack>
      {/* 버튼 영역 */}

      {/* 팝업 */}
        <SubmissionRequestPop
          isOpen={isOpenSubmissionRequestPop}
          onClose={(isOpen) => setIsOpenSubmissionRequestPop(isOpen)}
          featureInfo={featureInfo}
        />
      {/* 팝업 */}

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
  export default SelfFeatureDetail;