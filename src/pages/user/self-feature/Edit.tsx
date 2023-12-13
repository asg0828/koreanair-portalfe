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
	Typography,
	useToast
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
	CustFeatureFormData,
} from '@/models/selfFeature/FeatureModel';
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
	ModalType,
	ModalTitCont,
//	ColDataType,
	CommonCode,
	CommonCodeInfo,
} from '@/models/selfFeature/FeatureCommon';
import { SfSubmissionAppendApproval, SfSubmissionApproval, SfSubmissionRequestInfo } from "@/models/selfFeature/FeatureSubmissionModel";
import { initSfSubmissionApproval, initSfSubmissionRequestInfo } from "../self-feature-submission/data";
import { useApproverCandidate, useGetTableandColumnMetaInfoByMstrSgmtRuleId } from "@/hooks/queries/self-feature/useSelfFeatureUserQueries";
import { 
	//GroupCodeType, 
	ValidType,
} from "@/models/common/Constants";
import { useCommCodes } from "@/hooks/queries/self-feature/useSelfFeatureCmmQueries";
import { useFeatureSeList, useFeatureTypList } from "@/hooks/queries/useFeatureQueries";
import { FeatureSeparatesModel } from "@/models/model/FeatureModel";
//import { selectCodeList } from "@/reducers/codeSlice";
//import { useAppSelector } from "@/hooks/useRedux";
import { getFeatureSeList } from "@/api/FeatureAPI";
//import { CodeModel } from "@/models/model/CodeModel";
import { validationCustReatRule } from "@/utils/self-feature/FormulaValidUtil";
import { useRunScheduleByManually, useUpdateCustFeatRule, useUpdateCustFeatSQL } from "@/hooks/mutations/self-feature/useSelfFeatureUserMutations";

const SelfFeatureEdit = () => {

	const { toast } = useToast()
	const navigate = useNavigate()
	const location = useLocation()
	// 속성, 행동정보
	const { data: mstrSgmtTbandColRes, isError: mstrSgmtTbandColErr, refetch: mstrSgmtTbandColRefetch } = useGetTableandColumnMetaInfoByMstrSgmtRuleId()
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
	const [featureSeAllList, setFeatureSeAllList] = useState<Array<FeatureSeparatesModel>>([])
	const [featureSeList, setFeatureSeList] = useState<Array<FeatureSeparatesModel>>([])
	// 픽처타입
	//const codeList = useAppSelector(selectCodeList(GroupCodeType.FEATURE_TYPE))
	// update 데이터
	const [updtFeatureInfo, setUpdtFeatureInfo] = useState<FeatureInfo>(cloneDeep(initSelfFeatureInfo))
	// formData
	const [custFeatureFormData, setCustFeatureFormData] = useState<CustFeatureFormData>(cloneDeep(initCustFeatureFormData))
	// 대상선택 초기화시 flag
	const [targetClear, setTargetClear] = useState<string>("")//location.state.TargetClear
	// 한글 및 영문 입력시 입력값
	const [ featureKoNmInput, setFeatureKoNmInput ] = useState<string>(cloneDeep(location.state?.featureInfo.featureTemp?.featureKoNm))
	const [ featureEnNmInput, setFeatureEnNmInput ] = useState<string>(cloneDeep(location.state?.featureInfo.featureTemp?.featureEnNm))
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
	const [sfSubmissionApprovalList, setSfSubmissionApprovalList] = useState<Array<SfSubmissionApproval>>(cloneDeep([initSfSubmissionApproval]))
	// 결재선
	const [aprvList, setAprvList] = useState<Array<SfSubmissionAppendApproval>>([])
	const { data: approverCandidateRes, isError: approverCandidateErr } = useApproverCandidate()
	// 속성 및 행동 데이터
	const [mstrSgmtTableandColMetaInfo, setMstrSgmtTableandColMetaInfo] = useState<MstrSgmtTableandColMetaInfo>(cloneDeep(initMstrSgmtTableandColMetaInfo))
	// Top 집계함수 선택 여부
	const [isSelectAggregateTop, setIsSelectAggregateTop] = useState<Boolean>(false)

	const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)
	const [confirmModalTit, setConfirmModalTit] = useState<string>('')
	const [confirmModalCont, setConfirmModalCont] = useState<string>('')
	const [modalType, setModalType] = useState<string>('')
	// 수정 API(Rule-Design / SQL)
	const { data: updtRuleDesignRes, isSuccess: updtRuleDesignSucc, isError: updtRuleDesignErr, mutate: updtRuleDesignMutate } = useUpdateCustFeatRule(updtFeatureInfo.tbRsCustFeatRule.id, custFeatureFormData)
	const { data: updtSQLRes, isSuccess: updtSQLSucc, isError: updtSQLErr, mutate: updtSQLMutate } = useUpdateCustFeatSQL(updtFeatureInfo.tbRsCustFeatRule.id, custFeatureFormData)
	// 수동실행 API
    const { data: runScheduleByManuallyRes, isSuccess: runScheduleByManuallySucc, isError: runScheduleByManuallyErr, mutate: runScheduleByManuallyMutate } = useRunScheduleByManually(location.state?.featureInfo.tbRsCustFeatRule.id)
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
			// 대상 초기화
			if (targetClear === "trgtClear") {
				setTargetList([])
				setTrgtFilterList([])
			}
		}
		setIsOpenConfirmModal(false)
	}
	const onCancel = () => {
		setIsOpenConfirmModal(false)
	}
	// component mount
	useEffect(() => {
		// if (location.state.featureInfo.tbRsCustFeatRule.sqlDirectInputYn !== "Y")
		// 	mstrSgmtTbandColRefetch()
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
				setAprvList(approverCandidateRes.result)
            }
        }
    }, [approverCandidateRes, approverCandidateErr, toast])

	useEffect(() => {
		if (!location.state) return
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
	// 대구분 선택시 중구분 select option setting
	useEffect(() => {
		if (seGrpId) {
			setFeatureTempInfo((prevState: FeatureTemp) => {
				let rtn = cloneDeep(prevState)
				rtn.featureSeGrp = seGrpId
				return rtn
			})
			seRefetch()
		}
	}, [seGrpId, seRefetch])
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
						setFeatureSeAllList((prevState: Array<FeatureSeparatesModel>) => {
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
	// 대구분에 따른 중구분 list setting
	useEffect(() => {
		if (!featureSeAllList || featureSeAllList.length < 1) return

		let seId = featureSeGrpList.find((grpItem: FeatureSeparatesModel) => {
			return grpItem.seId === featureSeAllList.find((item: FeatureSeparatesModel) => location.state && (item.seId === location.state.featureInfo.featureTemp.featureSe))?.seGrpId
		})?.seId

		if (seId) {
			setSeGrpId(seId)
		}

	}, [featureSeAllList])
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
		// 수정시 TOP 함수가 있는 경우 drag 영역 비노출
		let hasTop = targetList.filter((item) => item.operator === "top" )
		if (hasTop && hasTop.length > 0) setIsSelectAggregateTop(true)

		setUpdtFeatureInfo((state: FeatureInfo) => {
			let rtn = cloneDeep(state)
			rtn.tbRsCustFeatRuleTrgtList = cloneDeep(targetList)
			return rtn
		})
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
		// setUpdtFeatureInfo((state: FeatureInfo) => {
		// 	let rtn = cloneDeep(state)
		// 	rtn.tbRsCustFeatRuleCaseList = cloneDeep(custFeatRuleCaseList)
		// 	return rtn
		// })
	}, [custFeatRuleCaseList])
	// 대상 선택 list가 없는 경우 formula reset
	useEffect(() => {
		if (formulaTrgtList.length > 0) return

		if (
			location.state
			&& location.state.featureInfo.tbRsCustFeatRuleCalc
			&& location.state.featureInfo.tbRsCustFeatRuleCalc.formula === ""
		) {
			setCustFeatRuleCalc((state: TbRsCustFeatRuleCalc) => {
				let rtn = cloneDeep(state)
				rtn.formula = ''
				return rtn
			})
		}

	}, [formulaTrgtList, location.state?.featureInfo.tbRsCustFeatRuleCalc?.formula])
	// 수정 API 호출(Rule-Design)
	const updateCustFeatRule = () => {
		if (!isValidFormula) {
			toast({
				type: ValidType.ERROR,
				content: ModalTitCont.EDIT_VALID.context,
			})
			return
		}
		let param: any = cloneDeep(initCustFeatureFormData)
		param.customerFeature = updtFeatureInfo
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
		updtRuleDesignMutate()
	}
	// 수정 API 호출 Callback (Rule-Design)
	useEffect(() => {
		if (updtRuleDesignErr || updtRuleDesignRes?.successOrNot === 'N') {
			toast({
				type: ValidType.ERROR,
				content: updtRuleDesignRes?.message ? updtRuleDesignRes?.message : '수정 중 에러가 발생했습니다.',
			})
		} else if (updtRuleDesignSucc) {
			toast({
				type: ValidType.CONFIRM,
				content: '수정되었습니다.',
			})
			//navigate(-1)
			// 상세로 redirect
			updtFeatureInfo.tbRsCustFeatRule.submissionStatus = SubFeatStatus.SAVE
			navigate(`../${SelfFeatPgPpNm.DETL}`, { state: updtFeatureInfo.tbRsCustFeatRule })
		}
	}, [updtRuleDesignRes, updtRuleDesignSucc, updtRuleDesignErr, toast])
	// 수정 API 호출(SQL)
	const updateCustFeatSQL = () => {
		let param: any = cloneDeep(initCustFeatureFormDataSql)
		param.customerFeatureSql = updtFeatureInfo
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
		updtSQLMutate()
	}
	// 수정 API 호출 Callback (SQL)
	useEffect(() => {
		if (updtSQLErr || updtSQLRes?.successOrNot === 'N') {
			toast({
				type: ValidType.ERROR,
				content: updtSQLRes?.message ? updtSQLRes?.message : '수정 중 에러가 발생했습니다.',
			})
		} else if (updtSQLSucc) {
			toast({
				type: ValidType.CONFIRM,
				content: '수정되었습니다.',
			})
			//navigate(-1)
			// 상세로 redirect
			updtFeatureInfo.tbRsCustFeatRule.submissionStatus = SubFeatStatus.SAVE
			navigate(`../${SelfFeatPgPpNm.DETL}`, { state: updtFeatureInfo.tbRsCustFeatRule })
		}
	}, [updtSQLRes, updtSQLSucc, updtSQLErr, toast])
	// input 입력값 변경시
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
		// 대구분 선택시 중구분 select ooption Group Id setting
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
		if (pageNm === SelfFeatPgPpNm.LIST)
			//navigate('..')
			//navigate(-1)
			navigate(`../${SelfFeatPgPpNm.DETL}`, { state: updtFeatureInfo.tbRsCustFeatRule })
		else
			navigate(`../${pageNm}`)
	}
	// 대상선택 초기화
	const targetClearHanbler = () => {
		setModalType(ModalType.CONFIRM)
		setTargetClear("trgtClear")
		setConfirmModalTit(ModalTitCont.TRGT_CLEAR.title)
		setConfirmModalCont(ModalTitCont.TRGT_CLEAR.context)
		setIsOpenConfirmModal(true)
	}
	// 수정 버튼 클릭시
	const onSubmitUpdateHandler = () => {
		setModalType(ModalType.CONFIRM)
		setConfirmModalTit(ModalTitCont.EDIT.title)
		setConfirmModalCont(ModalTitCont.EDIT.context)
		setIsOpenConfirmModal(true)
	}
    // 수동실행 API 호출
    const runScheduleByManually = () => {
        if (location.state?.featureInfo.tbRsCustFeatRule.id && location.state?.featureInfo.tbRsCustFeatRule.id !== "") {
            if (location.state?.featureInfo.tbRsCustFeatRule.batManualExecTestCnt > 5) {
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
                //custFeatRuleInfosRefetch()
				updtFeatureInfo.tbRsCustFeatRuleTrgtList = targetList
				updtFeatureInfo.tbRsCustFeatRuleTrgtFilterList = trgtFilterList
				updtFeatureInfo.featureTemp.featureSeGrp = ""
				updtFeatureInfo.tbRsCustFeatRule.batManualExecTestCnt += 1
				navigate(
					`../${SelfFeatPgPpNm.EDIT}`,
					{
						state: {
							featureInfo: updtFeatureInfo,
							sfSubmissionRequestData: sfSubmissionRequestData,
							sfSubmissionApprovalList: sfSubmissionApprovalList
						}
					}
				)
            }
        }
    }, [runScheduleByManuallyRes, runScheduleByManuallySucc, runScheduleByManuallyErr, toast])

	return (
		<Stack direction="Vertical" gap="MD" justifyContent="Between" className='height-100'>
			{/* 정보 영역 */}
			<Stack direction="Vertical" gap="MD" >
				{/* 상단 버튼 영역 */}
				<Stack direction="Horizontal" gap="MD" justifyContent="End">
					<Button size="LG" onClick={runScheduleByManually}>
						수동 실행
					</Button>
					<FeatQueryRsltButton
						custFeatRuleId={location.state?.featureInfo.tbRsCustFeatRule.id}
					/>
				</Stack>

				{/* 기본 정보 */}
				<Typography variant="h4">Feature 기본 정보</Typography>
				<HorizontalTable>
					<TR>
						<TH colSpan={1} align="center" required>대구분</TH>
						<TD colSpan={3}>
							<Select
								value={seGrpId}
								appearance="Outline"
								placeholder="대구분"
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
						<TH colSpan={1} align="center" required>중구분</TH>
						<TD colSpan={3}>
							<Select
								defaultValue={location.state?.featureInfo.featureTemp.featureSe}
								appearance="Outline"
								placeholder="중구분"
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
						<TH colSpan={1} align="center">Feature ID</TH>
						<TD colSpan={3}>
							<TextField
								readOnly
								className="width-100"
								id="featureId"
								defaultValue={location.state?.featureInfo.featureTemp?.featureId}
							//onChange={onchangeInputHandler}
							/>
						</TD>
						<TH colSpan={1} align="center">Feature 타입</TH>
						<TD colSpan={3}>
							<Select
								defaultValue={codeList.find((featureType: CodeModel) => featureType.codeId === location.state?.featureInfo.featureTemp.featureTyp)?.codeId}
								appearance="Outline"
								placeholder="Feature 타입"
								className="width-100"
								onChange={(
									e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
									value: SelectValue<{}, false>
								) => {
									onchangeSelectHandler(e, value, "featureTyp")
								}}
							>
								{codeList.map((codeItem, index) => (
									<SelectOption key={index} value={codeItem.codeId}>{codeItem.codeNm}</SelectOption>
								))}
							</Select>
						</TD>
					</TR> */}
					<TR>
						<TH colSpan={1} align="center" required>한글명</TH>
						<TD colSpan={3}>
							<TextField
								className="width-100"
								id="featureKoNm"
								//defaultValue={location.state?.featureInfo.featureTemp?.featureKoNm}
								value={featureKoNmInput}
								onChange={onchangeInputHandler}
							/>
						</TD>
						<TH colSpan={1} align="center" required>영문명</TH>
						<TD colSpan={3}>
							<TextField
								className="width-100"
								id="featureEnNm"
								//defaultValue={location.state?.featureInfo.featureTemp?.featureEnNm}
								value={featureEnNmInput}
								onChange={onchangeInputHandler}
							/>
						</TD>
					</TR>
					<TR>
						<TH colSpan={1} align="center" required>Feature 정의</TH>
						<TD colSpan={7}>
							<TextField
								className="width-100"
								multiline
								id="featureDef"
								defaultValue={featureTempInfo?.featureDef}
								onChange={onchangeInputHandler}
							/>
						</TD>
					</TR>
					<TR>
						<TH colSpan={1} align="center">산출 단위</TH>
						<TD colSpan={3}>
							<TextField 
								className="width-100" 
								id="calcUnt" 
								defaultValue={location.state?.featureInfo.featureTemp?.calcUnt}
								onChange={onchangeInputHandler} 
							/>
							{/* <Select
								defaultValue={location.state?.featureInfo.featureTemp?.calcUnt}
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
							</Select> */}
						</TD>
						<TD colSpan={4}>
						</TD>
					</TR>
					<TR>
						<TH colSpan={1} align="center" required>산출 로직</TH>
						<TD colSpan={7}>
							<TextField
								style={{
									height: "150px"
								}}
								className="width-100"
								multiline
								id="featureFm"
								defaultValue={featureTempInfo?.featureFm}
								onChange={onchangeInputHandler} />
						</TD>
					</TR>
					<TR>
						<TH colSpan={1} align="center">비고</TH>
						<TD colSpan={7}>
							<TextField 
								className="width-100" 
								id="featureDsc" 
								defaultValue={location.state?.featureInfo.featureTemp?.featureDsc}
								onChange={onchangeInputHandler} 
							/>
						</TD>
					</TR>
				</HorizontalTable>
				{/* 기본 정보 */}
				<Stack
					gap="LG"
					direction="Vertical"
					style={{
						border: '2px solid rgb(162, 210, 235)',
						borderRadius: '5px',
					}}
				>
					{(
						custFeatRule.sqlDirectInputYn === ""
						|| custFeatRule.sqlDirectInputYn === "N"
					) &&
						<Stack
							direction="Vertical"
							gap="SM"
							style={{
								margin: "0.5rem"
							}}
						>
							{/* Feature 로직 */}
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
										featStatus={SelfFeatPgPpNm.EDIT}
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
						</Stack>
					}
					{custFeatRule.sqlDirectInputYn === "Y" &&
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
									value={sqlQueryInfo?.sqlQuery}
									onChange={onchangeInputHandler}
								/>
							</Stack>
						</Stack>
					}
					{/* 계산식 */}
					{((
						custFeatRule.sqlDirectInputYn === ""
						|| custFeatRule.sqlDirectInputYn === "N"
					) && formulaTrgtList.length > 0) &&
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
					{/* 계산식 */}
				</Stack>
				{/* 결재선 */}
				<ApprovalList
					sfSubmissionRequestData={sfSubmissionRequestData}
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
					<Button type="button" priority="Primary" appearance="Contained" size="LG" onClick={onSubmitUpdateHandler}>
						수정
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
export default SelfFeatureEdit