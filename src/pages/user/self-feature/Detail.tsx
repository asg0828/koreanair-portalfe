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
    TextField,
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
  protoTypeFeatureTemp,
  protoTypeFeatureTempApproved,
  protoTypeFeatureTempInApproval,
  protoTypeFeatureTempRejected,
  protoTypeFeatureTempSaved,
  protoTypeTbRsCustFeatRuleCalc,
  protoTypeTbRsCustFeatRuleTrgtFilterList,
  protoTypeTbRsCustFeatRuleTrgtList,
} from './data';
import {
  aprvSeqNm,
  sfSubmissionApprovalListColumns as columns, 
  initSfSubmissionApproval, 
  initSfSubmissionRequestInfo,
  protoTypeSfSubmissionApprovalListApproved,
  protoTypeSfSubmissionApprovalListInApproval,
  protoTypeSfSubmissionApprovalListRejected,
  protoTypeSfSubmissionApprovalListSaved,
  protoTypeSfSubmissionRequestInfoApproved,
  protoTypeSfSubmissionRequestInfoInApproval,
  protoTypeSfSubmissionRequestInfoRejected,
  protoTypeSfSubmissionRequestInfoSaved,
  sfSubmissionStatusOption,
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
import FeatQueryRsltButton from '@/components/self-feature/FeatQueryRsltButton';

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
        } else if (regType === "approval") {
          approveSubmissionApproval()
        } else if (regType === "reject") {
          //cancelRequestSubmission()
          // 팝업 오픈 - 반려 사유 작성 팝업
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
          setModalType(ModalType.CONFIRM)
          setRegType("cancel")
          setConfirmModalTit(ModalTitCont.SUBMISSION_CANCEL.title)
          setConfirmModalCont(ModalTitCont.SUBMISSION_CANCEL.context)
          setIsOpenConfirmModal(true)
        } else if (pageNm === selfFeatPgPpNm.SUB_APRV) {
          setModalType(ModalType.CONFIRM)
          setRegType("approval")
          setConfirmModalTit(ModalTitCont.SUBMISSION_APPROVAL.title)
          setConfirmModalCont(ModalTitCont.SUBMISSION_APPROVAL.context)
          setIsOpenConfirmModal(true)
        } else if (pageNm === selfFeatPgPpNm.SUB_REJT) {
          setModalType(ModalType.CONFIRM)
          setRegType("reject")
          setConfirmModalTit(ModalTitCont.SUBMISSION_REJECT.title)
          setConfirmModalCont(ModalTitCont.SUBMISSION_REJECT.context)
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
        let featureStatus = featureInfo.tbRsCustFeatRule.submissionStatus
        let requestInfo: SfSubmissionRequestInfo = cloneDeep(initSfSubmissionRequestInfo)
        let approvalList: Array<SfSubmissionApproval> = cloneDeep([initSfSubmissionApproval])

        if (featureStatus === subFeatStatus.SAVE) {
          requestInfo = protoTypeSfSubmissionRequestInfoSaved
          approvalList = protoTypeSfSubmissionApprovalListSaved
        } else if (featureStatus === subFeatStatus.IN_APRV) {
          requestInfo = protoTypeSfSubmissionRequestInfoInApproval
          approvalList = protoTypeSfSubmissionApprovalListInApproval
        } else if (featureStatus === subFeatStatus.APRV) {
          requestInfo = protoTypeSfSubmissionRequestInfoApproved
          approvalList = protoTypeSfSubmissionApprovalListApproved
        } else if (featureStatus === subFeatStatus.REJT) {
          requestInfo = protoTypeSfSubmissionRequestInfoRejected
          approvalList = protoTypeSfSubmissionApprovalListRejected
        }
        console.log("requestInfo :: ", requestInfo)
        console.log("approvalList :: ", approvalList)
        setSfSubmissionRequestData((state: SfSubmissionRequestInfo) => {
          return requestInfo
        })
        setSfSubmissionApprovalList((state: Array<SfSubmissionApproval>) => {
          /*
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
          */
          return approvalList
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
        // Feature 기본정보
        let tbRsCustFeatRule : TbRsCustFeatRule = Object.assign(cloneDeep(initTbRsCustFeatRule), cloneDeep(location.state))
        rtn.tbRsCustFeatRule = tbRsCustFeatRule
        // Feature temp(포탈동기화정보)
        if (tbRsCustFeatRule.id === "CFR_00000001") {
          rtn.featureTemp = protoTypeFeatureTemp
        } else if (tbRsCustFeatRule.id === "CFR_00000002") {
          rtn.featureTemp = protoTypeFeatureTempSaved
        } else if (tbRsCustFeatRule.id === "CFR_00000004") {
          rtn.featureTemp = protoTypeFeatureTempInApproval
        } else if (tbRsCustFeatRule.id === "CFR_00000005") {
          rtn.featureTemp = protoTypeFeatureTempApproved
        } else if (tbRsCustFeatRule.id === "CFR_00000006") {
          rtn.featureTemp = protoTypeFeatureTempRejected
        } else {
          rtn.featureTemp = cloneDeep(initFeatureTemp)
        }
          
        /*
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
        */
        rtn.tbRsCustFeatRuleTrgtList = protoTypeTbRsCustFeatRuleTrgtList
        /*
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
        */
        rtn.tbRsCustFeatRuleTrgtFilterList = protoTypeTbRsCustFeatRuleTrgtFilterList
        /*
        let tbRsCustFeatRuleCalc: TbRsCustFeatRuleCalc = Object.assign(
          cloneDeep(initTbRsCustFeatRuleCalc),
          {
            formula: "T1/T2",
          }
        )
        */
        rtn.tbRsCustFeatRuleCalc = protoTypeTbRsCustFeatRuleCalc

        let tbRsCustFeatRuleCaseList: Array<TbRsCustFeatRuleCase> = []
        /*
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
        */
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

    const approveSubmissionApproval = async () => {
      /*
        승인
        Method      :: PUT
        Url         :: /api/v1/users/${email}/submission-approvals/${approvalId}/approve
        path param  :: email, approvalId
        query param :: 
        body param  :: { comment }
      */
      let config = cloneDeep(initConfig)
      config.isLoarding = true
      let request = cloneDeep(initApiRequest)
      request.method = Method.PUT
      let email = ""
      let approvalId = ""
      request.url = `/api/v1/users/${email}/submissions/${approvalId}/cancel`
      request.params!.bodyParams = { comment: "" }
      console.log("[approveSubmissionApproval] Request  :: ", request)

      let response = cloneDeep(initCommonResponse)
      //response = await callApi(request)
      console.log("[approveSubmissionApproval] Response :: ", response)
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
              승인 요청서
            </Button>
          </Stack>
        )
      } else if (location.state.submissionStatus === subFeatStatus.IN_APRV) {
        // 결재 진행
        if (location.state.id.includes('ADM')) {
          return (
            <Stack justifyContent="End" gap="SM" className="width-100">
              <Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.LIST)}>
                목록
              </Button>
              <Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.SUB_APRV)}>
                승인
              </Button>
              <Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.SUB_REJT)}>
                반려
              </Button>
            </Stack>
          )
        } else {
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
        }
        /*
        return (
          <Stack justifyContent="End" gap="SM" className="width-100">
            <Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.LIST)}>
              목록
            </Button>
            <Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.SUBMCFRM)}>
              승인 요청서
            </Button>
          </Stack>
        )  
        */
      } else if (location.state.submissionStatus === subFeatStatus.APRV) {
        // 승인 완료
        return (
          <Stack justifyContent="End" gap="SM" className="width-100">
            <Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.LIST)}>
              목록
            </Button>
            <Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.SUBMCFRM)}>
            승인 요청서
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
      {/* 상단 버튼 영역 */}
        <FeatQueryRsltButton />
        
      {/* 정보 영역 */}
        {sfSubmissionRequestData.submissionNo !== "" && 
        <>
        <Typography variant="h2">승인 요청서 정보</Typography>
        <Stack direction="Vertical" className="width-100" gap="MD">
            <HorizontalTable className="width-100">
                <TR>
                    <TH colSpan={1} align="right">
                    승인 번호
                    </TH>
                    <TD colSpan={2} align="left">
                        {sfSubmissionRequestData.submissionNo}
                    </TD>
                    <TH colSpan={1} align="right">
                    요청자
                    </TH>
                    <TD colSpan={2} align="left">
                        {sfSubmissionRequestData.requesterName}
                    </TD>
                </TR>
                <TR>
                    <TH colSpan={1} align="right">
                    승인 유형
                    </TH>
                    <TD colSpan={2} align="left">
                        {sfSubmissionRequestData.type}
                    </TD>
                    <TH colSpan={1} align="right">
                    승인 상태
                    </TH>
                    <TD colSpan={2} align="left">
                        {featureInfo.tbRsCustFeatRule.submissionStatusNm}
                        {/* {sfSubmissionRequestData.status === sfSubmissionStatusOption[1].value && sfSubmissionStatusOption[1].text}
                        {sfSubmissionRequestData.status === sfSubmissionStatusOption[2].value && sfSubmissionStatusOption[2].text}
                        {sfSubmissionRequestData.status === sfSubmissionStatusOption[3].value && sfSubmissionStatusOption[3].text}
                        {sfSubmissionRequestData.status === sfSubmissionStatusOption[4].value && sfSubmissionStatusOption[4].text}
                        {sfSubmissionRequestData.status === sfSubmissionStatusOption[5].value && sfSubmissionStatusOption[5].text} */}
                    </TD>
                </TR>
                <TR>
                    <TH colSpan={1} align="right">
                    요청 일시
                    </TH>
                    <TD colSpan={5.01} align="left">
                        {sfSubmissionRequestData.requestDate}
                    </TD>
                </TR>
                <TR>
                    <TH colSpan={1} align="right">
                    승인 제목
                    </TH>
                    <TD colSpan={5.01} align="left">
                        {sfSubmissionRequestData.title}
                    </TD>
                </TR>
                <TR>
                    <TH colSpan={1} align="right">
                    승인 내용
                    </TH>
                    <TD colSpan={5.01} align="left">
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
                    {featureInfo.tbRsCustFeatRule && featureInfo.featureTemp.featureLSe}
                  </TD>
                  <TH colSpan={1} align="right">중구분</TH>
                  <TD colSpan={2} align='left'>
                    {featureInfo.tbRsCustFeatRule && featureInfo.featureTemp.featureMSe}
                  </TD>
                </TR>
                <TR>
                  <TH colSpan={1} align="right">Feature ID</TH>
                  <TD colSpan={2} align='left'>
                    {featureInfo.featureTemp && featureInfo.featureTemp.featureId}
                  </TD>
                  <TH colSpan={1} align="right">Feature 타입</TH>
                  <TD colSpan={2} align='left'>
                    {featureInfo.featureTemp && featureInfo.featureTemp.featureTyp}
                  </TD>
                </TR>
                <TR>
                  <TH colSpan={1} align="right">한글명</TH>
                  <TD colSpan={2} align='left'>
                    {featureInfo.featureTemp && featureInfo.featureTemp.featureNm}
                  </TD>
                  <TH colSpan={1} align="right">영문명</TH>
                  <TD colSpan={2} align='left'>
                    {featureInfo.featureTemp && featureInfo.featureTemp.featureEngNm}
                  </TD>
                </TR>
                <TR>
                  <TH colSpan={1} align="right">Feature 정의</TH>
                  <TD colSpan={5.01} align='left'>
                    <TextField 
                      className="width-100" 
                      multiline
                      readOnly
                      defaultValue={featureInfo.featureTemp && featureInfo.featureTemp.featureDef}
                    />
                  </TD>
                </TR>
                <TR>
                  <TH colSpan={1} align="right">산출 단위</TH>
                  <TD colSpan={2} align='left'>
                    {featureInfo.featureTemp && featureInfo.featureTemp.calcUnt}
                  </TD>
                  <TH colSpan={1} align="right">카테고리</TH>
                  <TD colSpan={2} align='left'>
                    {featureInfo.tbRsCustFeatRule && featureInfo.tbRsCustFeatRule.category}
                  </TD>
                </TR>
                <TR>
                  <TH colSpan={1} align="right">산출 로직</TH>
                  <TD colSpan={5.01} align='left'>
                    <TextField 
                      className="width-100" 
                      multiline
                      readOnly
                      defaultValue={featureInfo.featureTemp && featureInfo.featureTemp.featureFm}
                    />
                  </TD>
                </TR>
                <TR>
                  <TH colSpan={1} align="right">비고</TH>
                  <TD colSpan={5.01} align='left'>
                    {featureInfo.featureTemp && `비고`}
                  </TD>
                </TR>
              </HorizontalTable>
            {/* 기본 정보 */}

            {/* 대상 선택 */}
            {(
                featureInfo.tbRsCustFeatRule.sqlDirectInputYn === ""
              || featureInfo.tbRsCustFeatRule.sqlDirectInputYn === "N"
            ) &&
            <>
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
            </>
            }
            {featureInfo.tbRsCustFeatRule.sqlDirectInputYn === "Y" &&
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
                readOnly
                defaultValue={featureInfo.tbRsCustFeatRuleSql.sqlQuery}
              />
            </Stack>
            </>
            }
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