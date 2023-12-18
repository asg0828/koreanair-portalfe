import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { cloneDeep, isEmpty } from 'lodash'
import { SelectValue } from '@mui/base/useSelect'
import { useAppDispatch } from '@/hooks/useRedux'
import { openModal } from '@/reducers/modalSlice'

import DragList from '@/components/self-feature/DragList'
import DropList from '@/components/self-feature/DropList'
import CalcValid from '@/components/self-feature/CalcValid'
import HorizontalTable from '@/components/table/HorizontalTable'
import { Button, Select, SelectOption, Stack, TD, TH, TR, TextField, Typography, useToast } from '@components/ui'
import ConfirmModal from '@/components/modal/ConfirmModal'
import ApprovalList from '@/components/self-feature/ApprovalList'
import { ModalType, } from '@/models/common/Constants'

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
	CustFeatureFormData,
} from '@/models/selfFeature/FeatureModel'
import {
	initSelfFeatureInfo,
	initMstrSgmtTableandColMetaInfo,
	initTbRsCustFeatRule,
	initTbRsCustFeatRuleCalc,
	initFeatureTemp,
	initTbRsCustFeatRuleSql,
	initCustFeatureFormData,
	initCustFeatureFormDataSql,
} from './data'
import {
	SubFeatStatus,
	SelfFeatPgPpNm,
	//ModalType,
	ModalTitCont,
	CommonCode,
	CommonCodeInfo,
} from '@/models/selfFeature/FeatureCommon'
import { UserModel } from '@/models/model/UserModel'
import { AprvSeqNm, SfSubmissionAppendApproval, SfSubmissionApproval, SfSubmissionRequestInfo } from '@/models/selfFeature/FeatureSubmissionModel'
import { initSfSubmissionApproval, initSfSubmissionRequestInfo } from '../self-feature-submission/data'
import {
	//GroupCodeType, 
	ValidType,
} from '@/models/common/Constants'
import { FeatureSeparatesModel } from '@/models/model/FeatureModel'

//import { selectCodeList } from '@/reducers/codeSlice'
import { useApproverCandidate, useGetTableandColumnMetaInfoByMstrSgmtRuleId } from '@/hooks/queries/self-feature/useSelfFeatureUserQueries'
import { useCommCodes } from '@/hooks/queries/self-feature/useSelfFeatureCmmQueries'
import { useFeatureSeList, useFeatureTypList } from '@/hooks/queries/useFeatureQueries'
import { useCreateCustFeatRule, useCreateCustFeatSQL } from '@/hooks/mutations/self-feature/useSelfFeatureUserMutations'
import { validationCustReatRule } from '@/utils/self-feature/FormulaValidUtil'
import { selectSessionInfo } from '@/reducers/authSlice'
import { useAppSelector } from '@/hooks/useRedux'
import { initMstrProfSearchInfoProps } from '@/pages/admin/self-feature-meta-management/master-profile-management/data'
import { useMstrProfList } from '@/hooks/queries/self-feature/useSelfFeatureAdmQueries'

const SelfFeatureReg = () => {

	const navigate = useNavigate()
	const location = useLocation()
	const { toast } = useToast()
	const sessionInfo = useAppSelector(selectSessionInfo())
	const dispatch = useAppDispatch()
	// 사용될 rslnRuleId / mstrSgmtRuleId 조회
	const { data: mstrProfListRes, isError: mstrProfListErr, refetch: mstrProfListRefetch } = useMstrProfList(initMstrProfSearchInfoProps)
	// rslnRuleId parameter
	const [rslnRuleIdParam, setRslnRuleIdParam] = useState<string>("")
	// mstrSgmtRuleId parameter
	const [mstrSgmtRuleIdParam, setMstrSgmtRuleIdParam] = useState<string>("")
	// 속성, 행동정보
	const { data: mstrSgmtTbandColRes, isError: mstrSgmtTbandColErr, refetch: mstrSgmtTbandColRefetch } = useGetTableandColumnMetaInfoByMstrSgmtRuleId(mstrSgmtRuleIdParam)

	const { data: cmmCodeAggrRes } = useCommCodes(CommonCode.STAC_CALC_TYPE)
	const { } = useCommCodes(CommonCode.FUNCTION)
	const { } = useCommCodes(CommonCode.OPERATOR)
	const { } = useCommCodes(CommonCode.FORMAT)
	const { } = useCommCodes(CommonCode.SGMT_DELIMITER)
	// 대구분
	const { data: seGroupRes, isError: seGroupErr } = useFeatureTypList()
	const [featureSeGrpList, setFeatureSeGrpList] = useState<Array<FeatureSeparatesModel>>([])
	// 중구분
	const [seGrpId, setSeGrpId] = useState<string>("")
	const { refetch: seRefetch, data: seRes, isError: seErr } = useFeatureSeList(seGrpId)
	const [featureSeList, setFeatureSeList] = useState<Array<FeatureSeparatesModel>>([])
	// 픽처타입
	//const codeList = useAppSelector(selectCodeList(GroupCodeType.FEATURE_TYPE))
	// 등록 구분(RuleDesign / SQL)
	const [regType, setRegType] = useState<string>(location.state ? location.state.regType : SelfFeatPgPpNm.RULE_REG)
	// 한글 및 영문 입력시 입력값
	const [featureKoNmInput, setFeatureKoNmInput] = useState<string>("")
	const [featureEnNmInput, setFeatureEnNmInput] = useState<string>("")
	// formData
	const [custFeatureFormData, setCustFeatureFormData] = useState<CustFeatureFormData>(cloneDeep(initCustFeatureFormData))
	// Customer Feature 정보
	const [featureInfo, setFeatureInfo] = useState<FeatureInfo>(cloneDeep(initSelfFeatureInfo))
	// 기본정보
	const [featureTempInfo, setFeatureTempInfo] = useState<FeatureTemp>(cloneDeep(initFeatureTemp))
	const [custFeatRule, setCustFeatRule] = useState<TbRsCustFeatRule>(cloneDeep(initTbRsCustFeatRule))
	// 대상선택
	const [targetList, setTargetList] = useState<Array<TbRsCustFeatRuleTrgt>>([])
	const [trgtFilterList, setTrgtFilterList] = useState<Array<TbRsCustFeatRuleTrgtFilter>>([])
	// SQL 입력
	const [sqlQueryInfo, setSqlQueryInfo] = useState<TbRsCustFeatRuleSql>(cloneDeep(initTbRsCustFeatRuleSql))
	// 계산식
	const [custFeatRuleCalc, setCustFeatRuleCalc] = useState<TbRsCustFeatRuleCalc>(cloneDeep(initTbRsCustFeatRuleCalc))
	const [custFeatRuleCaseList, setCustFeatRuleCaseList] = useState<Array<TbRsCustFeatRuleCase>>([])
	const [formulaTrgtList, setFormulaTrgtList] = useState<Array<FormulaTrgtListProps>>([])
	const [isValidFormula, setIsValidFormula] = useState<Boolean>(true)
	// 승인 정보
	const [sfSubmissionRequestData, setSfSubmissionRequestData] = useState<SfSubmissionRequestInfo>(cloneDeep(initSfSubmissionRequestInfo))
	const [sfSubmissionApprovalList, setSfSubmissionApprovalList] = useState<Array<SfSubmissionApproval>>([])
	// 결재선
	const [aprvList, setAprvList] = useState<Array<SfSubmissionAppendApproval>>([])
	const [aprvType1, setAprvType1] = useState<Array<SfSubmissionAppendApproval>>([])
	const [aprvType2, setAprvType2] = useState<Array<SfSubmissionAppendApproval>>([])
	const [aprvType3, setAprvType3] = useState<Array<SfSubmissionAppendApproval>>([])
	const { data: approverCandidateRes, isError: approverCandidateErr } = useApproverCandidate()
	// 속성 및 행동 데이터
	const [mstrSgmtTableandColMetaInfo, setMstrSgmtTableandColMetaInfo] = useState<MstrSgmtTableandColMetaInfo>(cloneDeep(initMstrSgmtTableandColMetaInfo))
	// Top 집계함수 선택 여부
	const [isSelectAggregateTop, setIsSelectAggregateTop] = useState<Boolean>(false)
	// 대상 선택 초기화
	const [clickType, setClickType] = useState<string>('')
	// 모달
	const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)
	const [confirmModalTit, setConfirmModalTit] = useState<string>('')
	const [confirmModalCont, setConfirmModalCont] = useState<string>('')
	const [modalType, setModalType] = useState<string>('')
	// 등록 API(Rule-Design / SQL)
	const { data: createRuleDesignRes, isSuccess: createRuleDesignSucc, isError: createRuleDesignErr, mutate: createRuleDesignMutate } = useCreateCustFeatRule(custFeatureFormData)
	const { data: createSQLRes, isSuccess: createSQLSucc, isError: createSQLErr, mutate: createSQLMutate } = useCreateCustFeatSQL(custFeatureFormData)

	// session 값 setting
	useEffect(() => {
		if (!sessionInfo.deptCode) return
		setCustFeatRule((state: TbRsCustFeatRule) => {
			let rtn = cloneDeep(state)
			if (sessionInfo.deptCode) {
				rtn.userTeamNm = sessionInfo.deptCode
			}
			return rtn
		})
	}, [sessionInfo])
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
                let t = mstrProfListRes.result[mstrProfListRes.result.length - 1]
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
        if (location.state.regType === SelfFeatPgPpNm.RULE_REG) mstrSgmtTbandColRefetch()
    }, [mstrSgmtRuleIdParam, location.state.regType])
	// location값으로 Rule Design / SQL 구분(default :: Rule Design)
	useEffect(() => {
		if (!location.state || !location.state.regType || location.state.regType === "") {
			setRegType(SelfFeatPgPpNm.RULE_REG)
		} else {
			setRegType(location.state.regType)
		}
	}, [location.state])

	// modal 확인/취소 이벤트
	const onConfirm = () => {
		if (modalType === ModalType.CONFIRM) {
			if (clickType === "insertInfo") {
				if (regType === SelfFeatPgPpNm.RULE_REG) {
					createCustFeatRule()
				} else if (regType === SelfFeatPgPpNm.SQL_REG) {
					createCustFeatSQL()
				}
			}
			// 대상선택 초기화
			if (clickType === "trgtClear") {
				setTargetList([])
				setTrgtFilterList([])
			}
		}
		setIsOpenConfirmModal(false)
	}
	const onCancel = () => {
		setIsOpenConfirmModal(false)
	}
	// mount 시 수행
	useEffect(() => {
		initCustFeatRule()
		// if (regType === SelfFeatPgPpNm.RULE_REG) mstrSgmtTbandColRefetch()
	}, [])
	// 속성,행동데이터 response callback
	useEffect(() => {
		if (mstrSgmtTbandColErr || mstrSgmtTbandColRes?.successOrNot === 'N') {
			toast({
				type: ValidType.ERROR,
				content: '조회 중 에러가 발생했습니다.',
			})
		} else {
			if (mstrSgmtTbandColRes) {
				if (location.state.regType === SelfFeatPgPpNm.SQL_REG) return
				setMstrSgmtTableandColMetaInfo(cloneDeep(mstrSgmtTbandColRes.result))
			}
		}
	}, [mstrSgmtTbandColRes, mstrSgmtTbandColErr])
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
				setAprvList(approverCandidateRes.result)
			}
		}
	}, [approverCandidateRes, approverCandidateErr, toast])
	// 결재선 default 결재자 지정
	// 1차 운영 결재자
	useEffect(() => {
		if (isEmpty(aprvType1)) return

		setSfSubmissionApprovalList((prevState: Array<SfSubmissionApproval>) => {
			let rtn = cloneDeep(prevState)
			let type1 = aprvType1.find((item: SfSubmissionAppendApproval) => item.isPriority)
			rtn = rtn.map((approval: SfSubmissionApproval) => {
				if (approval.approvalSequence === 1) {
					approval.approver = type1 ? type1.userEmail : ""
					approval.approverNm = type1 ? type1.userNm : ""
				}
				return approval
			})
			return rtn
		})
	}, [aprvType1])
	// 2차 품질 결재자
	useEffect(() => {
		if (isEmpty(aprvType2)) return

		setSfSubmissionApprovalList((prevState: Array<SfSubmissionApproval>) => {
			let rtn = cloneDeep(prevState)
			let type2 = aprvType2.find((item: SfSubmissionAppendApproval) => item.isPriority)
			rtn = rtn.map((approval: SfSubmissionApproval) => {
				if (approval.approvalSequence === 2) {
					approval.approver = type2 ? type2.userEmail : ""
					approval.approverNm = type2 ? type2.userNm : ""
				}
				return approval
			})
			return rtn
		})

	}, [aprvType2])
	// 최종 승인 결재자
	useEffect(() => {
		if (isEmpty(aprvType3)) return

		setSfSubmissionApprovalList((prevState: Array<SfSubmissionApproval>) => {
			let rtn = cloneDeep(prevState)
			let type3 = aprvType3.find((item: SfSubmissionAppendApproval) => item.isPriority)
			rtn = rtn.map((approval: SfSubmissionApproval) => {
				if (approval.approvalSequence === 3) {
					approval.approver = type3 ? type3.userEmail : ""
					approval.approverNm = type3 ? type3.userNm : ""
				}
				return approval
			})
			return rtn
		})

	}, [aprvType3])
	// 정보초기화
	const initCustFeatRule = () => {
		setFeatureInfo((state: FeatureInfo) => {
			let rtn = cloneDeep(state)
			rtn = cloneDeep(initSelfFeatureInfo)
			if (rtn.tbRsCustFeatRule.rslnRuleId === "") rtn.tbRsCustFeatRule.rslnRuleId = rslnRuleIdParam
			if (rtn.tbRsCustFeatRule.mstrSgmtRuleId === "") rtn.tbRsCustFeatRule.mstrSgmtRuleId = mstrSgmtRuleIdParam
			return rtn
		})
		// 초기 결재 단계 이름 setting
		setSfSubmissionApprovalList(() => {
			let t: Array<SfSubmissionApproval> = []
			for (let i = 0; i < 3; i++) {
				let subAprv: SfSubmissionApproval = cloneDeep(initSfSubmissionApproval)
				subAprv.approvalSequence = i + 1
				if (subAprv.approvalSequence === 1) subAprv.approvalSequenceNm = AprvSeqNm.FIRST
				else if (subAprv.approvalSequence === 2) subAprv.approvalSequenceNm = AprvSeqNm.SECOND
				else if (subAprv.approvalSequence === 3) subAprv.approvalSequenceNm = AprvSeqNm.LAST
				t.push(subAprv)
			}
			return t
		})
	}
	// 기본 정보 입력시 formData setting
	useEffect(() => {
		setFeatureInfo((state: FeatureInfo) => {
			let rtn = cloneDeep(state)
			rtn.tbRsCustFeatRule = cloneDeep(custFeatRule)
			if (rtn.tbRsCustFeatRule.rslnRuleId === "") rtn.tbRsCustFeatRule.rslnRuleId = rslnRuleIdParam
			if (rtn.tbRsCustFeatRule.mstrSgmtRuleId === "") rtn.tbRsCustFeatRule.mstrSgmtRuleId = mstrSgmtRuleIdParam
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
		if (location.state.regType === SelfFeatPgPpNm.SQL_REG) return
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
			let t = { targetId: `T${i + 1}`, dataType: "" }
			let dataType = targetList[i].targetDataType
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
			if (targetList[i].function === "TO_NUMBER") dataType = "number"
			if (targetList[i].function === "LENGTH") dataType = "number"
			if (targetList[i].function === "TO_CHAR") dataType = "string"
			if (targetList[i].function === "DATEDIFF") dataType = "number"
			t.dataType = dataType
			fList.push(t)
		}
		setFormulaTrgtList(fList)
	}, [targetList])
	useEffect(() => {
		if (location.state.regType === SelfFeatPgPpNm.SQL_REG) return
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
		if (location.state.regType === SelfFeatPgPpNm.SQL_REG) return
		setFeatureInfo((state: FeatureInfo) => {
			let rtn = cloneDeep(state)
			rtn.tbRsCustFeatRuleCalc = cloneDeep(custFeatRuleCalc)
			return rtn
		})
	}, [custFeatRuleCalc])
	// 계산식 case문 formData setting
	useEffect(() => {
		//if (location.state.regType === SelfFeatPgPpNm.SQL_REG) return
		// setFeatureInfo((state: FeatureInfo) => {
		// 	let rtn = cloneDeep(state)
		// 	rtn.tbRsCustFeatRuleCaseList = cloneDeep(custFeatRuleCaseList)
		// 	return rtn
		// })
	}, [custFeatRuleCaseList])
	// 대상 선택 list가 없는 경우 formula reset
	useEffect(() => {
		if (location.state.regType === SelfFeatPgPpNm.SQL_REG) return
		if (formulaTrgtList.length > 0) return

		setCustFeatRuleCalc((state: TbRsCustFeatRuleCalc) => {
			let rtn = cloneDeep(state)
			rtn.formula = ''
			return rtn
		})

	}, [formulaTrgtList])
	// 대구분 선택시 중구분 select option setting
	useEffect(() => {
		if (seGrpId) {
			seRefetch()
		}
	}, [seGrpId, seRefetch])
	// 중구분 API response callback
	useEffect(() => {
		if (seErr || seRes?.successOrNot === 'N') {
			toast({
				type: ValidType.ERROR,
				content: '조회 중 에러가 발생했습니다.',
			})
		} else {
			if (seRes?.data) {
				setFeatureSeList(seRes.data);
			}
		}
	}, [seRes, seErr, toast])
	// 대구분 API response callback
	useEffect(() => {
		if (seGroupErr || seGroupRes?.successOrNot === 'N') {
			toast({
				type: ValidType.ERROR,
				content: '조회 중 에러가 발생했습니다.',
			})
		} else {
			if (seGroupRes?.data) {
				setFeatureSeGrpList(seGroupRes.data);
			}
		}
	}, [seGroupRes, seGroupErr, toast])
	// 등록 API 호출(Rule-Design)
	const createCustFeatRule = () => {
		if (!isValidFormula) {
			toast({
				type: ValidType.ERROR,
				content: ModalTitCont.REG_VALID.context,
			})
			return
		}
		featureInfo.tbRsCustFeatRule.sqlDirectInputYn = "N"
		let param: any = cloneDeep(initCustFeatureFormData)
		param.customerFeature = featureInfo
		delete param.customerFeature.tbRsCustFeatRuleCaseList
		delete param.customerFeature.tbRsCustFeatRuleSql
		param.submissionInfo.submission = sfSubmissionRequestData
		param.submissionInfo.approvals = sfSubmissionApprovalList
		let validRslt = validationCustReatRule(param)
		if (!validRslt.valid) {
			toast({
				type: ValidType.ERROR,
				content: validRslt.text,
			})
			return
		}
		setCustFeatureFormData(param)
		createRuleDesignMutate()
	}
	// 등록 API 호출 Call back(Rule-Design)
	useEffect(() => {
		if (createRuleDesignErr || createRuleDesignRes?.successOrNot === 'N') {
			toast({
				type: ValidType.ERROR,
				content: createRuleDesignRes?.message ? createRuleDesignRes?.message : '등록 중 에러가 발생했습니다.',
			})
		} else if (createRuleDesignSucc) {
			toast({
				type: ValidType.CONFIRM,
				content: '등록되었습니다.',
			})
			featureInfo.tbRsCustFeatRule.id = createRuleDesignRes.result.customerFeatureId
			featureInfo.tbRsCustFeatRule.submissionStatus = SubFeatStatus.SAVE
			featureInfo.tbRsCustFeatRule.sqlDirectInputYn = "N"
			// 상세로 redirect
			navigate(
				`../${SelfFeatPgPpNm.DETL}`, 
				{ 
					state: {
						...featureInfo.tbRsCustFeatRule, 
						...{ 
							srchInfo: location?.state?.srchInfo, 
							//pageInfo: location?.state?.pageInfo 
						}
					} 
				}
			)
		}
	}, [createRuleDesignRes, createRuleDesignSucc, createRuleDesignErr, toast])

	// 등록 API 호출(SQL)
	const createCustFeatSQL = () => {
		featureInfo.tbRsCustFeatRule.sqlDirectInputYn = "Y"
		let param: any = cloneDeep(initCustFeatureFormDataSql)
		param.customerFeatureSql = featureInfo
		delete param.customerFeatureSql.tbRsCustFeatRuleCalc
		delete param.customerFeatureSql.tbRsCustFeatRuleCaseList
		delete param.customerFeatureSql.tbRsCustFeatRuleTrgtList
		delete param.customerFeatureSql.tbRsCustFeatRuleTrgtFilterList
		param.submissionInfo.submission = sfSubmissionRequestData
		param.submissionInfo.approvals = sfSubmissionApprovalList
		let validRslt = validationCustReatRule(param)
		if (!validRslt.valid) {
			toast({
				type: ValidType.ERROR,
				content: validRslt.text,
			})
			return
		}
		setCustFeatureFormData(param)
		createSQLMutate()
	}
	// 등록 API 호출 Call back(SQL)
	useEffect(() => {
		if (createSQLErr || createSQLRes?.successOrNot === 'N') {
			toast({
				type: ValidType.ERROR,
				content: createSQLRes?.message ? createSQLRes?.message : '등록 중 에러가 발생했습니다.',
			})
		} else if (createSQLSucc) {
			toast({
				type: ValidType.CONFIRM,
				content: '등록되었습니다.',
			})
			featureInfo.tbRsCustFeatRule.id = createSQLRes.result.customerFeatureId
			featureInfo.tbRsCustFeatRule.submissionStatus = SubFeatStatus.SAVE
			featureInfo.tbRsCustFeatRule.sqlDirectInputYn = "Y"
			// 상세로 redirect
			navigate(
				`../${SelfFeatPgPpNm.DETL}`, 
				{ 
					state: {
						...featureInfo.tbRsCustFeatRule, 
						...{ 
							srchInfo: location?.state?.srchInfo, 
							//pageInfo: location?.state?.pageInfo 
						}
					}
				}
			)
		}
	}, [createSQLRes, createSQLSucc, createSQLErr, toast])

	// input 입력 변경시
	const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target
		let inputValue = cloneDeep(value)
		// 한글명 영문명 입력시 value 값 수정(한글 - 한글+영문+숫자만 / 영문 - 영문+숫자만)
		if (id === "featureKoNm") {
			inputValue = value.replace(/[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣|0-9|a-z|A-Z|\s|_]/g, "")
			setFeatureKoNmInput(inputValue)
		}
		if (id === "featureEnNm") {
			inputValue = value.replace(/[^a-z|A-Z|0-9|\s|_]/g, "")
			setFeatureEnNmInput(inputValue)
		}

		setCustFeatRule((state: TbRsCustFeatRule) => {
			let rtn = cloneDeep(state)
			Object.keys(rtn).map((key) => {
				if (key === id) {
					rtn[key] = inputValue
				}
				return key
			})
			// feature temp에 들어가는 값 중 setting 되어야하는 값 설정
			if (id === "featureKoNm") rtn.name = inputValue
			if (id === "featureDef") rtn.description = inputValue
			return rtn
		})
		// 승인 필수 정보 default setting
		setSfSubmissionRequestData((state: SfSubmissionRequestInfo) => {
			let rtn = cloneDeep(state)
			if (id === "featureKoNm") rtn.title = `${inputValue}_승인정보`
			if (id === "featureDef") rtn.content = `${inputValue}_승인정보`
			return rtn
		})
		setSqlQueryInfo((state: TbRsCustFeatRuleSql) => {
			let rtn = cloneDeep(state)
			if (rtn) {
				Object.keys(rtn).map((key) => {
					if (key === id) {
						rtn[key] = inputValue
					}
					return key
				})
			}
			return rtn
		})
		setFeatureTempInfo((state: FeatureTemp) => {
			let rtn = cloneDeep(state)
			Object.keys(rtn).map((key) => {
				if (key === id) {
					rtn[key] = inputValue
				}
				return key
			})
			return rtn
		})
	}
	// select box 선택시
	const onchangeSelectHandler = (
		e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
		value: SelectValue<{}, false>,
		id?: String
	) => {
		let keyNm = String(id)
		let v = String(value)
		if (v === "null" || v === "undefined") return

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
			if (rtn) {
				Object.keys(rtn).map((key) => {
					if (key === keyNm) {
						rtn[key] = v
					}
					return key
				})
			}
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
		// 대구분 선택시 중구분 select ooption Group ID setting
		if (keyNm === "featureSeGrp") {
			setSeGrpId(v)
			setFeatureTempInfo((state: FeatureTemp) => {
				let rtn = cloneDeep(state)
				Object.keys(rtn).map((key) => {
					if (key === "featureSe") {
						rtn[key] = ""
					}
					return key
				})
				return rtn
			})
		}
	}
	// 페이지 이동
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
		} else {
			navigate(`../${pageNm}`)
		}
	}
	// 대상선택 초기화
	const targetClearHanbler = () => {
		if (targetList.length < 1) return

		setModalType(ModalType.CONFIRM)
		setClickType("trgtClear")
		setConfirmModalTit(ModalTitCont.TRGT_CLEAR.title)
		setConfirmModalCont(ModalTitCont.TRGT_CLEAR.context)
		setIsOpenConfirmModal(true)
	}
	// 저장 버튼 클릭시
	const onSubmitInsertHandler = () => {
		setModalType(ModalType.CONFIRM)
		setClickType("insertInfo")
		setConfirmModalTit(ModalTitCont.REG.title)
		setConfirmModalCont(ModalTitCont.REG.context)
		setIsOpenConfirmModal(true)
	}
	const handleUserSelectModal = () => {
		dispatch(
			openModal({
				type: ModalType.USER_SELECT,
				onConfirm: (users: UserModel) => {
					setFeatureTempInfo((state: FeatureTemp) => {
						let rtn = cloneDeep(state)
						rtn.enrUserId = users.userId
						rtn.enrUserNm = users.userNm
						rtn.enrDeptCode = users.deptCode
						rtn.enrDeptNm = users.deptNm
						return rtn
					})
				},
			})
		)
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
									onchangeSelectHandler(e, value, "featureSeGrp")
								}}
							>
								{featureSeGrpList.map((item, index) => (
									<SelectOption key={index} value={item.seId}>{item.seNm}</SelectOption>
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
									onchangeSelectHandler(e, value, "featureSe")
								}}
							>
								{featureSeList.map((item, index) => (
									<SelectOption key={index} value={item.seId}>{item.seNm}</SelectOption>
								))}
							</Select>
						</TD>
					</TR>
					{/* <TR>
						<TH colSpan={1} align="right">Feature ID</TH>
						<TD colSpan={2}>
							<TextField className="width-100" id="featureId" readOnly onChange={onchangeInputHandler} />
						</TD>
					</TR> */}
					<TR>
						<TH colSpan={1} align="right" required>한글명</TH>
						<TD colSpan={2}>
							<Stack gap="SM" className='width-100'>
								<TextField
									placeholder="한글, 숫자, _ 만 입력 가능합니다."
									className="width-100"
									id="featureKoNm"
									value={featureKoNmInput}
									onChange={onchangeInputHandler}
								/>
								{/* <Button>중복확인</Button> */}
							</Stack>
						</TD>
						<TH colSpan={1} align="right" required>영문명</TH>
						<TD colSpan={2}>
							<Stack gap="SM" className='width-100'>
								<TextField
									placeholder="영문, 숫자, _ 만 입력 가능합니다."
									className="width-100"
									id="featureEnNm"
									value={featureEnNmInput}
									onChange={onchangeInputHandler}
								/>
								{/* <Button>중복확인</Button> */}
							</Stack>
						</TD>
					</TR>
					{/* <TR>
						<TH colSpan={1} align="right" required>Feature 타입</TH>
						<TD colSpan={2}>
							<Select
								appearance="Outline"
								placeholder="선택"
								className="width-100"
								onChange={(
									e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
									value: SelectValue<{}, false>
								) => {
									onchangeSelectHandler(e, value, "featureTyp")
								}}
							>
								{codeList.map((codeItem: any, index) => (
									<SelectOption key={index} value={codeItem.codeId}>{codeItem.codeNm}</SelectOption>
								))}
							</Select>
						</TD>
						<TD colSpan={3}></TD>
					</TR> */}
					<TR>
						<TH colSpan={1} align="right" required>Feature 정의</TH>
						<TD colSpan={5}>
							<TextField className="width-100" id="featureDef" multiline onChange={onchangeInputHandler} />
						</TD>
					</TR>
					<TR>
						<TH colSpan={1} align="right">산출 단위</TH>
						<TD colSpan={2}>
							<TextField className="width-100" id="calcUnt" onChange={onchangeInputHandler} />
							{/* <Select
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
							</Select> */}
						</TD>
						{/* 관리자가 승인 단계시 노출 */}
						<TD colSpan={3}></TD>
						{/* <TH colSpan={1} align="right" required>카테고리</TH>
              <TD colSpan={2}>
                <Select className='width-100'  appearance="Outline" >
                    <SelectOption value={1}>test</SelectOption>
                </Select>
              </TD> */}
					</TR>
					<TR>
						<TH colSpan={1} align="right" required>산출 로직</TH>
						<TD colSpan={5}>
							<TextField
								style={{
									height: "150px"
								}}
								className="width-100"
								multiline
								id="featureFm"
								onChange={onchangeInputHandler}
							/>
						</TD>
					</TR>
					<TR>
						<TH colSpan={1} align="right">비고</TH>
						<TD colSpan={5}>
							<TextField className="width-100" id="featureDsc" onChange={onchangeInputHandler} />
						</TD>
					</TR>
				</HorizontalTable>
				{/* 기본 정보 */}
				{/* 신청 정보 SQL 등록 */}
				{(regType && (regType === SelfFeatPgPpNm.SQL_REG)) &&
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
								<TH align="right" colSpan={1} required>
									Feature 신청자
								</TH>
								<TD colSpan={2}>
									<Stack gap="SM" className="width-100" direction="Vertical">
										<Stack gap="SM">
											<TextField
												className="width-100"
												value={featureTempInfo.enrUserNm}
												id="enrUserNm"
												onChange={onchangeInputHandler}
												disabled
											/>
											<Button
												appearance="Contained"
												priority="Normal"
												shape="Square"
												size="MD"
												onClick={handleUserSelectModal}
											>
												<span className="searchIcon"></span>
											</Button>
										</Stack>
									</Stack>
								</TD>
								<TH align="right" colSpan={1}>
									신청부서
								</TH>
								<TD colSpan={2}>
									<Stack gap="SM" className="width-100" direction="Vertical">
										<TextField
											className="width-100"
											value={featureTempInfo.enrDeptNm}
											id="enrDeptNm"
											onChange={onchangeInputHandler}
											disabled
										/>
									</Stack>
								</TD>
							</TR>
						</HorizontalTable>
					</Stack>
				}
				{/* 신청 정보 SQL 등록 */}
				{/* 대상 선택 */}
				<Stack
					gap="LG"
					direction="Vertical"
					style={{
						border: '2px solid rgb(162, 210, 235)',
						borderRadius: '5px',
					}}
				>
					{(regType && (regType === SelfFeatPgPpNm.RULE_REG)) &&
						<Stack
							direction="Vertical"
							gap="SM"
							style={{
								margin: "0.5rem"
							}}
						>
							<Stack direction="Horizontal" gap="LG" justifyContent="start">
								<Typography variant="h4">1. Feature 로직</Typography>
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
									height: '700px',
								}}
							>
								<DndProvider backend={HTML5Backend}>
									{/* drop 영역 */}
									<DropList
										featStatus={SelfFeatPgPpNm.REG}
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
						</Stack>
					}
					{/* 대상 선택 */}
					{/* SQL 입력 */}
					{(regType && (regType === SelfFeatPgPpNm.SQL_REG)) &&
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
								<TextField className="width-100 height-100" multiline id="sqlQuery" onChange={onchangeInputHandler} />
							</Stack>
						</Stack>
					}
					{/* SQL 입력 */}
					{/* 계산식 */}
					{(regType && (regType === SelfFeatPgPpNm.RULE_REG) && (formulaTrgtList.length > 0)) &&
						<CalcValid
							featStatus={SelfFeatPgPpNm.REG}
							isSelectAggregateTop={isSelectAggregateTop}
							setIsValidFormula={setIsValidFormula}
							formulaTrgtList={formulaTrgtList}
							custFeatRuleCalc={custFeatRuleCalc}
							custFeatRuleCaseList={custFeatRuleCaseList}
							setCustFeatRuleCalc={setCustFeatRuleCalc}
							setCustFeatRuleCaseList={setCustFeatRuleCaseList}
						/>
					}
				</Stack>
				{/* 계산식 */}
				{/* 결재선 */}
				<ApprovalList
					aprvList={aprvList}
					sfSubmissionApprovalList={sfSubmissionApprovalList}
					setSfSubmissionApprovalList={setSfSubmissionApprovalList}
				/>
				{/* 결재선 */}
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
					<Button type="button" priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(SelfFeatPgPpNm.LIST)}>
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