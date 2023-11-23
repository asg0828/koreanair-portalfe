import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { cloneDeep } from "lodash";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import HorizontalTable from '@components/table/HorizontalTable';
import VerticalTable from '@/components/table/VerticalTable';
import DropList from '@/components/self-feature/DropList';
import CalcValid from '@/components/self-feature/CalcValid';
import {
	TR,
	TH,
	TD,
	Button,
	Stack,
	Typography,
	TextField,
	useToast,
} from '@components/ui';

import {
	Attribute,
	Behavior,
	FeatureInfo,
	FeatureTemp,
	FormulaTrgtListProps,
	MstrSgmtTableandColMetaInfo,
	TbCoMetaTblClmnInfo,
	TbRsCustFeatRuleCalc,
	TbRsCustFeatRuleCase,
	TbRsCustFeatRuleSql,
	TbRsCustFeatRuleTrgt,
	TbRsCustFeatRuleTrgtFilter,
} from '@/models/selfFeature/FeatureModel';
import {
	divisionTypes,
	initFeatureTemp,
	initMstrSgmtTableandColMetaInfo,
	initSelfFeatureInfo,
	initTbRsCustFeatRuleCalc,
	initTbRsCustFeatRuleSql,
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
	ColDataType,
	CommonCodeInfo,
	CommonCode,
} from '@/models/selfFeature/FeatureCommon';
import {
	SfSubmissionApproval,
	SfSubmissionRequestInfo
} from '@/models/selfFeature/FeatureSubmissionModel';
import { Method, callApi } from '@/utils/ApiUtil';
import ConfirmModal from '@/components/modal/ConfirmModal';
import FeatQueryRsltButton from '@/components/self-feature/FeatQueryRsltButton';
import { StatusCode } from '@/models/common/CommonResponse';
import { useGetTableandColumnMetaInfoByMstrSgmtRuleId } from '@/hooks/queries/self-feature/useSelfFeatureUserQueries';
import { ValidType } from '@/models/common/Constants';
import { useCommCodes } from '@/hooks/queries/self-feature/useSelfFeatureCmmQueries';

const SelfFeatureDetail = () => {

	const { toast } = useToast()
	const { data: cmmCodeAggrRes } = useCommCodes(CommonCode.STAC_CALC_TYPE)
	const { } = useCommCodes(CommonCode.FUNCTION)
	const { } = useCommCodes(CommonCode.OPERATOR)
	const { } = useCommCodes(CommonCode.FORMAT)
	const { } = useCommCodes(CommonCode.SGMT_DELIMITER)
	const { data: response1, isError: isError1 } = useGetTableandColumnMetaInfoByMstrSgmtRuleId()

	const location = useLocation()
	const navigate = useNavigate()


	const [regType, setRegType] = useState<string>('')
	const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)
	const [confirmModalTit, setConfirmModalTit] = useState<string>('')
	const [confirmModalCont, setConfirmModalCont] = useState<string>('')
	const [modalType, setModalType] = useState<string>('')

	// 속성 및 행동 데이터
	const [mstrSgmtTableandColMetaInfo, setMstrSgmtTableandColMetaInfo] = useState<MstrSgmtTableandColMetaInfo>(cloneDeep(initMstrSgmtTableandColMetaInfo))

	const [formulaTrgtList, setFormulaTrgtList] = useState<Array<FormulaTrgtListProps>>([])

	const [featureTempInfo, setFeatureTempInfo] = useState<FeatureTemp>(cloneDeep(initFeatureTemp))
	const [featureInfo, setFeatureInfo] = useState<FeatureInfo>(cloneDeep(initSelfFeatureInfo))
	const [targetList, setTargetList] = useState<Array<TbRsCustFeatRuleTrgt>>([])
	const [trgtFilterList, setTrgtFilterList] = useState<Array<TbRsCustFeatRuleTrgtFilter>>([])
	const [custFeatRuleCalc, setCustFeatRuleCalc] = useState<TbRsCustFeatRuleCalc>(cloneDeep(initTbRsCustFeatRuleCalc))
	const [custFeatRuleCaseList, setCustFeatRuleCaseList] = useState<Array<TbRsCustFeatRuleCase>>([])
	// SQL 입력
	const [sqlQueryInfo, setSqlQueryInfo] = useState<TbRsCustFeatRuleSql>(cloneDeep(initTbRsCustFeatRuleSql))
	// 승인 정보
	const [sfSubmissionRequestData, setSfSubmissionRequestData] = useState<SfSubmissionRequestInfo>(cloneDeep(initSfSubmissionRequestInfo))
	const [sfSubmissionApprovalList, setSfSubmissionApprovalList] = useState<Array<SfSubmissionApproval>>(cloneDeep([initSfSubmissionApproval]))

	useEffect(() => {
		// 초기 상세 정보 조회 API CALL
		initCustFeatRule()
		getTableandColumnMetaInfoByMstrSgmtRuleId()// useQuery로 쓰기
		retrieveCustFeatRuleInfos()
	}, [])

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
			if (regType === "reqInsert") {
				// 승인 요청
				insertSubmissionRequest()
			} else if (regType === "cancel") {
				// 승인 요청 취소
				cancelRequestSubmission()
			} else if (regType === "delete") {
				// 삭제 처리
				deleteCustFeatRule()
			}
		}
		setIsOpenConfirmModal(false)
	}

	const onCancel = () => {
		setIsOpenConfirmModal(false)
	}

	useEffect(() => {
		setFeatureTempInfo(cloneDeep(featureInfo.featureTemp))
		// 대상선택 리스트에 화면에 보여줄 테이블논리명, 컬럼논리명 setting
		setTargetList(() => {
			let tempTargetList = cloneDeep(featureInfo.tbRsCustFeatRuleTrgtList).map((target: TbRsCustFeatRuleTrgt) => {
				let metaTblId = target.tableName
				let colNm = target.columnName
				if (target.divisionCode === divisionTypes.ATTR) {
					/* 
						속성 데이터면 동일한 테이블Id와 컬럼명을 가진 atrributes의 
						metaTblClmnLogiNm 값을 columnLogiName항목으로 추가
	
						target.columnLogiName = attributes[].metaTblClmnLogiNm
					*/
					let logiAttr: Array<Attribute> = []
					logiAttr = mstrSgmtTableandColMetaInfo.attributes.filter((attr: Attribute) => {
						return (metaTblId === attr.metaTblId && colNm === attr.metaTblClmnPhysNm)
					})
					if (logiAttr.length > 0) {
						target.columnLogiName = logiAttr[0].metaTblClmnLogiNm
					} else {
						target.columnLogiName = colNm
					}

				} else if (target.divisionCode === divisionTypes.BEHV) {
					/* 
						행동 데이터면  동일한 테이블 ID를 가진 behavior의
						metaTblLogiNm 값을 tableLogiName항목에 추가
					*/
					let logiBehv: Array<Behavior> = []
					logiBehv = mstrSgmtTableandColMetaInfo.behaviors.filter((behavior: Behavior) => {
						return metaTblId === behavior.metaTblId
					})

					if (logiBehv.length > 0) {
						target.tableLogiName = logiBehv[0].metaTblLogiNm
					} else {
						target.tableLogiName = metaTblId
					}
				}
				return target
			})
			return tempTargetList
		})
		setTrgtFilterList(() => {
			let tempTargetFilterList = cloneDeep(featureInfo.tbRsCustFeatRuleTrgtFilterList).map((trgtFilter: TbRsCustFeatRuleTrgtFilter) => {
				let metaTblId = ""
				let targetId = trgtFilter.targetId
				let colNm = trgtFilter.columnName
				/* 
					반드시 행동 데이터
					동일한 targetId를 가진 targetList의 테이블 ID와 동일한 
					behavior의 tbCoMetaTblClmnInfoList에서
					colNm과 동일한 metaTblClmnPhysNm 의  metaTblClmnLogiNm을
					columnLogiName항목에 추가				
				*/
				let trgtIdArr: Array<TbRsCustFeatRuleTrgt> = []
				trgtIdArr = targetList.filter((target: TbRsCustFeatRuleTrgt) => targetId === target.targetId)

				if (trgtIdArr.length > 0) metaTblId = trgtIdArr[0].tableName

				let clmnBehv: Array<Behavior> = []
				clmnBehv = mstrSgmtTableandColMetaInfo.behaviors.filter((behavior: Behavior) => {
					return metaTblId === behavior.metaTblId
				})

				if (clmnBehv.length > 0) {
					let clmnInfo: Array<TbCoMetaTblClmnInfo> = []
					clmnInfo = clmnBehv[0].tbCoMetaTblClmnInfoList.filter((clnmInfo: TbCoMetaTblClmnInfo) => colNm === clnmInfo.metaTblClmnPhysNm)
					trgtFilter.columnLogiName = clmnInfo[0].metaTblClmnLogiNm
				} else {
					trgtFilter.columnLogiName = colNm
				}
				return trgtFilter
			})
			return tempTargetFilterList
		})
		setCustFeatRuleCalc(cloneDeep(featureInfo.tbRsCustFeatRuleCalc))
		setCustFeatRuleCaseList(cloneDeep(featureInfo.tbRsCustFeatRuleCaseList))
		setSqlQueryInfo(cloneDeep(featureInfo.tbRsCustFeatRuleSql))
	}, [featureInfo])

	useEffect(() => {
		// 계산식 validation을 위한 대상 list 추출
		let fList = []
		for (let i = 0; i < targetList.length; i++) {
			let t = { targetId: `T${i + 1}`, dataType: "" }
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

	const onClickPageMovHandler = (pageNm: string) => {
		if (pageNm === selfFeatPgPpNm.LIST) {
			navigate('..')
		} else if (pageNm === selfFeatPgPpNm.EDIT) {
			featureInfo.tbRsCustFeatRuleTrgtList = targetList
			featureInfo.tbRsCustFeatRuleTrgtFilterList = trgtFilterList
			navigate(
				`../${pageNm}`,
				{
					state: {
						featureInfo: featureInfo,
						sfSubmissionRequestData: sfSubmissionRequestData,
						sfSubmissionApprovalList: sfSubmissionApprovalList
					}
				}
			)
		} else if (pageNm === selfFeatPgPpNm.SUB_ISRT_REQ) {
			// 승인 요청
			setModalType(ModalType.CONFIRM)
			setRegType("reqInsert")
			setConfirmModalTit(ModalTitCont.SUBMISSION_INSERT_REQ.title)
			setConfirmModalCont(ModalTitCont.SUBMISSION_INSERT_REQ.context)
			setIsOpenConfirmModal(true)
		} else if (pageNm === selfFeatPgPpNm.SUB_CANCEL) {
			// 승인 요청 취소
			setModalType(ModalType.CONFIRM)
			setRegType("cancel")
			setConfirmModalTit(ModalTitCont.SUBMISSION_CANCEL.title)
			setConfirmModalCont(ModalTitCont.SUBMISSION_CANCEL.context)
			setIsOpenConfirmModal(true)
		} else if (pageNm === selfFeatPgPpNm.DELETE) {
			// 삭제 처리
			setModalType(ModalType.CONFIRM)
			setRegType("delete")
			setConfirmModalTit(ModalTitCont.DELETE.title)
			setConfirmModalCont(ModalTitCont.DELETE.context)
			setIsOpenConfirmModal(true)
		} else {
			navigate(`../${pageNm}`)
		}
	}

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
			setSfSubmissionApprovalList(() => {
				let rtn = cloneDeep(response.result.approvals)

				let t: Array<SfSubmissionApproval> = []

				for (let i = 0; i < 3; i++) {

					let subAprv: SfSubmissionApproval = cloneDeep(initSfSubmissionApproval)

					if (rtn && rtn[i]) {
						subAprv = cloneDeep(rtn[i])
					}

					subAprv.approvalSequence = i + 1

					if (subAprv.approvalSequence === 1) subAprv.approvalSequenceNm = aprvSeqNm.FIRST
					else if (subAprv.approvalSequence === 2) subAprv.approvalSequenceNm = aprvSeqNm.SECOND
					else if (subAprv.approvalSequence === 3) subAprv.approvalSequenceNm = aprvSeqNm.LAST

					t.push(subAprv)
				}

				return t
			})
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

			setSfSubmissionApprovalList(() => {
				let rtn = cloneDeep(response.result.approvals)

				let t: Array<SfSubmissionApproval> = []

				for (let i = 0; i < 3; i++) {

					let subAprv: SfSubmissionApproval = cloneDeep(initSfSubmissionApproval)

					if (rtn && rtn[i]) {
						subAprv = cloneDeep(rtn[i])
					}

					subAprv.approvalSequence = i + 1

					if (subAprv.approvalSequence === 1) subAprv.approvalSequenceNm = aprvSeqNm.FIRST
					else if (subAprv.approvalSequence === 2) subAprv.approvalSequenceNm = aprvSeqNm.SECOND
					else if (subAprv.approvalSequence === 3) subAprv.approvalSequenceNm = aprvSeqNm.LAST

					t.push(subAprv)
				}

				return t
			})
		}
	}

	const insertSubmissionRequest = async () => {
		/*
		  승인 요청
		  Method      :: PUT
		  Url         :: /api/v1/users/${email}/submissions/${submissionId}/request
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
		request.url = `/api/v1/users/${email}/submissions/${submissionId}/request`
		console.log("[insertSubmissionRequest] Request  :: ", request)

		let response = cloneDeep(initCommonResponse)
		//response = await callApi(request)
		console.log("[insertSubmissionRequest] Response :: ", response)
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

	const deleteCustFeatRule = async () => {
		/*
		  feature 삭제
		  Method      :: DELETE
		  Url         :: /api/v1/customerfeatures
		  path param  :: 
		  query param :: custFeatRuleIds
		  body param  :: 
		*/
		let config = cloneDeep(initConfig)
		config.isLoarding = true
		let request = cloneDeep(initApiRequest)
		request.method = Method.DELETE
		request.url = "/api/v1/customerfeatures"
		let custFeatRuleIds: Array<string> = []
		custFeatRuleIds.push(featureInfo.tbRsCustFeatRule.id)
		request.params!.queryParams = { custFeatRuleIds: custFeatRuleIds.toString() }
		console.log("[deleteCustFeatRule] Request  :: ", request)

		let response = cloneDeep(initCommonResponse)
		//response = await callApi(request)
		console.log("[deleteCustFeatRule] Response :: ", response)

	}

	const DetailBtnComponent = () => {
		if (
			!location.state.submissionStatus
			|| location.state.submissionStatus === ""
		) {
			// 등록(품의는 저장 x)
			return (
				<Stack justifyContent="End" gap="SM" className="width-100">
					<Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.LIST)}>
						목록
					</Button>
					<Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.DELETE)}>
						삭제
					</Button>
					<Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.EDIT)}>
						수정
					</Button>
					<Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.SUB_ISRT_REQ)}>
						승인 요청
					</Button>
				</Stack>
			)
		} else if (location.state.submissionStatus === subFeatStatus.SAVE) {
			// 품의 저장(품의 저장의 경우 결재진행 전 단계로 가야할지?)
			return (
				<Stack justifyContent="End" gap="SM" className="width-100">
					<Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.LIST)}>
						목록
					</Button>
					<Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.DELETE)}>
						삭제
					</Button>
					<Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.EDIT)}>
						수정
					</Button>
					<Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.SUB_CANCEL)}>
						요청 취소
					</Button>
				</Stack>
			)
		} else if (location.state.submissionStatus === subFeatStatus.IN_APRV) {
			// 결재 진행이지만 1차 승인 이전의 상태인 경우만 요청 취소 버튼 노출
			return (
				<Stack justifyContent="End" gap="SM" className="width-100">
					<Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.LIST)}>
						목록
					</Button>
					{/* <Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.SUB_CANCEL)}>
            요청 취소
          </Button> */}
				</Stack>
			)
		} else if (location.state.submissionStatus === subFeatStatus.APRV) {
			// 승인 완료
			return (
				<Stack justifyContent="End" gap="SM" className="width-100">
					<Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.LIST)}>
						목록
					</Button>
				</Stack>
			)
		} else if (location.state.submissionStatus === subFeatStatus.REJT) {
			// 반려
			return (
				<Stack justifyContent="End" gap="SM" className="width-100">
					<Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.LIST)}>
						목록
					</Button>
					<Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(selfFeatPgPpNm.EDIT)}>
						수정
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
			<FeatQueryRsltButton
				custFeatRuleId={location.state.id}
			/>

			{/* 정보 영역 */}
			{/* {sfSubmissionRequestData.submissionNo !== "" &&  */}
			<>
				<Typography variant="h4">승인 정보</Typography>
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
							<TD colSpan={5} align="left">
								{sfSubmissionRequestData.requestDate}
							</TD>
						</TR>
						{/* <TR>
                  <TH colSpan={1} align="right">
                  승인 제목
                  </TH>
                  <TD colSpan={5} align="left">
                      {sfSubmissionRequestData.title}
                  </TD>
              </TR>
              <TR>
                  <TH colSpan={1} align="right">
                  승인 내용
                  </TH>
                  <TD colSpan={5} align="left">
                      {sfSubmissionRequestData.content}
                  </TD>
              </TR> */}
					</HorizontalTable>
				</Stack>
			</>
			{/* } */}

			<Stack direction="Vertical" gap="MD">
				{/* 기본 정보 */}
				<Typography variant="h4">Feature 기본 정보</Typography>
				<HorizontalTable>
					<TR>
						<TH colSpan={1} align="right">대구분</TH>
						<TD colSpan={2} align='left'>
							{featureInfo.featureTemp && featureInfo.featureTemp.featureLSe}
						</TD>
						<TH colSpan={1} align="right">중구분</TH>
						<TD colSpan={2} align='left'>
							{featureInfo.featureTemp && featureInfo.featureTemp.featureMSe}
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
						<TD colSpan={5} align='left'>
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
						<TD colSpan={5} align='left'>
							<TextField
								style={{
									height: "150px"
								}}
								className="width-100"
								multiline
								readOnly
								defaultValue={featureInfo.featureTemp && featureInfo.featureTemp.featureFm}
							/>
						</TD>
					</TR>
					<TR>
						<TH colSpan={1} align="right">비고</TH>
						<TD colSpan={5} align='left'>
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
									attributes={mstrSgmtTableandColMetaInfo.attributes}
									behaviors={mstrSgmtTableandColMetaInfo.behaviors}
									setFormulaTrgtList={setFormulaTrgtList}
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
								defaultValue={featureInfo.tbRsCustFeatRuleSql?.sqlQuery}
							/>
						</Stack>
					</>
				}

				<Stack justifyContent="Between" className="width-100">
					<Typography variant="h4">결재선</Typography>
				</Stack>
				<VerticalTable
					columns={columns}
					rows={sfSubmissionApprovalList}
					enableSort={false}
				/>
			</Stack>
			{/* 정보 영역 */}

			{/* 버튼 영역 */}
			<Stack direction="Vertical" gap="MD" justifyContent="End">
				{/* 
          등록 / 품의 저장 -> 목록,수정,승인요청 버튼
          승인요청/결제진행/승인완료/반려 -> 목록,승인 확인 버튼
        */}
				<DetailBtnComponent />
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

export default SelfFeatureDetail;