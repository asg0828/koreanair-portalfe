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
	DivisionTypes,
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
	initFeatureTemp,
	initMstrSgmtTableandColMetaInfo,
	initSelfFeatureInfo,
	initTbRsCustFeatRuleCalc,
	initTbRsCustFeatRuleSql,
} from './data';
import {
	sfSubmissionApprovalListColumns as columns,
	initSfSubmissionApproval,
	initSfSubmissionRequestInfo,
} from '../self-feature-submission/data'
import {
	SubFeatStatus,
	SelfFeatPgPpNm,
	ModalType,
	ModalTitCont,
	CommonCodeInfo,
	CommonCode,
	FeatureType,
	SubFeatStatusNm,
} from '@/models/selfFeature/FeatureCommon';
import {
	AprvSeqNm,
	SfSubmissionAppendApproval,
	SfSubmissionApproval,
	SfSubmissionRequestInfo
} from '@/models/selfFeature/FeatureSubmissionModel';
import { QueryParams } from '@/utils/ApiUtil';
import ConfirmModal from '@/components/modal/ConfirmModal';
import FeatQueryRsltButton from '@/components/self-feature/FeatQueryRsltButton';
import { useApproverCandidate, useCustFeatRuleInfos, useCustFeatSQLInfos, useGetTableandColumnMetaInfoByMstrSgmtRuleId, useSubmissionInfo, useSubmissionList } from '@/hooks/queries/self-feature/useSelfFeatureUserQueries';
import { GroupCodeType, ValidType } from '@/models/common/Constants';
import { useCommCodes } from '@/hooks/queries/self-feature/useSelfFeatureCmmQueries';
import { useFeatureTypList } from '@/hooks/queries/useFeatureQueries';
import { FeatureSeparatesModel } from '@/models/model/FeatureModel';
import { useAppSelector } from '@/hooks/useRedux';
import { selectCodeList } from '@/reducers/codeSlice';
import { CodeModel } from '@/models/model/CodeModel';
import { getFeatureSeList } from '@/api/FeatureAPI';
import { selectSessionInfo } from '@/reducers/authSlice';
import { useCancelRequestSubmission, useDeleteCustFeatRule, useInsertSubmissionRequest, useRunScheduleByManually } from '@/hooks/mutations/self-feature/useSelfFeatureUserMutations';
import { getDateFormat } from '@/utils/DateUtil';
import { useDeptAllList } from '@/hooks/queries/useDeptQueries';
import { useMstrProfList } from '@/hooks/queries/self-feature/useSelfFeatureAdmQueries';
import { initMstrProfSearchInfoProps } from '@/pages/admin/self-feature-meta-management/master-profile-management/data';

const SelfFeatureDetail = () => {

	const { toast } = useToast()
	const location = useLocation()
	const navigate = useNavigate()
	const sessionInfo = useAppSelector(selectSessionInfo())
	
    // 사용될 rslnRuleId / mstrSgmtRuleId 조회
    const { data: mstrProfListRes, isError: mstrProfListErr, refetch: mstrProfListRefetch } = useMstrProfList(initMstrProfSearchInfoProps)
    // rslnRuleId parameter
	const [rslnRuleIdParam, setRslnRuleIdParam] = useState<string>("")
    // mstrSgmtRuleId parameter
	const [mstrSgmtRuleIdParam, setMstrSgmtRuleIdParam] = useState<string>("")
	const { data: mstrSgmtTbandColRes, isError: mstrSgmtTbandColErr, refetch: mstrSgmtTbandColRefetch } = useGetTableandColumnMetaInfoByMstrSgmtRuleId(mstrSgmtRuleIdParam)

	const { data: cmmCodeAggrRes } = useCommCodes(CommonCode.STAC_CALC_TYPE)
	const [categoryOption, setCategoryOption] = useState<Array<any>>([])
	const { data: cmmCodeCateRes } = useCommCodes(CommonCode.CATEGORY)
	const { } = useCommCodes(CommonCode.FUNCTION)
	const { } = useCommCodes(CommonCode.OPERATOR)
	const { } = useCommCodes(CommonCode.FORMAT)
	const { } = useCommCodes(CommonCode.SGMT_DELIMITER)

	// 상세 조회 API(Rule-Design / SQL)
	const { data: custFeatRuleInfosRes, isError: custFeatRuleInfosErr, refetch: custFeatRuleInfosRefetch } = useCustFeatRuleInfos(location.state.id)
	const { data: custFeatSQLInfosRes, isError: custFeatSQLInfosErr, refetch: custFeatSQLInfosRefetch } = useCustFeatSQLInfos(location.state.id)
	const [subListQueryParams, setSubListQueryParams] = useState<QueryParams>({})
	const [submissionId, setSubmissionId] = useState<number>(0)
	const { data: submissionListRes, isError: submissionListErr, refetch: submissionListRefetch } = useSubmissionList(subListQueryParams)
	const { data: submissionInfoRes, isError: submissionInfoErr, refetch: submissionInfoRefetch } = useSubmissionInfo(submissionId)
	// 부서 조회
	const [deptOption, setDeptOption] = useState<Array<any>>([])
	const { data: deptAllListRes, isError: deptAllListErr } = useDeptAllList()
	// 대구분
	const { data: seGroupRes, isError: seGroupErr } = useFeatureTypList()
	const [featureSeGrpList, setFeatureSeGrpList] = useState<Array<FeatureSeparatesModel>>([])
	// 중구분
	const [featureSeList, setFeatureSeList] = useState<Array<FeatureSeparatesModel>>([])
	// 픽처타입
	const codeList = useAppSelector(selectCodeList(GroupCodeType.FEATURE_TYPE))
	// 버튼 클릭 종류
	const [btnClickType, setBtnClickType] = useState<string>('')
	// 모달
	const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)
	const [confirmModalTit, setConfirmModalTit] = useState<string>('')
	const [confirmModalCont, setConfirmModalCont] = useState<string>('')
	const [modalType, setModalType] = useState<string>('')
	// 속성 및 행동 데이터
	const [mstrSgmtTableandColMetaInfo, setMstrSgmtTableandColMetaInfo] = useState<MstrSgmtTableandColMetaInfo>(cloneDeep(initMstrSgmtTableandColMetaInfo))
	// 계산식 validation을 위한 대상 list
	const [formulaTrgtList, setFormulaTrgtList] = useState<Array<FormulaTrgtListProps>>([])
	// 기본 정보
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
	//const [aprvList, setAprvList] = useState<Array<SfSubmissionAppendApproval>>([])
	const [aprvType1, setAprvType1] = useState<Array<SfSubmissionAppendApproval>>([])
	const [aprvType2, setAprvType2] = useState<Array<SfSubmissionAppendApproval>>([])
	const [aprvType3, setAprvType3] = useState<Array<SfSubmissionAppendApproval>>([])
	const { data: approverCandidateRes, isError: approverCandidateErr } = useApproverCandidate()
	// feature 삭제 API
	const [featureDeleteQueryParams, setFeatureDeleteQueryParams] = useState<QueryParams>({})
	const { data: featureDeleteRes, isSuccess: featureDeleteSucc, isError: featureDeleteErr, mutate: featureDeleteMutate } = useDeleteCustFeatRule(featureDeleteQueryParams)
	// feature 승인요청 API
	const [userEmail, setUserEmail] = useState<string>("")
	const { data: insrtSubReqRes, isSuccess: insrtSubReqSucc, isError: insrtSubReqErr, mutate: insrtSubReqMutate } = useInsertSubmissionRequest(userEmail, submissionId)
	// feature 승인요청 취소 API
	const { data: cnclReqSubRes, isSuccess: cnclReqSubSucc, isError: cnclReqSubErr, mutate: cnclReqSubMutate } = useCancelRequestSubmission(userEmail, submissionId)
	// 수동실행 API
	const { data: runScheduleByManuallyRes, isSuccess: runScheduleByManuallySucc, isError: runScheduleByManuallyErr, mutate: runScheduleByManuallyMutate } = useRunScheduleByManually(location.state.id)
	// component mount
	useEffect(() => {
		initCustFeatRule()
		if (location.state.sqlDirectInputYn === "N") {
			custFeatRuleInfosRefetch()
		} else if (location.state.sqlDirectInputYn === "Y") {
			custFeatSQLInfosRefetch()
		}
	}, [])
    // master segement rule Id setting
    useEffect(() => {
        if (mstrProfListErr || mstrProfListRes?.successOrNot === 'N') {
            toast({
                type: ValidType.ERROR,
                content: '조회 중 에러가 발생했습니다.',
            })
        } else {
            if (mstrProfListRes) {
				// master profile id 설정값 변경
				let useMstrProf = mstrProfListRes.result.filter((mstrProf: any) => mstrProf.mstrSgmtRuleUseYn === "Y")
                let t = useMstrProf[mstrProfListRes.result.length - 1]
                if (t) {
                    // 속성 및 행동 테이블 정보 조회를 위해
                    setRslnRuleIdParam(() => t.rslnRuleId)
                    setMstrSgmtRuleIdParam(() => t.mstrSgmtRuleId)
                } else {
                    toast({
                        type: ValidType.ERROR,
                        content: 'Resolution Rule, Master Profile Rule에 대해 관리자에게 문의 하세요.',
                    })
                }
            }
        }
    }, [mstrProfListRes, mstrProfListErr, toast])
    useEffect(() => {
        if (mstrSgmtRuleIdParam === "") return

		if (location.state.sqlDirectInputYn === "N") mstrSgmtTbandColRefetch()

    }, [mstrSgmtRuleIdParam, location.state.sqlDirectInputYn])
	// 카테고리 setting
	useEffect(() => {
		if (cmmCodeCateRes?.successOrNot === 'N') {
			toast({
				type: ValidType.ERROR,
				content: '공통 코드 조회 중 에러가 발생했습니다.',
			});
		} else {
			if (cmmCodeCateRes?.result) {
				setCategoryOption(() => {
					return [...[{ cdv: "", cdvNm: "선택" }], ...cmmCodeCateRes?.result]
				})
			}
		}
	}, [cmmCodeCateRes])
	// 부서 목록 setting
	useEffect(() => {
		if (deptAllListErr || deptAllListRes?.successOrNot === 'N') {
			toast({
				type: ValidType.ERROR,
				content: '부서 목록 조회 중 에러가 발생했습니다.',
			});
		} else {
			if (deptAllListRes?.data) {
				setDeptOption(() => {
					return [...[{ deptCode: "", deptNm: "선택" }], ...deptAllListRes.data.contents]
				})
			}
		}
	}, [deptAllListRes, deptAllListErr, toast])
	// 속성 및 행동 데이터 정보 호출 callback
	useEffect(() => {
		if (mstrSgmtTbandColErr || mstrSgmtTbandColRes?.successOrNot === 'N') {
			toast({
				type: ValidType.ERROR,
				content: '조회 중 에러가 발생했습니다.',
			})
		} else {
			if (mstrSgmtTbandColRes) {
				if (location.state.sqlDirectInputYn === "N") {
					setMstrSgmtTableandColMetaInfo(cloneDeep(mstrSgmtTbandColRes.result))
				}
			}
		}
	}, [mstrSgmtTbandColRes, mstrSgmtTbandColErr, mstrSgmtTbandColRefetch, toast])
	// 대구분 API response callback
	useEffect(() => {
		if (seGroupErr || seGroupRes?.successOrNot === 'N') {
			toast({
				type: ValidType.ERROR,
				content: '조회 중 에러가 발생했습니다.',
			})
		} else {
			if (seGroupRes?.data) {
				setFeatureSeGrpList(seGroupRes.data)
			}
		}
	}, [seGroupRes, seGroupErr, toast])
	// 중구분 전체 list setting
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
	// 결재선 default setting을 위해
	useEffect(() => {
		if (approverCandidateErr || approverCandidateRes?.successOrNot === 'N') {
			toast({
				type: ValidType.ERROR,
				content: '조회 중 에러가 발생했습니다.',
			});
		} else {
			if (approverCandidateRes) {
				setAprvType1(approverCandidateRes.result.filter((aprroval: SfSubmissionAppendApproval) => aprroval.groupNm === AprvSeqNm.FIRST))
				setAprvType2(approverCandidateRes.result.filter((aprroval: SfSubmissionAppendApproval) => aprroval.groupNm === AprvSeqNm.SECOND))
				setAprvType3(approverCandidateRes.result.filter((aprroval: SfSubmissionAppendApproval) => aprroval.groupNm === AprvSeqNm.LAST))
				//setAprvList(approverCandidateRes.result)
			}
		}
	}, [approverCandidateRes, approverCandidateErr, toast])
	// feature 정보 초기화
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
			if (btnClickType === "reqInsert") {
				// 승인 요청
				insertSubmissionRequest()
			} else if (btnClickType === "cancel") {
				// 승인 요청 취소
				cancelRequestSubmission()
			} else if (btnClickType === "delete") {
				// 삭제 처리
				deleteCustFeatRule()
			}
		}
		setIsOpenConfirmModal(false)
	}
	const onCancel = () => {
		setIsOpenConfirmModal(false)
	}
	// 상세 정보 조회 후 값 setting
	useEffect(() => {
		setFeatureTempInfo(cloneDeep(featureInfo.featureTemp))
		if (location.state.sqlDirectInputYn === "N") {
			setTargetList(cloneDeep(featureInfo.tbRsCustFeatRuleTrgtList))
			setTrgtFilterList(cloneDeep(featureInfo.tbRsCustFeatRuleTrgtFilterList))
			setCustFeatRuleCalc(cloneDeep(featureInfo.tbRsCustFeatRuleCalc))
			//setCustFeatRuleCaseList(cloneDeep(featureInfo.tbRsCustFeatRuleCaseList))
		}
		if (location.state.sqlDirectInputYn === "Y") {
			setSqlQueryInfo(cloneDeep(featureInfo.tbRsCustFeatRuleSql))
		}
	}, [featureInfo])
	// 대상선택 리스트에 화면에 보여줄 테이블논리명, 컬럼논리명 setting
	useEffect(() => {
		if (isEmpty(mstrSgmtTableandColMetaInfo) || mstrSgmtTableandColMetaInfo.rslnRuleId === "") return

		if (featureInfo.tbRsCustFeatRule.sqlDirectInputYn === "N") {
			setTargetList(() => {
				let tempTargetList = cloneDeep(featureInfo.tbRsCustFeatRuleTrgtList).map((target: TbRsCustFeatRuleTrgt) => {
					let metaTblId = target.tableName
					let colNm = target.columnName
					if (target.divisionCode === DivisionTypes.ATTR) {
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

					} else if (target.divisionCode === DivisionTypes.BEHV) {
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
					trgtIdArr = featureInfo.tbRsCustFeatRuleTrgtList.filter((target: TbRsCustFeatRuleTrgt) => targetId === target.targetId)
					if (trgtIdArr.length > 0) metaTblId = trgtIdArr[0].tableName

					let clmnBehv: Array<Behavior> = []
					clmnBehv = mstrSgmtTableandColMetaInfo.behaviors.filter((behavior: Behavior) => {
						return metaTblId === behavior.metaTblId
					})
					if (clmnBehv.length > 0) {
						let clmnInfo: Array<TbCoMetaTblClmnInfo> = []
						clmnInfo = clmnBehv[0].tbCoMetaTblClmnInfoList.filter((clnmInfo: TbCoMetaTblClmnInfo) => colNm === clnmInfo.metaTblClmnPhysNm)
						trgtFilter.columnLogiName = clmnInfo[0] ? clmnInfo[0].metaTblClmnLogiNm : colNm
					} else {
						trgtFilter.columnLogiName = colNm
					}
					return trgtFilter
				})
				return tempTargetFilterList
			})
		}
	}, [mstrSgmtTableandColMetaInfo, featureInfo])
	// 계산식 validation을 위한 대상 list 추출
	useEffect(() => {
		if (location.state.sqlDirectInputYn === "Y") return
		let fList = []
		for (let i = 0; i < targetList.length; i++) {
			let t = { targetId: `T${i + 1}`, dataType: "", dtpCd: "" }
			let dataType = targetList[i].targetDataType
			t.dtpCd = targetList[i].dtpCd
			// 집계함수(행동데이터의 경우)
			cmmCodeAggrRes?.result.map((option: CommonCodeInfo) => {
				if (option.cdv === targetList[i].operator) {
					dataType = option.attr1
					if (dataType === "") {
						dataType = targetList[i].targetDataType
					}
				}
				return option
			})
			// 변환식(속성데이터의 경우)
			if (targetList[i].function === "TO_NUMBER") {dataType = "number";t.dtpCd = "int"}
			if (targetList[i].function === "LENGTH") {dataType = "number";t.dtpCd = "int"}
			if (targetList[i].function === "TO_CHAR") {dataType = "string";t.dtpCd = "string"}
			if (targetList[i].function === "DATEDIFF") {dataType = "number";t.dtpCd = "int"}
			t.dataType = dataType
			fList.push(t)
		}
		setFormulaTrgtList(fList)
	}, [targetList])
	// 페이지 이동 및 버튼 처리
	const onClickPageMovHandler = (pageNm: string) => {
		if (pageNm === SelfFeatPgPpNm.LIST) {
			navigate(
				'..', 
				{ 
					state: { 
						srchInfo: location?.state?.srchInfo, 
						//pageInfo: location?.state?.pageInfo 
					} 
				}
			)
		} else if (pageNm === SelfFeatPgPpNm.EDIT) {
			if (location.state.sqlDirectInputYn !== "Y") {
				featureInfo.tbRsCustFeatRuleTrgtList = targetList
				featureInfo.tbRsCustFeatRuleTrgtFilterList = trgtFilterList
			}
			featureInfo.featureTemp.featureSeGrp = ""
			navigate(
				`../${pageNm}`,
				{
					state: {
						featureInfo: featureInfo,
						sfSubmissionRequestData: sfSubmissionRequestData,
						sfSubmissionApprovalList: sfSubmissionApprovalList,
						srchInfo: location?.state?.srchInfo,
						//pageInfo: location?.state?.pageInfo
					}
				}
			)
		} else if (pageNm === SelfFeatPgPpNm.SUB_ISRT_REQ) {
			// 승인 요청
			setModalType(ModalType.CONFIRM)
			setBtnClickType("reqInsert")
			setConfirmModalTit(ModalTitCont.SUBMISSION_INSERT_REQ.title)
			setConfirmModalCont(ModalTitCont.SUBMISSION_INSERT_REQ.context)
			setIsOpenConfirmModal(true)
		} else if (pageNm === SelfFeatPgPpNm.SUB_CANCEL) {
			// 승인 요청 취소
			setModalType(ModalType.CONFIRM)
			setBtnClickType("cancel")
			setConfirmModalTit(ModalTitCont.SUBMISSION_CANCEL.title)
			setConfirmModalCont(ModalTitCont.SUBMISSION_CANCEL.context)
			setIsOpenConfirmModal(true)
		} else if (pageNm === SelfFeatPgPpNm.DELETE) {
			// 삭제 처리
			setModalType(ModalType.CONFIRM)
			setBtnClickType("delete")
			setConfirmModalTit(ModalTitCont.DELETE.title)
			setConfirmModalCont(ModalTitCont.DELETE.context)
			setIsOpenConfirmModal(true)
		} else {
			navigate(`../${pageNm}`)
		}
	}
	// 정보 조회 API callback (Rule-Design)
	useEffect(() => {
		if (custFeatRuleInfosErr || custFeatRuleInfosRes?.successOrNot === 'N') {
			toast({
				type: ValidType.ERROR,
				content: '조회 중 에러가 발생했습니다.',
			})
		} else {
			if (custFeatRuleInfosRes?.result) {
				setFeatureInfo(cloneDeep(custFeatRuleInfosRes.result))
				// 승인 정보 호출 API parameter setting
				setSubListQueryParams({ type: FeatureType.CUST, referenceNo: location.state.id })
			}
		}
	}, [custFeatRuleInfosRes, custFeatRuleInfosErr, toast])
	// 정보 조회 API callback (SQL)
	useEffect(() => {
		if (custFeatSQLInfosErr || custFeatSQLInfosRes?.successOrNot === 'N') {
			toast({
				type: ValidType.ERROR,
				content: '조회 중 에러가 발생했습니다.',
			})
		} else {
			if (custFeatSQLInfosRes?.result) {
				setFeatureInfo(cloneDeep(custFeatSQLInfosRes.result))
				// 승인 정보 호출 API parameter setting
				setSubListQueryParams({ type: FeatureType.CUST, referenceNo: location.state.id })
			}
		}
	}, [custFeatSQLInfosRes, custFeatSQLInfosErr, toast])
	// 승인정보 호출을 위한 승인 list API refetch
	useEffect(() => {
		if (isEmpty(subListQueryParams)) return
		submissionListRefetch()
	}, [subListQueryParams, location.state.submissionStatus])
	// 승인 정보 리스트 호출 API Callback
	useEffect(() => {
		if (submissionListErr || submissionListRes?.successOrNot === 'N') {
			toast({
				type: ValidType.ERROR,
				content: '조회 중 에러가 발생했습니다.',
			})
		} else {
			if (submissionListRes?.result) {
				// 결재선 단계 및 결재자 이름 setting
				// submission info가 없는 경우 default 결재선 설정을 위해 필요
				setSfSubmissionApprovalList(() => {
					let t: Array<SfSubmissionApproval> = []
					for (let i = 0; i < 3; i++) {
						let subAprv: SfSubmissionApproval = cloneDeep(initSfSubmissionApproval)
						subAprv.approvalSequence = i + 1
						if (subAprv.approvalSequence === 1) {
							let type1 = aprvType1.find((item: SfSubmissionAppendApproval) => item.userEmail === subAprv.approver)
							subAprv.approvalSequenceNm = AprvSeqNm.FIRST
							subAprv.approverNm = type1 ? type1.userNm : ""
						}
						if (subAprv.approvalSequence === 2) {
							let type2 = aprvType2.find((item: SfSubmissionAppendApproval) => item.userEmail === subAprv.approver)
							subAprv.approvalSequenceNm = AprvSeqNm.SECOND
							subAprv.approverNm = type2 ? type2.userNm : ""
						}
						if (subAprv.approvalSequence === 3) {
							let type3 = aprvType3.find((item: SfSubmissionAppendApproval) => item.userEmail === subAprv.approver)
							subAprv.approvalSequenceNm = AprvSeqNm.LAST
							subAprv.approverNm = type3 ? type3.userNm : ""
						}
						t.push(subAprv)
					}
					return t
				})
				// 승인 정보 list는 무조건 하나?
				if (submissionListRes.result.length > 0) {
					// 승인 정보 상세 API parameter setting
					setSubmissionId(submissionListRes.result[0].id)
				}
			}
		}
	}, [submissionListRes, submissionListErr, toast])
	// 승인정보 상세 API refetch
	useEffect(() => {
		if (submissionId === 0) return
		submissionInfoRefetch()
	}, [submissionId, location.state.submissionStatus])
	// 승인정보 상세 API Callback
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
						if (rtn && rtn[i]) subAprv = cloneDeep(rtn[i])
						subAprv.approvalSequence = i + 1
						if (subAprv.approvedDate) subAprv.approvedDate = getDateFormat(subAprv.approvedDate, "YYYY-MM-DD HH:mm:ss")
						if (subAprv.approvalSequence === 1) {
							let type1 = aprvType1.find((item: SfSubmissionAppendApproval) => item.userEmail === subAprv.approver)
							subAprv.approvalSequenceNm = AprvSeqNm.FIRST
							subAprv.approverNm = type1 ? type1.userNm : ""
						}
						if (subAprv.approvalSequence === 2) {
							let type2 = aprvType2.find((item: SfSubmissionAppendApproval) => item.userEmail === subAprv.approver)
							subAprv.approvalSequenceNm = AprvSeqNm.SECOND
							subAprv.approverNm = type2 ? type2.userNm : ""
						}
						if (subAprv.approvalSequence === 3) {
							let type3 = aprvType3.find((item: SfSubmissionAppendApproval) => item.userEmail === subAprv.approver)
							subAprv.approvalSequenceNm = AprvSeqNm.LAST
							subAprv.approverNm = type3 ? type3.userNm : ""
						}
						if (
							!subAprv.status
							|| subAprv.status === ""
							|| subAprv.status === SubFeatStatus.SAVE
						) {
							subAprv.statusNm = "결재 대기"
						} else if (
							subAprv.status === SubFeatStatus.REQ
							|| subAprv.status === SubFeatStatus.IN_APRV
						) {
							subAprv.statusNm = SubFeatStatusNm.IN_APRV
						} else if (subAprv.status === SubFeatStatus.APRV) {
							subAprv.statusNm = SubFeatStatusNm.APRV
						} else if (subAprv.status === SubFeatStatus.REJT) {
							subAprv.statusNm = SubFeatStatusNm.REJT
						} else if (subAprv.status === SubFeatStatus.CNCL) {
							subAprv.statusNm = SubFeatStatusNm.CNCL
						} else if (subAprv.status === SubFeatStatus.DLET) {
							subAprv.statusNm = SubFeatStatusNm.DLET
						} else {
							subAprv.statusNm = subAprv.status
						}
						t.push(subAprv)
					}
					return t
				})
			}
		}
	}, [submissionInfoRes, submissionInfoErr, toast])
	// 결재선 이름 setting
	// useEffect(() => {
	// 	if (isEmpty(aprvType1)) return

	// 	setSfSubmissionApprovalList((prevState: Array<SfSubmissionApproval>) => {
	// 		let rtn = cloneDeep(prevState)
	// 		rtn = rtn.map((approval: SfSubmissionApproval) => {
	// 			if (approval.approvalSequence === 1) {
	// 				let type1 = aprvType1.find((item: SfSubmissionAppendApproval) => item.userEmail === approval.approver)
	// 				approval.approverNm = type1 ? type1.userNm : ""
	// 			}
	// 			if (approval.approvalSequence === 2) {
	// 				let type2 = aprvType2.find((item: SfSubmissionAppendApproval) => item.userEmail === approval.approver)
	// 				approval.approverNm = type2 ? type2.userNm : ""
	// 			}
	// 			if (approval.approvalSequence === 3) {
	// 				let type3 = aprvType3.find((item: SfSubmissionAppendApproval) => item.userEmail === approval.approver)
	// 				approval.approverNm = type3 ? type3.userNm : ""
	// 			}
	// 			return approval
	// 		})
	// 		return rtn
	// 	})
	// }, [aprvType1, aprvType2, aprvType3])
	// 승인요청 API 호출
	const insertSubmissionRequest = () => {
		if (!sessionInfo.userEmail) {
			console.log("no session info email")
			toast({
				type: ValidType.ERROR,
				content: '승인 요청 중 에러가 발생했습니다',
			})
			return
		}
		setUserEmail(sessionInfo.userEmail)
		insrtSubReqMutate()
	}
	// 승인요청 API Callback
	useEffect(() => {
		if (insrtSubReqErr || insrtSubReqRes?.successOrNot === 'N') {
			toast({
				type: ValidType.ERROR,
				content: insrtSubReqRes?.message ? insrtSubReqRes?.message : '승인 요청 중 에러가 발생했습니다.',
			})
		} else if (insrtSubReqSucc) {
			toast({
				type: ValidType.CONFIRM,
				content: '승인 요청 되었습니다.',
			})
			featureInfo.tbRsCustFeatRule.id = insrtSubReqRes.result.referenceNo
			featureInfo.tbRsCustFeatRule.submissionStatus = insrtSubReqRes.result.status
			// 상세로 redirect
			navigate(`../${SelfFeatPgPpNm.DETL}`, { state: featureInfo.tbRsCustFeatRule })
		}
	}, [insrtSubReqRes, insrtSubReqSucc, insrtSubReqErr])
	// 승인요청 취소 API 호출
	const cancelRequestSubmission = () => {
		if (!sessionInfo.userEmail) {
			console.log("no session info email")
			toast({
				type: ValidType.ERROR,
				content: '승인요청 취소 중 에러가 발생했습니다',
			})
			return
		}
		setUserEmail(sessionInfo.userEmail)
		cnclReqSubMutate()
	}
	// 승인요청 취소 API Callback
	useEffect(() => {
		if (cnclReqSubErr || cnclReqSubRes?.successOrNot === 'N') {
			toast({
				type: ValidType.ERROR,
				content: cnclReqSubRes?.message ? cnclReqSubRes?.message : '승인요청 취소 중 에러가 발생했습니다.',
			})
		} else if (cnclReqSubSucc) {
			toast({
				type: ValidType.CONFIRM,
				content: '승인요청이 취소 되었습니다.',
			})
			featureInfo.tbRsCustFeatRule.id = cnclReqSubRes.result.referenceNo
			featureInfo.tbRsCustFeatRule.submissionStatus = cnclReqSubRes.result.status
			// 상세로 redirect
			navigate(`../${SelfFeatPgPpNm.DETL}`, { state: featureInfo.tbRsCustFeatRule })
		}
	}, [cnclReqSubRes, cnclReqSubSucc, cnclReqSubErr])
	// 삭제 param setting & mutate
	const deleteCustFeatRule = () => {
		let custFeatRuleIds: Array<string> = []
		custFeatRuleIds.push(featureInfo.tbRsCustFeatRule.id)
		setFeatureDeleteQueryParams({ custFeatRuleIds: custFeatRuleIds.toString() })
		featureDeleteMutate()
	}
	// 삭제 처리 API Callback
	useEffect(() => {
		if (featureDeleteErr || featureDeleteRes?.successOrNot === 'N') {
			toast({
				type: ValidType.ERROR,
				content: featureDeleteRes?.message ? featureDeleteRes?.message : '삭제 중 에러가 발생했습니다.',
			})
		} else if (featureDeleteSucc) {
			toast({
				type: ValidType.CONFIRM,
				content: '삭제 되었습니다.',
			})
			// 목록으로 redirect
			navigate('..')
		}
	}, [featureDeleteRes, featureDeleteSucc, featureDeleteErr])
	// feature 승인 상태에 따른 버튼 노출
	const DetailBtnComponent = () => {
		if (
			!location.state.submissionStatus
			|| location.state.submissionStatus === ""
			|| location.state.submissionStatus === SubFeatStatus.SAVE
		) {
			// 등록
			return (
				<Stack justifyContent="End" gap="SM" className="width-100">
					<Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(SelfFeatPgPpNm.LIST)}>
						목록
					</Button>
					<Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(SelfFeatPgPpNm.DELETE)}>
						삭제
					</Button>
					<Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(SelfFeatPgPpNm.EDIT)}>
						수정
					</Button>
					<Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(SelfFeatPgPpNm.SUB_ISRT_REQ)}>
						승인 요청
					</Button>
				</Stack>
			)
		} else if (location.state.submissionStatus === SubFeatStatus.REQ) {
			// 승인 요청
			return (
				<Stack justifyContent="End" gap="SM" className="width-100">
					<Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(SelfFeatPgPpNm.LIST)}>
						목록
					</Button>
					{/* <Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(SelfFeatPgPpNm.DELETE)}>
						삭제
					</Button>
					<Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(SelfFeatPgPpNm.EDIT)}>
						수정
					</Button> */}
					<Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(SelfFeatPgPpNm.SUB_CANCEL)}>
						요청 취소
					</Button>
				</Stack>
			)
		} else if (location.state.submissionStatus === SubFeatStatus.IN_APRV) {
			// 결재 진행이지만 1차 승인 이전의 상태인 경우만 요청 취소 버튼 노출
			return (
				<Stack justifyContent="End" gap="SM" className="width-100">
					<Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(SelfFeatPgPpNm.LIST)}>
						목록
					</Button>
					{/* <Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(SelfFeatPgPpNm.SUB_CANCEL)}>
            요청 취소
          </Button> */}
				</Stack>
			)
		} else if (location.state.submissionStatus === SubFeatStatus.APRV) {
			// 승인 완료
			return (
				<Stack justifyContent="End" gap="SM" className="width-100">
					<Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(SelfFeatPgPpNm.LIST)}>
						목록
					</Button>
				</Stack>
			)
		} else if (location.state.submissionStatus === SubFeatStatus.REJT) {
			// 반려
			return (
				<Stack justifyContent="End" gap="SM" className="width-100">
					<Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(SelfFeatPgPpNm.LIST)}>
						목록
					</Button>
					<Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(SelfFeatPgPpNm.DELETE)}>
						삭제
					</Button>
					<Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(SelfFeatPgPpNm.EDIT)}>
						수정
					</Button>
				</Stack>
			)
		} else {
			return (
				<Stack justifyContent="End" gap="SM" className="width-100">
					<Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(SelfFeatPgPpNm.LIST)}>
						목록
					</Button>
				</Stack>
			)
		}
	}
	// 수동실행 API 호출
	const runScheduleByManually = () => {
		if (location.state.id && location.state.id !== "") {
			if (featureInfo.tbRsCustFeatRule.batManualExecTestCnt > 5) {
				toast({
					type: ValidType.ERROR,
					content: '수동 가능한 횟수는 5회 입니다.',
				})
				return
			}
			runScheduleByManuallyMutate()
		} else {
			console.log("no custFeatRuleId! please check custFeatRuleId")
			toast({
				type: ValidType.ERROR,
				content: '수동 실행 중 에러가 발생했습니다.',
			})
		}
	}
	// 수동실행 API callback
	useEffect(() => {
		if (runScheduleByManuallyErr || runScheduleByManuallyRes?.successOrNot === 'N') {
			toast({
				type: ValidType.ERROR,
				content: runScheduleByManuallyRes?.message ? runScheduleByManuallyRes?.message : '수동 실행 중 에러가 발생했습니다.',
			})
		} else if (runScheduleByManuallySucc) {
			toast({
				type: ValidType.CONFIRM,
				content: '수동 실행이 완료되었습니다.',
			})
			if (runScheduleByManuallyRes.status === 200) {
				if (location.state.sqlDirectInputYn !== "Y") {
					custFeatRuleInfosRefetch()
				} else if (location.state.sqlDirectInputYn === "Y") {
					custFeatSQLInfosRefetch()
				}
			}
		}
	}, [runScheduleByManuallyRes, runScheduleByManuallySucc, runScheduleByManuallyErr, toast])

	return (
		<Stack direction="Vertical" gap="MD" justifyContent="Between" className='height-100'>
			{/* 상단 버튼 영역 */}
			<Stack direction="Horizontal" gap="MD" justifyContent="End">
				<Button size="LG" onClick={runScheduleByManually}>
					수동 실행
				</Button>
				<FeatQueryRsltButton
					rslnRuleId={rslnRuleIdParam}
					mstrSgmtRuleId={mstrSgmtRuleIdParam}
					custFeatRuleId={location.state.id}
				/>
			</Stack>

			{/* 정보 영역 */}
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
							{(
								!featureInfo.tbRsCustFeatRule.submissionStatus
								|| featureInfo.tbRsCustFeatRule.submissionStatus === ""
								|| featureInfo.tbRsCustFeatRule.submissionStatus === SubFeatStatus.SAVE
							) &&
								SubFeatStatusNm.SAVE
							}
							{(
								featureInfo.tbRsCustFeatRule.submissionStatus === SubFeatStatus.REQ
								|| featureInfo.tbRsCustFeatRule.submissionStatus === SubFeatStatus.IN_APRV
							) &&
								SubFeatStatusNm.IN_APRV
							}
							{featureInfo.tbRsCustFeatRule.submissionStatus === SubFeatStatus.APRV &&
								SubFeatStatusNm.APRV
							}
							{featureInfo.tbRsCustFeatRule.submissionStatus === SubFeatStatus.REJT &&
								SubFeatStatusNm.REJT
							}
							{featureInfo.tbRsCustFeatRule.submissionStatus === SubFeatStatus.CNCL &&
								SubFeatStatusNm.CNCL
							}
							{featureInfo.tbRsCustFeatRule.submissionStatus === SubFeatStatus.DLET &&
								SubFeatStatusNm.DLET
							}
						</TD>
					</TR>
					<TR>
						<TH colSpan={1} align="right">
							요청 일시
						</TH>
						<TD colSpan={5} align="left">
							{sfSubmissionRequestData.requestDate && getDateFormat(sfSubmissionRequestData.requestDate, "YYYY-MM-DD HH:mm:ss")}
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
							{featureInfo.tbRsCustFeatRule &&
								categoryOption.find((cate) => cate.cdv === featureInfo.tbRsCustFeatRule.category)?.cdvNm
							}
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
					{/* <TR>
						<TH colSpan={1} align="right">연관테이블</TH>
						<TD colSpan={5} align='left'>
							{featureInfo.featureTemp && featureInfo.featureTemp.featureRelTb}
						</TD>
					</TR> */}
					<TR>
						<TH colSpan={1} align="right">비고</TH>
						<TD colSpan={5} align='left'>
							{featureInfo.featureTemp && featureInfo.featureTemp.featureDsc}
						</TD>
					</TR>
				</HorizontalTable>
				{/* 기본 정보 */}
				{/* 신청 정보 SQL 등록 */}
				{featureInfo.tbRsCustFeatRule.sqlDirectInputYn === "Y" &&
					<Stack
						style={{
							marginBottom: "2%"
						}}
						direction="Vertical"
						gap="MD"
					>
						<Typography variant="h4">신청 정보</Typography>
						<HorizontalTable>
							<TR>
								<TH align="right" colSpan={1}>
									Feature 신청자
								</TH>
								<TD colSpan={2}>
									<Stack gap="SM" className="width-100" direction="Vertical">
										<Stack gap="SM">
											{featureInfo.featureTemp && featureInfo.featureTemp.enrUserNm}
										</Stack>
									</Stack>
								</TD>
								<TH align="right" colSpan={1}>
									신청부서
								</TH>
								<TD colSpan={2}>
									<Stack gap="SM" className="width-100" direction="Vertical">
										{featureInfo.featureTemp &&
											deptOption.find((dept) => dept.deptCode === featureInfo.featureTemp.enrDeptCode)?.deptNm
										}
									</Stack>
								</TD>
							</TR>
						</HorizontalTable>
					</Stack>
				}
				{/* 신청 정보 SQL 등록 */}
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
										featStatus={SelfFeatPgPpNm.DETL}
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
							featStatus={SelfFeatPgPpNm.DETL}
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