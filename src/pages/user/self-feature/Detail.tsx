import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { cloneDeep, isEmpty } from "lodash";
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
	FeatureType,
} from '@/models/selfFeature/FeatureCommon';
import {
	SfSubmissionAppendApproval,
	SfSubmissionApproval,
	SfSubmissionRequestInfo
} from '@/models/selfFeature/FeatureSubmissionModel';
import { Method, QueryParams, callApi } from '@/utils/ApiUtil';
import ConfirmModal from '@/components/modal/ConfirmModal';
import FeatQueryRsltButton from '@/components/self-feature/FeatQueryRsltButton';
import { StatusCode } from '@/models/common/CommonResponse';
import { useApproverCandidate, useCustFeatRuleInfos, useGetTableandColumnMetaInfoByMstrSgmtRuleId, useSubmissionInfo, useSubmissionList } from '@/hooks/queries/self-feature/useSelfFeatureUserQueries';
import { GroupCodeType, ValidType } from '@/models/common/Constants';
import { useCommCodes } from '@/hooks/queries/self-feature/useSelfFeatureCmmQueries';
import { useFeatureTypList } from '@/hooks/queries/useFeatureQueries';
import { FeatureSeparatesModel } from '@/models/model/FeatureModel';
import { useAppSelector } from '@/hooks/useRedux';
import { selectCodeList } from '@/reducers/codeSlice';
import { CodeModel } from '@/models/model/CodeModel';
import { getFeatureSeList } from '@/api/FeatureAPI';
import { selectSessionInfo } from '@/reducers/authSlice';

const SelfFeatureDetail = () => {

	const { toast } = useToast()
	const location = useLocation()
	const navigate = useNavigate()
	const { data: cmmCodeAggrRes } = useCommCodes(CommonCode.STAC_CALC_TYPE)
	const { } = useCommCodes(CommonCode.FUNCTION)
	const { } = useCommCodes(CommonCode.OPERATOR)
	const { } = useCommCodes(CommonCode.FORMAT)
	const { } = useCommCodes(CommonCode.SGMT_DELIMITER)
	const { data: response1, isError: isError1 } = useGetTableandColumnMetaInfoByMstrSgmtRuleId()
	const sessionInfo = useAppSelector(selectSessionInfo())
	const { data: custFeatRuleInfosRes, isError: custFeatRuleInfosErr } = useCustFeatRuleInfos(location.state.id)
	const [qParams, setQParams] = useState<QueryParams>({})
	const [submissionId, setSubmissionId] = useState<number>(0)
	const { data: submissionListRes, isError: submissionListErr, refetch: submissionListRefetch } = useSubmissionList(qParams)
	const { data: submissionInfoRes, isError: submissionInfoErr, refetch: submissionInfoRefetch } = useSubmissionInfo(submissionId)


	// 대구분
	const { refetch: lRefetch, data: lResponse, isError: lIsError } = useFeatureTypList()
	const [featureSeGrpList, setFeatureSeGrpList] = useState<Array<FeatureSeparatesModel>>([])
	// 중구분
	const [featureSeList, setFeatureSeList] = useState<Array<FeatureSeparatesModel>>([])
	// 픽처타입
	const codeList = useAppSelector(selectCodeList(GroupCodeType.FEATURE_TYPE))

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
	// 결재선
	const [aprvList, setAprvList] = useState<Array<SfSubmissionAppendApproval>>([])
	const [aprvType1, setAprvType1] = useState<Array<SfSubmissionAppendApproval>>([])
	const [aprvType2, setAprvType2] = useState<Array<SfSubmissionAppendApproval>>([])
	const [aprvType3, setAprvType3] = useState<Array<SfSubmissionAppendApproval>>([])
	const {
		data: approverCandidateRes,
		isError: approverCandidateErr,
		refetch: approverCandidateRefetch
	} = useApproverCandidate()

	useEffect(() => {
		// 초기 상세 정보 조회 API CALL
		initCustFeatRule()
		//retrieveCustFeatRuleInfos()
	}, [])
	// 대구분 API response callback
	useEffect(() => {
		if (lIsError || lResponse?.successOrNot === 'N') {
			toast({
				type: ValidType.ERROR,
				content: '조회 중 에러가 발생했습니다.',
			})
		} else {
			if (lResponse?.data) {
				setFeatureSeGrpList(lResponse.data)
			}
		}
	}, [lResponse, lIsError, toast])
	useEffect(() => {
		if (!featureSeGrpList || featureSeGrpList.length < 1) return

		featureSeGrpList.map((featureSeGrp: FeatureSeparatesModel) => {
			let response = getFeatureSeList(featureSeGrp.seId)

			response.then((response) => {
				if (response?.successOrNot === 'N') {
					toast({
						type: ValidType.ERROR,
						content: '조회 중 에러가 발생했습니다.',
					})
				} else {
					if (response?.data) {
						setFeatureSeList((prevState: Array<FeatureSeparatesModel>) => {
							let rtn = cloneDeep(prevState)
							return [...rtn, ...response.data]
						})

					}
				}
			}).catch((err) => {
				console.log(err)
			})
			return featureSeGrp
		})

	}, [featureSeGrpList])

	useEffect(() => {
		if (isError1 || response1?.successOrNot === 'N') {
			toast({
				type: ValidType.ERROR,
				content: '조회 중 에러가 발생했습니다.',
			})
		} else {
			if (response1) {
				setMstrSgmtTableandColMetaInfo(cloneDeep(response1.result))
			}
		}
	}, [response1, isError1, toast])
	// 결재선 default setting을 위해
	useEffect(() => {
        if (approverCandidateErr || approverCandidateRes?.successOrNot === 'N') {
            toast({
                type: ValidType.ERROR,
                content: '조회 중 에러가 발생했습니다.',
            });
        } else {
            if (approverCandidateRes) {
				setAprvType1(approverCandidateRes.result.filter((aprroval: SfSubmissionAppendApproval) => aprroval.groupNm === aprvSeqNm.FIRST))
				setAprvType2(approverCandidateRes.result.filter((aprroval: SfSubmissionAppendApproval) => aprroval.groupNm === aprvSeqNm.SECOND))
				setAprvType3(approverCandidateRes.result.filter((aprroval: SfSubmissionAppendApproval) => aprroval.groupNm === aprvSeqNm.LAST))
                setAprvList(approverCandidateRes.result)
            }
        }
    }, [approverCandidateRes, approverCandidateErr, toast])
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
	useEffect(() => {
		if (custFeatRuleInfosErr || custFeatRuleInfosRes?.successOrNot === 'N') {
			toast({
				type: ValidType.ERROR,
				content: '조회 중 에러가 발생했습니다.',
			})
		} else {
			if (custFeatRuleInfosRes?.result) {
				setFeatureInfo(cloneDeep(custFeatRuleInfosRes.result))
				setQParams({ type: FeatureType.CUST, referenceNo: location.state.id })
			}
		}
	}, [custFeatRuleInfosRes, custFeatRuleInfosErr, toast])
	useEffect(() => {
		if (isEmpty(qParams)) return
		submissionListRefetch()
	}, [qParams])
	useEffect(() => {
		if (submissionListErr || submissionListRes?.successOrNot === 'N') {
			toast({
				type: ValidType.ERROR,
				content: '조회 중 에러가 발생했습니다.',
			})
		} else {
			if (submissionListRes?.result) {
				setSfSubmissionApprovalList(() => {
					let rtn = cloneDeep(submissionListRes.result.approvals)

					let t: Array<SfSubmissionApproval> = []

					for (let i = 0; i < 3; i++) {

						let subAprv: SfSubmissionApproval = cloneDeep(initSfSubmissionApproval)

						if (rtn && rtn[i]) {
							subAprv = cloneDeep(rtn[i])
						}

						subAprv.approvalSequence = i + 1

						
						if (subAprv.approvalSequence === 1) {
							let type1 = aprvType1.find((item: SfSubmissionAppendApproval) => item.userEmail === subAprv.approver)
							subAprv.approvalSequenceNm = aprvSeqNm.FIRST
							subAprv.approverNm = type1 ? type1.userNm : ""
						}
						if (subAprv.approvalSequence === 2) {
							let type2 = aprvType2.find((item: SfSubmissionAppendApproval) => item.userEmail === subAprv.approver)
							subAprv.approvalSequenceNm = aprvSeqNm.SECOND
							subAprv.approverNm = type2 ? type2.userNm : ""
						}
						if (subAprv.approvalSequence === 3) {
							let type3 = aprvType3.find((item: SfSubmissionAppendApproval) => item.userEmail === subAprv.approver)
							subAprv.approvalSequenceNm = aprvSeqNm.LAST
							subAprv.approverNm = type3 ? type3.userNm : ""
						}

						t.push(subAprv)
					}

					return t
				})
				if (submissionListRes.result.length > 0) {
					setSubmissionId(submissionListRes.result[0].id)
				}
			}
		}
	}, [submissionListRes, submissionListErr, toast])
	useEffect(() => {
		if (submissionId === 0) return
		submissionInfoRefetch()
	}, [submissionId])
	useEffect(() => {
		if (submissionInfoErr || submissionInfoRes?.successOrNot === 'N') {
			toast({
				type: ValidType.ERROR,
				content: '조회 중 에러가 발생했습니다.',
			})
		} else {
			if (submissionInfoRes?.result) {

				if (submissionInfoRes.result.submission) setSfSubmissionRequestData(cloneDeep(submissionInfoRes.result.submission))

				setSfSubmissionApprovalList(() => {
					let rtn = cloneDeep(submissionInfoRes.result.approvals)

					let t: Array<SfSubmissionApproval> = []

					for (let i = 0; i < 3; i++) {

						let subAprv: SfSubmissionApproval = cloneDeep(initSfSubmissionApproval)

						if (rtn && rtn[i]) {
							subAprv = cloneDeep(rtn[i])
						}
						
						subAprv.approvalSequence = i + 1

						if (subAprv.approvalSequence === 1) {
							let type1 = aprvType1.find((item: SfSubmissionAppendApproval) => item.userEmail === subAprv.approver)
							subAprv.approvalSequenceNm = aprvSeqNm.FIRST
							subAprv.approverNm = type1 ? type1.userNm : ""
						}
						if (subAprv.approvalSequence === 2) {
							let type2 = aprvType2.find((item: SfSubmissionAppendApproval) => item.userEmail === subAprv.approver)
							subAprv.approvalSequenceNm = aprvSeqNm.SECOND
							subAprv.approverNm = type2 ? type2.userNm : ""
						}
						if (subAprv.approvalSequence === 3) {
							let type3 = aprvType3.find((item: SfSubmissionAppendApproval) => item.userEmail === subAprv.approver)
							subAprv.approvalSequenceNm = aprvSeqNm.LAST
							subAprv.approverNm = type3 ? type3.userNm : ""
						}

						t.push(subAprv)
					}

					return t
				})
			}
		}
	}, [submissionInfoRes, submissionInfoErr, toast])
	useEffect(() => {
		if (isEmpty(aprvType1)) return

		setSfSubmissionApprovalList((prevState: Array<SfSubmissionApproval>) => {
			let rtn = cloneDeep(prevState)
			rtn = rtn.map((approval: SfSubmissionApproval) => {
				if (approval.approvalSequence === 1) {
					let type1 = aprvType1.find((item: SfSubmissionAppendApproval) => item.userEmail === approval.approver)
					approval.approverNm = type1 ? type1.userNm : ""
				}
				if (approval.approvalSequence === 2) {
					let type2 = aprvType2.find((item: SfSubmissionAppendApproval) => item.userEmail === approval.approver)
					approval.approverNm = type2 ? type2.userNm : ""
				}
				if (approval.approvalSequence === 3) {
					let type3 = aprvType3.find((item: SfSubmissionAppendApproval) => item.userEmail === approval.approver)
					approval.approverNm = type3 ? type3.userNm : ""
				}
				return approval
			})
			return rtn
		})
	}, [aprvType1, aprvType2, aprvType3])
	
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
		let email = sessionInfo.email
		let submissionId = sfSubmissionRequestData.id
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
		let email = sessionInfo.email
		let submissionId = sfSubmissionRequestData.id
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
			|| location.state.submissionStatus === subFeatStatus.SAVE
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
		} else if (location.state.submissionStatus === subFeatStatus.REQ) {
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
							{featureInfo.featureTemp &&
								featureSeGrpList.find((grpItem: FeatureSeparatesModel) => {
									return grpItem.seId === featureSeList.find((item: FeatureSeparatesModel) => item.seId === featureInfo.featureTemp.featureSe)?.seGrpId
								})?.seNm
							}
						</TD>
						<TH colSpan={1} align="right">중구분</TH>
						<TD colSpan={2} align='left'>
							{featureInfo.featureTemp &&
								featureSeList.find((item: FeatureSeparatesModel) => item.seId === featureInfo.featureTemp.featureSe)?.seNm
							}
						</TD>
					</TR>
					<TR>
						<TH colSpan={1} align="right">Feature ID</TH>
						<TD colSpan={2} align='left'>
							{featureInfo.featureTemp && featureInfo.featureTemp.featureId}
						</TD>
						<TH colSpan={1} align="right">Feature 타입</TH>
						<TD colSpan={2} align='left'>
							{featureInfo.featureTemp &&
								codeList.find((featureType: CodeModel) => featureType.codeId === featureInfo.featureTemp.featureTyp)?.codeNm
							}
						</TD>
					</TR>
					<TR>
						<TH colSpan={1} align="right">한글명</TH>
						<TD colSpan={2} align='left'>
							{featureInfo.featureTemp && featureInfo.featureTemp.featureKoNm}
						</TD>
						<TH colSpan={1} align="right">영문명</TH>
						<TD colSpan={2} align='left'>
							{featureInfo.featureTemp && featureInfo.featureTemp.featureEnNm}
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
							{featureInfo.featureTemp && featureInfo.featureTemp.featureDsc}
						</TD>
					</TR>
				</HorizontalTable>
				{/* 기본 정보 */}

				{/* Feature 로직 */}
				<Stack
					gap="LG"
					direction="Vertical"
					style={{
						border: '2px solid rgb(162, 210, 235)',
						borderRadius: '5px',
					}}
				>
					{(
						featureInfo.tbRsCustFeatRule.sqlDirectInputYn === ""
						|| featureInfo.tbRsCustFeatRule.sqlDirectInputYn === "N"
					) &&
						<Stack
							direction="Vertical"
							style={{
								margin: "0.5rem"
							}}
						>
							<Typography variant="h4">1. Feature 로직</Typography>
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
						</Stack>
					}
					{featureInfo.tbRsCustFeatRule.sqlDirectInputYn === "Y" &&
						<Stack
							direction="Vertical"
							style={{
								margin: "0.5rem"
							}}
						>
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
						</Stack>
					}

					{/* 계산식 */}
					{((
						featureInfo.tbRsCustFeatRule.sqlDirectInputYn === ""
						|| featureInfo.tbRsCustFeatRule.sqlDirectInputYn === "N"
					) && formulaTrgtList.length > 0) &&
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