import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { cloneDeep, isEmpty } from 'lodash'
import { SelectValue } from '@mui/base/useSelect';

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
    Select,
    SelectOption,
} from '@components/ui'

import {
    AprvSeqNm,
    AprvSubCommentProps,
    SfSubmissionAppendApproval,
    SfSubmissionApproval,
    SfSubmissionRequestInfo,
} from "@/models/selfFeature/FeatureSubmissionModel";
import {
    initSfSubmissionRequestInfo,
    sfSubmissionApprovalListColumns as columns,
    initSfSubmissionApproval,
    initAprvSubCommentProps,
    categoryOption
} from "./data";
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
} from "@/models/selfFeature/FeatureModel";
import {
    initFeatureTemp,
    initMstrSgmtTableandColMetaInfo,
    initSelfFeatureInfo,
    initTbRsCustFeatRuleCalc,
    initTbRsCustFeatRuleSql,
} from "../self-feature/data";
import {
    //ColDataType,
    CommonCode,
    CommonCodeInfo,
    FeatureType,
    ModalTitCont,
    ModalType,
    SelfFeatPgPpNm,
    SubFeatStatus,
    SubFeatStatusNm,
} from "@/models/selfFeature/FeatureCommon";
import { QueryParams } from "@/utils/ApiUtil";
import ConfirmModal from "@/components/modal/ConfirmModal";
import FeatQueryRsltButton from "@/components/self-feature/FeatQueryRsltButton";
import SubRejectModal from "@/components/self-feature-submission/modal/SubRejectModal";
import { useApproverCandidate, useCustFeatRuleInfos, useCustFeatSQLInfos, useDirectSQLYn, useGetTableandColumnMetaInfoByMstrSgmtRuleId, useSubmissionInfo, useSubmissionList } from "@/hooks/queries/self-feature/useSelfFeatureUserQueries";
import { GroupCodeType, ValidType } from "@/models/common/Constants";
import { useCommCodes } from "@/hooks/queries/self-feature/useSelfFeatureCmmQueries";
import { FeatureSeparatesModel } from "@/models/model/FeatureModel";
import { CodeModel } from "@/models/model/CodeModel";
import { useAppSelector } from "@/hooks/useRedux";
import { selectSessionInfo } from "@/reducers/authSlice";
import { useFeatureTypList } from "@/hooks/queries/useFeatureQueries";
import { selectCodeList } from "@/reducers/codeSlice";
import { getFeatureSeList } from "@/api/FeatureAPI";
import { useApproveSubmissionApproval, useFeatureCategory, useRunScheduleByManually } from "@/hooks/mutations/self-feature/useSelfFeatureUserMutations";
import { getDateFormat } from "@/utils/DateUtil";
import { useDeptAllList } from "@/hooks/queries/useDeptQueries";

const SfSubmissionRequestDetail = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const sessionInfo = useAppSelector(selectSessionInfo())
    const { toast } = useToast()

    const { data: mstrSgmtTbandColRes, isError: mstrSgmtTbandColErr, refetch: mstrSgmtTbandColRefetch } = useGetTableandColumnMetaInfoByMstrSgmtRuleId()
    const { data: cmmCodeAggrRes } = useCommCodes(CommonCode.STAC_CALC_TYPE)
    const { } = useCommCodes(CommonCode.FUNCTION)
    const { } = useCommCodes(CommonCode.OPERATOR)
    const { } = useCommCodes(CommonCode.FORMAT)
    const { } = useCommCodes(CommonCode.SGMT_DELIMITER)
	// 부서 조회
	const [deptOption, setDeptOption] = useState<Array<any>>([])
	const { data: deptAllListRes, isError: deptAllListErr } = useDeptAllList()
    // 속성 및 행동 데이터
    const [mstrSgmtTableandColMetaInfo, setMstrSgmtTableandColMetaInfo] = useState<MstrSgmtTableandColMetaInfo>(cloneDeep(initMstrSgmtTableandColMetaInfo))
    // 승인 / 반려 버튼 타입 구분
    const [btnClickType, setBtnClickType] = useState<string>('')
    // 모달
    const [isOpenSubRejectModal, setIsOpenSubRejectModal] = useState<boolean>(false)
    const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)
    const [confirmModalTit, setConfirmModalTit] = useState<string>('')
    const [confirmModalCont, setConfirmModalCont] = useState<string>('')
    const [modalType, setModalType] = useState<string>('')
    // 상세 조회 API
    const { data: directSQLYnRes, isError: directSQLYnErr, refetch: directSQLYnRefetch } = useDirectSQLYn(location.state.referenceNo)
    const { data: custFeatRuleInfosRes, isError: custFeatRuleInfosErr, refetch: custFeatRuleInfosRefetch } = useCustFeatRuleInfos(location.state.referenceNo)
    const { data: custFeatSQLInfosRes, isError: custFeatSQLInfosErr, refetch: custFeatSQLInfosRefetch } = useCustFeatSQLInfos(location.state.referenceNo)
    const [subListQueryParams, setSubListQueryParams] = useState<QueryParams>({})
    const [submissionId, setSubmissionId] = useState<number>(0)
    const { data: submissionListRes, isError: submissionListErr, refetch: submissionListRefetch } = useSubmissionList(subListQueryParams)
    const { data: submissionInfoRes, isError: submissionInfoErr, refetch: submissionInfoRefetch } = useSubmissionInfo(submissionId)
    // 대구분
    const { data: seGroupRes, isError: seGroupErr } = useFeatureTypList()
    const [featureSeGrpList, setFeatureSeGrpList] = useState<Array<FeatureSeparatesModel>>([])
    // 중구분
    const [featureSeList, setFeatureSeList] = useState<Array<FeatureSeparatesModel>>([])
    // 픽처타입
    const codeList = useAppSelector(selectCodeList(GroupCodeType.FEATURE_TYPE))
    // 계산식 validation을 위한 대상 list
    const [formulaTrgtList, setFormulaTrgtList] = useState<Array<FormulaTrgtListProps>>([])
    // 기본 정보
    const [category, setCategory] = useState<string>("")
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
    // 승인, 반려 버튼 show 여부
    const [isAprvRjctBtnShow, setIsAprvRjctBtnShow] = useState<Boolean>(false)
    // 결재선
    //const [aprvList, setAprvList] = useState<Array<SfSubmissionAppendApproval>>([])
    const [aprvType1, setAprvType1] = useState<Array<SfSubmissionAppendApproval>>([])
    const [aprvType2, setAprvType2] = useState<Array<SfSubmissionAppendApproval>>([])
    const [aprvType3, setAprvType3] = useState<Array<SfSubmissionAppendApproval>>([])
    const { data: approverCandidateRes, isError: approverCandidateErr } = useApproverCandidate()
    // feature 승인 API
    const [userEmail, setUserEmail] = useState<string>("")
    const [approvalId, setApprovalId] = useState<number>(0)
    // 승인의 경우 승인합니다 로 고정
    const [aprvSubComment, setAprvSubComment] = useState<AprvSubCommentProps>(initAprvSubCommentProps)
    const { data: aprvSubAprvalRes, isSuccess: aprvSubAprvalSucc, isError: aprvSubAprvalErr, mutate: aprvSubAprvalMutate } = useApproveSubmissionApproval(userEmail, approvalId, aprvSubComment)
    // 수동실행 API
    const { data: runScheduleByManuallyRes, isSuccess: runScheduleByManuallySucc, isError: runScheduleByManuallyErr, mutate: runScheduleByManuallyMutate } = useRunScheduleByManually(location.state.referenceNo)
    // 카테고리 update API
    const { data: updateFeatureCategoryRes, isSuccess: updateFeatureCategorySucc, isError: updateFeatureCategoryErr, mutate: updateFeatureCategoryMutate } = useFeatureCategory(location.state.referenceNo, { category: category })
    // component mount
    useEffect(() => {
        initCustFeatRule()
    }, [])
    // feature 정보 초기화
    const initCustFeatRule = () => {
        setFeatureInfo((state: FeatureInfo) => {
            let rtn = cloneDeep(state)
            rtn = cloneDeep(initSelfFeatureInfo)
            return rtn
        })
    }
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
                setMstrSgmtTableandColMetaInfo(cloneDeep(mstrSgmtTbandColRes.result))
            }
        }
    }, [custFeatRuleInfosRefetch])
    // SQL 등록 여부 API response callback
    useEffect(() => {
        if (directSQLYnErr || directSQLYnRes?.successOrNot === 'N') {
            toast({
                type: ValidType.ERROR,
                content: '조회 중 에러가 발생했습니다.',
            })
        } else {
            if (directSQLYnRes) {
                if (directSQLYnRes.result === "N") {
                    custFeatRuleInfosRefetch()
                } else {
                    custFeatSQLInfosRefetch()
                }
            }
        }
    }, [directSQLYnRes, directSQLYnErr, toast])
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
    // modal 확인/취소 이벤트
    const onConfirm = () => {
        if (modalType === ModalType.CONFIRM) {
            if (btnClickType === "approval") {
                approveSubmissionApproval()
            }
            if (btnClickType === "updtCategory") {
                updateFeatureCategoryMutate()
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
        setCategory(cloneDeep(featureInfo.tbRsCustFeatRule.category))
        if (featureInfo.tbRsCustFeatRule.sqlDirectInputYn === "N") {
            setTargetList(cloneDeep(featureInfo.tbRsCustFeatRuleTrgtList))
            setTrgtFilterList(cloneDeep(featureInfo.tbRsCustFeatRuleTrgtFilterList))
            setCustFeatRuleCalc(cloneDeep(featureInfo.tbRsCustFeatRuleCalc))
            //setCustFeatRuleCaseList(cloneDeep(featureInfo.tbRsCustFeatRuleCaseList))
        }
        if (featureInfo.tbRsCustFeatRule.sqlDirectInputYn === "Y") {
            setSqlQueryInfo(cloneDeep(featureInfo.tbRsCustFeatRuleSql))
        }
    }, [featureInfo])
    // 대상선택 리스트에 화면에 보여줄 테이블논리명, 컬럼논리명 setting
    useEffect(() => {
        if (isEmpty(mstrSgmtTableandColMetaInfo)) return
        if (featureInfo.tbRsCustFeatRule.sqlDirectInputYn !== "Y") {
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
    }, [mstrSgmtTableandColMetaInfo])
    // 계산식 validation을 위한 대상 list 추출
    useEffect(() => {
        if (featureInfo.tbRsCustFeatRule.sqlDirectInputYn !== "Y") {
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
        }
    }, [targetList])
    // 정보 조회 API callback
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
                setSubListQueryParams({ type: FeatureType.CUST, referenceNo: location.state.referenceNo })
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
                setSubListQueryParams({ type: FeatureType.CUST, referenceNo: location.state.referenceNo })
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
                if (submissionInfoRes.result.approvals) {
                    // 승인,반려버튼 show 여부 판단
                    setIsAprvRjctBtnShow((isShow: Boolean) => {
                        let rtn = cloneDeep(isShow)
                        let approval = submissionInfoRes.result.approvals.filter((item: SfSubmissionApproval) => (item.approver === sessionInfo.userEmail) && item.status === SubFeatStatus.REQ)
                        if (isEmpty(approval)) rtn = false
                        else rtn = true
                        return rtn
                    })
                    // 결재자 리스트 setting
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
        }
    }, [submissionInfoRes, submissionInfoErr, toast])
    // 페이지 이동
    const onClickPageMovHandler = (pageNm: string): void => {

        if (pageNm === SelfFeatPgPpNm.LIST) {
            navigate('..')
        } else if (pageNm === SelfFeatPgPpNm.SUB_APRV) {
            // 승인 처리
            setModalType(ModalType.CONFIRM)
            setBtnClickType("approval")
            setConfirmModalTit(ModalTitCont.SUBMISSION_APPROVAL.title)
            setConfirmModalCont(ModalTitCont.SUBMISSION_APPROVAL.context)
            setIsOpenConfirmModal(true)
        } else if (pageNm === SelfFeatPgPpNm.SUB_REJT) {
            // 반려 팝업
            setIsOpenSubRejectModal((prevState) => !prevState)
        }
    }
    // 승인 API 호출
    const approveSubmissionApproval = () => {
        if (!sessionInfo.userEmail) {
            console.log("no session info email")
            toast({
                type: ValidType.ERROR,
                content: '승인 중 에러가 발생했습니다',
            })
            return
        }
        // 수동실행 최소 1회 실행 validation
        if (
            featureInfo.tbRsCustFeatRule.sqlDirectInputYn === "N"
            && featureInfo.tbRsCustFeatRule.batManualExecTestCnt < 1
        ) {
            toast({
                type: ValidType.ERROR,
                content: '수동실행을 최소 1회 실행 해주세요.',
            })
            return
        }
        // 1차 승인자의 경우 카테고리 validation check
        if (sessionInfo.apldUserAuthId === "sf_usr_aprv_auth1") {
            // 설정하지 않은 경우 return -> 설정 api callback으로 flag setting 후 flag로 판단하기
            if (!updateFeatureCategoryRes || updateFeatureCategoryRes.successOrNot === 'N') {
                toast({
                    type: ValidType.ERROR,
                    content: '카테고리를 설정 해주세요.',
                })
                return
            }
        }
        setUserEmail(sessionInfo.userEmail)
        let approval = sfSubmissionApprovalList.filter((item: SfSubmissionApproval) => (item.approver === sessionInfo.userEmail) && item.status === SubFeatStatus.REQ)
        if (isEmpty(approval)) {
            console.log("no approval Id")
            toast({
                type: ValidType.ERROR,
                content: '승인 중 에러가 발생했습니다',
            })
            return
        }
        setApprovalId(approval[0].id)
        aprvSubAprvalMutate()
    }
    // 승인 API Callback
    useEffect(() => {
        if (aprvSubAprvalErr || aprvSubAprvalRes?.successOrNot === 'N') {
            toast({
                type: ValidType.ERROR,
                content: aprvSubAprvalRes?.message ? aprvSubAprvalRes?.message : '승인 처리 중 에러가 발생했습니다.',
            })
        } else if (aprvSubAprvalSucc) {
            toast({
                type: ValidType.CONFIRM,
                content: '승인 처리 되었습니다.',
            })
            // 목록으로
            navigate('..')
        }
    }, [aprvSubAprvalRes, aprvSubAprvalSucc, aprvSubAprvalErr])
    // 수동실행 API 호출
    const runScheduleByManually = () => {
        if (location.state.referenceNo && location.state.referenceNo !== "") {
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
                if (featureInfo.tbRsCustFeatRule.sqlDirectInputYn === "N") {
                	custFeatRuleInfosRefetch()
                }
                if (featureInfo.tbRsCustFeatRule.sqlDirectInputYn === "Y") {
                	custFeatSQLInfosRefetch()
                }
            }
        }
    }, [runScheduleByManuallyRes, runScheduleByManuallySucc, runScheduleByManuallyErr, toast])
    // 카테고리 설정하기
    const onClickCategorySetHandler = () => {
        if (category === "") {
            toast({
                type: ValidType.ERROR,
                content: '카테고리를 설정 해주세요.',
            })
            return
        }
        setModalType(ModalType.CONFIRM)
        setBtnClickType("updtCategory")
        setConfirmModalTit("Feature 결재 요청 상세")
        setConfirmModalCont("카테고리 설정을 하시겠습니까?")
        setIsOpenConfirmModal(true)
    }
    // 카테고리 update API callback
    useEffect(() => {
        if (updateFeatureCategoryErr || updateFeatureCategoryRes?.successOrNot === 'N') {
            toast({
                type: ValidType.ERROR,
                content: updateFeatureCategoryRes?.message ? updateFeatureCategoryRes?.message : '카테고리 설정 중 에러가 발생했습니다.',
            })
        } else if (updateFeatureCategorySucc) {
            toast({
                type: ValidType.CONFIRM,
                content: '카테고리 설정이 완료되었습니다.',
            })
        }
    }, [updateFeatureCategoryRes, updateFeatureCategorySucc, updateFeatureCategoryErr, toast])

    return (
        <>
            <Stack direction="Vertical" gap="MD" justifyContent="Between" className='height-100'>
                {/* 상단 버튼 영역 */}
                <Stack direction="Horizontal" gap="MD" justifyContent="End">
                    <Button size="LG" onClick={runScheduleByManually}>
                        수동 실행
                    </Button>
                    <FeatQueryRsltButton
                        custFeatRuleId={location.state.referenceNo}
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
                    {/* 1차 승인자의 경우 카테고리 설정 */}
                    {sessionInfo.apldUserAuthId === "sf_usr_aprv_auth1" &&
                        <Stack
                            style={{
                                marginBottom: "2%"
                            }}
                            direction="Vertical"
                            gap="MD"
                        >
                            <Typography variant="h4">카테고리 설정</Typography>
                            <HorizontalTable>
                                <TR>
                                    <TH align="right" colSpan={1} required>
                                        카테고리
                                    </TH>
                                    <TD colSpan={2}>
                                        <Select
                                            value={category}
                                            appearance="Outline"
                                            placeholder="카테고리"
                                            className="width-100"
                                            onChange={(
                                                e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                                                value: SelectValue<{}, false>
                                            ) => {
                                                if (!value) return
                                                let v = String(value)
                                                setCategory(v)
                                            }}
                                        >
                                            {categoryOption.map((item, index) => (
                                                <SelectOption key={index} value={item.value}>{item.text}</SelectOption>
                                            ))}
                                        </Select>
                                        <Button 
                                            priority="Primary" 
                                            appearance="Contained" 
                                            size="SM" 
                                            onClick={onClickCategorySetHandler}
                                        >
                                            설정
                                        </Button>
                                    </TD>
                                    <TD colSpan={2}>
                                    </TD>
                                </TR>
                            </HorizontalTable>
                        </Stack>
                    }
                    {/* 1차 승인자의 경우 카테고리 설정 */}
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
                                    <TH align="right" colSpan={1} required>
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
                <Stack justifyContent="End" gap="SM" className="width-100">
                    <Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(SelfFeatPgPpNm.LIST)}>
                        목록
                    </Button>
                    {isAprvRjctBtnShow &&
                        <>
                            <Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(SelfFeatPgPpNm.SUB_APRV)}>
                                승인
                            </Button>
                            <Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(SelfFeatPgPpNm.SUB_REJT)}>
                                반려
                            </Button>
                        </>
                    }
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
            <SubRejectModal
                isOpen={isOpenSubRejectModal}
                onClose={(isOpen) => setIsOpenSubRejectModal(isOpen)}
                sfSubmissionApprovalList={sfSubmissionApprovalList}
            />
            {/* 반려 팝업 */}
        </>
    )
}

export default SfSubmissionRequestDetail