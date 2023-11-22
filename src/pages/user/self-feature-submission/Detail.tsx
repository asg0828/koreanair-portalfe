import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { cloneDeep } from 'lodash'

import VerticalTable from "@/components/table/VerticalTable";
import HorizontalTable from '@components/table/HorizontalTable';
import CalcValid from '@/components/self-feature/CalcValid';
import DropList from "@/components/self-feature/DropList";
import { 
    Stack,
    TR,
    TH,
    TD,
    Typography,
    TextField,
    Button,
    useToast,
} from '@components/ui'

import { 
    SfSubmissionApproval,
    SfSubmissionRequestInfo,
} from "@/models/selfFeature/FeatureSubmissionModel";
import { 
    initSfSubmissionRequestInfo,
    sfSubmissionApprovalListColumns as columns,
    initSfSubmissionApproval,
    aprvSeqNm
} from "./data";
import { 
    FeatureInfo, 
    FormulaTrgtListProps, 
    MstrSgmtTableandColMetaInfo, 
    TbRsCustFeatRuleCalc, 
    TbRsCustFeatRuleCase, 
    TbRsCustFeatRuleTrgt, 
    TbRsCustFeatRuleTrgtFilter,
} from "@/models/selfFeature/FeatureModel";
import { 
    initMstrSgmtTableandColMetaInfo,
    initSelfFeatureInfo, 
    initTbRsCustFeatRuleCalc, 
} from "../self-feature/data";
import { 
    ColDataType,
    CommonCode,
    CommonCodeInfo,
    ModalTitCont,
    ModalType,
    initApiRequest, 
    initCommonResponse, 
    initConfig, 
    selfFeatPgPpNm ,
} from "@/models/selfFeature/FeatureCommon";
import { Method, callApi } from "@/utils/ApiUtil";
import { StatusCode } from "@/models/common/CommonResponse";
import ConfirmModal from "@/components/modal/ConfirmModal";
import FeatQueryRsltButton from "@/components/self-feature/FeatQueryRsltButton";
import SubRejectPop from "@/components/self-feature-submission/popup/SubRejectPop";
import { useGetTableandColumnMetaInfoByMstrSgmtRuleId } from "@/hooks/queries/self-feature/useSelfFeatureUserQueries";
import { ValidType } from "@/models/common/Constants";
import { useCommCodes } from "@/hooks/queries/self-feature/useSelfFeatureCmmQueries";

const SfSubmissionRequestDetail = () => {

    const { toast } = useToast()
    const { data: response1, isError: isError1, refetch: refetch1 } = useGetTableandColumnMetaInfoByMstrSgmtRuleId()
    const { 
      data: cmmCodeAggrRes, 
      isError: cmmCodeAggrErr, 
      refetch: cmmCodeAggrRefetch 
  } = useCommCodes(CommonCode.STAC_CALC_TYPE)

    const navigate = useNavigate()
    const location = useLocation()

    const [ regType, setRegType ] = useState<string>('')

    const [ isOpenSubRejectPop, setIsOpenSubRejectPop ] = useState<boolean>(false)
    const [ isOpenConfirmModal, setIsOpenConfirmModal ] = useState<boolean>(false)
    const [ confirmModalTit, setConfirmModalTit ] = useState<string>('')
    const [ confirmModalCont, setConfirmModalCont ] = useState<string>('')
    const [ modalType, setModalType ] = useState<string>('')

    // 속성 및 행동 데이터
    const [ mstrSgmtTableandColMetaInfo, setMstrSgmtTableandColMetaInfo ] = useState<MstrSgmtTableandColMetaInfo>(cloneDeep(initMstrSgmtTableandColMetaInfo))

    // 승인 정보
    const [ sfSubmissionRequestData, setSfSubmissionRequestData ] = useState<SfSubmissionRequestInfo>(cloneDeep(initSfSubmissionRequestInfo))
    const [ sfSubmissionApprovalList, setSfSubmissionApprovalList ] = useState<Array<SfSubmissionApproval>>(cloneDeep([initSfSubmissionApproval]))

    // feature 정보
    const [ formulaTrgtList, setFormulaTrgtList ] = useState<Array<FormulaTrgtListProps>>([])
    const [ featureInfo, setFeatureInfo ] = useState<FeatureInfo>(cloneDeep(initSelfFeatureInfo))
    const [ targetList, setTargetList ] = useState<Array<TbRsCustFeatRuleTrgt>>([])
    const [ trgtFilterList, setTrgtFilterList ] = useState<Array<TbRsCustFeatRuleTrgtFilter>>([])
    const [ custFeatRuleCalc, setCustFeatRuleCalc ] = useState<TbRsCustFeatRuleCalc>(cloneDeep(initTbRsCustFeatRuleCalc))
    const [ custFeatRuleCaseList, setCustFeatRuleCaseList ] = useState<Array<TbRsCustFeatRuleCase>>([])

    useEffect(() => {
        getTableandColumnMetaInfoByMstrSgmtRuleId()
        retrieveCustFeatRuleInfos()
    }, [])

    // modal 확인/취소 이벤트
    const onConfirm = () => {
        if (modalType === ModalType.CONFIRM) {
            if (regType === "approval") {
                approveSubmissionApproval()
            }
        }
        setIsOpenConfirmModal(false)
    }

    const onCancel = () => {
        setIsOpenConfirmModal(false)
    }

    const getTableandColumnMetaInfoByMstrSgmtRuleId = () => {
      if (isError1 || response1?.successOrNot === 'N') {
        toast({
        type: ValidType.ERROR,
        content: '조회 중 에러가 발생했습니다.',
        })
      } else {
        if (response1 && (response1.statusCode === StatusCode.SUCCESS)) {
          setMstrSgmtTableandColMetaInfo(cloneDeep(response1.result))
        }
      }
    }

    useEffect(() => {
        // 계산식 validation을 위한 대상 list 추출
        let fList = []
        for (let i = 0; i < targetList.length; i++) {
          let t = { targetId: `T${i+1}`, dataType: "" }
          let dataType = targetList[i].targetDataType
          cmmCodeAggrRes?.result.map((option: CommonCodeInfo) => {
            if (option.cdv === targetList[i].operator) {
                dataType = option.attr1
                if (dataType === "") {
                    dataType = targetList[i].targetDataType
                }
            }
            return option
          })
          t.dataType = dataType
    
          fList.push(t)
        }
        setFormulaTrgtList(fList)
    }, [targetList])

    const retrieveCustFeatRuleInfos = async () => {
        /*
          Method      :: GET
          Url         :: /api/v1/customerfeatures
          path param  :: {custFeatRuleId}
          query param :: 
          body param  :: 
        */
        let config = cloneDeep(initConfig)
        config.isLoarding = true
        let request = cloneDeep(initApiRequest)
        request.method = Method.GET
        request.url = `/api/v1/customerfeatures/${location.state.id}`
        console.log("[retrieveCustFeatRuleInfos] Request  :: ", request)
    
        let response = cloneDeep(initCommonResponse)
        response = await callApi(request)
        console.log("[retrieveCustFeatRuleInfos] Response header       :: ", response.header)
        console.log("[retrieveCustFeatRuleInfos] Response statusCode   :: ", response.statusCode)
        console.log("[retrieveCustFeatRuleInfos] Response status       :: ", response.status)
        console.log("[retrieveCustFeatRuleInfos] Response successOrNot :: ", response.successOrNot)
        console.log("[retrieveCustFeatRuleInfos] Response result       :: ", response.result)
    
        if (response.statusCode === StatusCode.SUCCESS) {
          setFeatureInfo(cloneDeep(response.result))
          retrieveSubmissionList()
        }
    }

    const retrieveSubmissionList = async () => {
        /*
            Method      :: GET
            Url         :: /api/v1/submissions
            path param  :: submissionId
            query param :: type=&status=&referenceNo=&submissionNo=&requester=&title=&titleLike=&requestDateFrom=&requestDateTo=&approvalCompletionDateFrom=&approvalCompletionDateTo=
            body param  :: 
        */
        let config = cloneDeep(initConfig)
        config.isLoarding = true
        let request = cloneDeep(initApiRequest)
        request.method = Method.GET
        request.url = `/api/v1/submissions`
        request.params!.queryParams = { type: "CustomerFeature", referenceNo: location.state.id }
        console.log("[retrieveSubmissionList] Request  :: ", request)

        let response = cloneDeep(initCommonResponse)
        response = await callApi(request)
        console.log("[retrieveSubmissionList] Response header       :: ", response.header)
        console.log("[retrieveSubmissionList] Response statusCode   :: ", response.statusCode)
        console.log("[retrieveSubmissionList] Response status       :: ", response.status)
        console.log("[retrieveSubmissionList] Response successOrNot :: ", response.successOrNot)
        console.log("[retrieveSubmissionList] Response result       :: ", response.result)

        if (response.statusCode === StatusCode.SUCCESS) {
            if (response.result.length > 0) {
                retrieveSubmissionInfo(response.result[0].id)
            }
        }

    }

    const retrieveSubmissionInfo = async (submissionNo: string) => {
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
        request.url = `/api/v1/submissions/${submissionNo}`
        console.log("[retrieveSubmission1] Request  :: ", request)

        let response = cloneDeep(initCommonResponse)
        response = await callApi(request)
        console.log("[retrieveSubmission1] Response header       :: ", response.header)
        console.log("[retrieveSubmission1] Response statusCode   :: ", response.statusCode)
        console.log("[retrieveSubmission1] Response status       :: ", response.status)
        console.log("[retrieveSubmission1] Response successOrNot :: ", response.successOrNot)
        console.log("[retrieveSubmission1] Response result       :: ", response.result)
        if (response.statusCode === StatusCode.SUCCESS) {

        if (response.result.submission) setSfSubmissionRequestData(cloneDeep(response.result.submission))

        if (response.result.approvals.length > 0) {
            setSfSubmissionApprovalList(() => {
                let rtn = cloneDeep(response.result.approvals)
                rtn = rtn.map((approval: SfSubmissionApproval) => { 
                    if (approval.approvalSequence === 1) approval.approvalSequenceNm = aprvSeqNm.FIRST
                    else if (approval.approvalSequence === 2) approval.approvalSequenceNm = aprvSeqNm.SECOND
                    else if (approval.approvalSequence === 3) approval.approvalSequenceNm = aprvSeqNm.LAST
                    return approval
                })
                return rtn
            })
        }
        }
    }

    const onClickPageMovHandler = (pageNm: string): void => {
        
        if (pageNm === selfFeatPgPpNm.LIST) {
            navigate('..')
        } else if (pageNm === selfFeatPgPpNm.SUB_APRV) {
            // 반려 처리
            setModalType(ModalType.CONFIRM)
            setRegType("approval")
            setConfirmModalTit(ModalTitCont.SUBMISSION_APPROVAL.title)
            setConfirmModalCont(ModalTitCont.SUBMISSION_APPROVAL.context)
            setIsOpenConfirmModal(true)
        } else if (pageNm === selfFeatPgPpNm.SUB_REJT) {
            // 반려 팝업
            setIsOpenSubRejectPop((prevState) => !prevState)
        }
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

    return (
        <>
        <Stack direction="Vertical" gap="MD" justifyContent="Between" className='height-100'>
            {/* 상단 버튼 영역 */}
            <FeatQueryRsltButton
                custFeatRuleId={location.state.id}
            />
            {/* 정보 영역 */}
            <Typography variant="h2">승인 정보</Typography>
            <Stack direction="Vertical" className="width-100" gap="MD">
                <HorizontalTable className="width-100">
                    <TR>
                        <TH colSpan={1} align="right">
                        승인 번호
                        </TH>
                        <TD colSpan={2}>
                            {sfSubmissionRequestData && sfSubmissionRequestData.submissionNo}
                        </TD>
                        <TH colSpan={1} align="right">
                        요청자
                        </TH>
                        <TD colSpan={2}>
                            {sfSubmissionRequestData && sfSubmissionRequestData.requesterName}
                        </TD>
                    </TR>
                    <TR>
                        <TH colSpan={1} align="right">
                        승인 유형
                        </TH>
                        <TD colSpan={2}>
                            {sfSubmissionRequestData && sfSubmissionRequestData.type}
                        </TD>
                        <TH colSpan={1} align="right">
                        승인 상태
                        </TH>
                        <TD colSpan={2}>
                            {sfSubmissionRequestData && sfSubmissionRequestData.status}
                        </TD>
                    </TR>
                    <TR>
                        <TH colSpan={1} align="right">
                        요청 일시
                        </TH>
                        <TD colSpan={5}>
                            {sfSubmissionRequestData && sfSubmissionRequestData.requestDate}
                        </TD>
                    </TR>
                </HorizontalTable>
            </Stack>
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
                    <TD colSpan={5} align='left'>
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
                    <TD colSpan={5} align='left'>
                    {featureInfo.tbRsCustFeatRule && `산출 로직`}
                    </TD>
                </TR>
                <TR>
                    <TH colSpan={1} align="right">비고</TH>
                    <TD colSpan={5} align='left'>
                    {featureInfo.tbRsCustFeatRule && `비고`}
                    </TD>
                </TR>
            </HorizontalTable>
            {/* 기본 정보 */}

            {/* 대상 선택 */}
            {(regType && (regType === selfFeatPgPpNm.RULE_REG) && targetList.length > 0) &&
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
                        attributes={mstrSgmtTableandColMetaInfo.attributes} 
                        behaviors={mstrSgmtTableandColMetaInfo.behaviors}
                        setFormulaTrgtList={setFormulaTrgtList}
                    />
                    {/* drop 영역 */}
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
                <TextField className="width-100 height-100" multiline readOnly defaultValue="SQL 입력 영역" />
                </Stack>
            </>
            }
            {/* SQL 입력 */}

            {/* 계산식 */}
            {(regType && (regType === selfFeatPgPpNm.RULE_REG) && (formulaTrgtList.length > 0)) &&
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
            {/* 결재선 영역 */}
            <Stack justifyContent="Between" className="width-100">
                <Typography variant="h4">결재선</Typography>
            </Stack>
            <VerticalTable
                columns={columns}
                rows={sfSubmissionApprovalList}
                enableSort={false}
            />
            {/* 결재선 영역 */}
            {/* 버튼 영역 */}
            <Stack justifyContent="End" gap="SM" className="width-100">
                <Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.LIST)}>
                목록
                </Button>
                <Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.SUB_APRV)}>
                승인
                </Button>
                <Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.SUB_REJT)}>
                반려
                </Button>
            </Stack>
            {/* 버튼 영역 */}
        </Stack>
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
        {/* Confirm 모달 */}
        {/* 반려 팝업 */}
        <SubRejectPop 
            isOpen={isOpenSubRejectPop} 
            onClose={(isOpen) => setIsOpenSubRejectPop(isOpen)}
            sfSubmissionApprovalList={sfSubmissionApprovalList}
            setSfSubmissionApprovalList={setSfSubmissionApprovalList}
        />
        {/* 반려 팝업 */}
        </>
    )
}

export default SfSubmissionRequestDetail