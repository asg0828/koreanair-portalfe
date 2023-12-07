import { useState, useEffect } from 'react'
import { cloneDeep } from 'lodash'
import {
    Button,
    Stack,
    TD,
    TH,
    TR,
    TextField,
    Typography,
    useToast,
} from '@components/ui'
import MstrProfInfo from '@/components/self-feature-adm/MstrProfInfo'
import HorizontalTable from '@/components/table/HorizontalTable'
import { ModalType, RuleId, SelfFeatPgPpNm } from '@/models/selfFeature/FeatureCommon'
import { useNavigate } from 'react-router-dom'
import ConfirmModal from '@/components/modal/ConfirmModal'
import { MasterProfileInfo, MetaInfoSearchProps, MetaType, TbCoMetaTbInfo, TbRsMstrSgmtRule, TbRsMstrSgmtRuleAttrClmn, TbRsMstrSgmtRuleAttrTbl, TbRsRslnRuleKeyPrty } from '@/models/selfFeature/FeatureAdmModel'
import { initMasterProfileInfo, initMetaInfoSearchProps, initTbRsMstrSgmtRule, initTbRsMstrSgmtRuleAttrClmn, initTbRsMstrSgmtRuleAttrTbl, initTbRsRslnRuleKeyPrty } from './data'
import { useCreateMstrProfInfo } from '@/hooks/mutations/self-feature/useSelfFeatureAdmMutations'
import { ValidType } from '@/models/common/Constants'
import { useMetaInfo, useResolutionKeyList } from '@/hooks/queries/self-feature/useSelfFeatureAdmQueries'
import { DivisionTypes } from '@/models/selfFeature/FeatureModel'
import { AddIcon } from '@/assets/icons'

const MasterProfileManagementReg = () => {

    const navigate = useNavigate()
    const { toast } = useToast()
    // 메타테이블 전체조회 테이블 선택 콤보박스 조회 API
    const [metaInfoSrchInfo, setMetaInfoSrchInfo] = useState<MetaInfoSearchProps>(cloneDeep(initMetaInfoSearchProps))
    const [attrMetaTbList, setAttrMetaTbList] = useState<Array<TbCoMetaTbInfo>>([])
    const [behvMetaTbList, setBehvMetaTbList] = useState<Array<TbCoMetaTbInfo>>([])
    const { data: metaInfoRes, isError: metaInfoErr, refetch: metaInfoRefetch } = useMetaInfo(metaInfoSrchInfo)
    // 선택한 Resolution 룰에 따른 마스터 join key 후보 조회 API
    const [rslnRuleId, setRslnRuleId] = useState<string>("")
    const [rslnRuleKeyPrtyList, setRslnRuleKeyPrtyList] = useState<Array<TbRsRslnRuleKeyPrty>>(cloneDeep([initTbRsRslnRuleKeyPrty]))
    const { data: rslnKeyListRes, isError: rslnKeyListErr, refetch: rslnKeyListRefetch } = useResolutionKeyList(rslnRuleId)
    // 등록 body param
    const [mstrSgmtFormData, setMstrSgmtFormData] = useState<MasterProfileInfo>(cloneDeep(initMasterProfileInfo))
    // 기본 정보
    const [mstrSgmtRule, setMstrSgmtRule] = useState<TbRsMstrSgmtRule>(cloneDeep(initTbRsMstrSgmtRule))
    // 속성 테이블 정보
    const [attrMstrSgmtRuleAttrTblList, setAttrMstrSgmtRuleAttrTblList] = useState<Array<TbRsMstrSgmtRuleAttrTbl>>(cloneDeep([initTbRsMstrSgmtRuleAttrTbl]))
    // 행동 테이블 정보
    const [behvMstrSgmtRuleAttrTblList, setBehvMstrSgmtRuleAttrTblList] = useState<Array<TbRsMstrSgmtRuleAttrTbl>>(cloneDeep([initTbRsMstrSgmtRuleAttrTbl]))
    // 테이블 컬럼 정보
    const [mstrSgmtRuleAttrClmnList, setMstrSgmtRuleAttrClmnList] = useState<Array<TbRsMstrSgmtRuleAttrClmn>>([])
    // 모달, 버튼 클릭 종류
    const [btnClickType, setBtnClickType] = useState<string>('')
    const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)
    const [confirmModalTit, setConfirmModalTit] = useState<string>('')
    const [confirmModalCont, setConfirmModalCont] = useState<string>('')
    const [modalType, setModalType] = useState<string>('')
    // 등록 API
    const { data: createMstrProfInfoRes, isSuccess: createMstrProfInfoSucc, isError: createMstrProfInfoErr, mutate: createMstrProfInfoMutate } = useCreateMstrProfInfo(mstrSgmtFormData)
    // component mount
    useEffect(() => {
        setMetaInfoSrchInfo((prevState: MetaInfoSearchProps) => {
            let rtn = cloneDeep(prevState)
            rtn.type = MetaType.MSTR_SGMT
            rtn.rslnRuleId = RuleId.RESOLUTION
            return rtn
        })
        setRslnRuleId(RuleId.RESOLUTION)
    }, [])
    // 메타테이블 전체조회 테이블 선택 콤보박스 조회 API 호출
    useEffect(() => {
        if (!metaInfoSrchInfo || metaInfoSrchInfo.type === "" || metaInfoSrchInfo.rslnRuleId === "") return
        metaInfoRefetch()
    }, [metaInfoSrchInfo])
    // 메타테이블 전체조회 테이블 선택 콤보박스 조회 call back
    useEffect(() => {
        if (metaInfoErr || metaInfoRes?.successOrNot === 'N') {
            toast({
                type: ValidType.ERROR,
                content: '조회 중 에러가 발생했습니다.',
            });
        } else {
            if (metaInfoRes) {
                setAttrMetaTbList(metaInfoRes.result.filter((info: TbCoMetaTbInfo) => info.metaTblDvCd === DivisionTypes.ATTR))
                setBehvMetaTbList(metaInfoRes.result.filter((info: TbCoMetaTbInfo) => info.metaTblDvCd === DivisionTypes.BEHV))
            }
        }
    }, [metaInfoRes, metaInfoErr])
    // 선택한 Resolution 룰에 따른 마스터 join key 후보 조회 API 호출
    useEffect(() => {
        if (!rslnRuleId || rslnRuleId === "") return
        rslnKeyListRefetch()
    }, [rslnRuleId])
    // 선택한 Resolution 룰에 따른 마스터 join key 후보 조회 call back
    useEffect(() => {
        if (rslnKeyListErr || rslnKeyListRes?.successOrNot === 'N') {
            toast({
                type: ValidType.ERROR,
                content: '조회 중 에러가 발생했습니다.',
            });
        } else {
            if (rslnKeyListRes) {
                setRslnRuleKeyPrtyList(rslnKeyListRes.result)
            }
        }
    }, [rslnKeyListRes, rslnKeyListErr])
    // modal 확인/취소 이벤트
    const onConfirm = () => {
        if (modalType === ModalType.CONFIRM) {
            if (btnClickType === "reg") {
                // 등록 API 호출
                console.log("저장 data :: ", mstrSgmtFormData)
                //createMstrProfInfoMutate()
            }
        }
        setIsOpenConfirmModal(false)
    }
    const onCancel = () => {
        setIsOpenConfirmModal(false)
    }
    // 기본정보 수정시 formData setting
    useEffect(() => {
        setMstrSgmtFormData((prevState: MasterProfileInfo) => {
            let rtn = cloneDeep(prevState)
            rtn.tbRsMstrSgmtRule = mstrSgmtRule
            return rtn
        })
    }, [mstrSgmtRule])
    // 속성 및 행동 테이블 정보 수정시 formData setting
    useEffect(() => {
        setMstrSgmtFormData((prevState: MasterProfileInfo) => {
            let rtn = cloneDeep(prevState)
            let behvList = rtn.tbRsMstrSgmtRuleAttrTbl.filter((item: TbRsMstrSgmtRuleAttrTbl) => item.sgmtDvCd === DivisionTypes.BEHV)
            rtn.tbRsMstrSgmtRuleAttrTbl = [...behvList, ...attrMstrSgmtRuleAttrTblList]
            return rtn
        })
    }, [attrMstrSgmtRuleAttrTblList])
    useEffect(() => {
        setMstrSgmtFormData((prevState: MasterProfileInfo) => {
            let rtn = cloneDeep(prevState)
            let attrList = rtn.tbRsMstrSgmtRuleAttrTbl.filter((item: TbRsMstrSgmtRuleAttrTbl) => item.sgmtDvCd === DivisionTypes.ATTR)
            rtn.tbRsMstrSgmtRuleAttrTbl = [...attrList, ...behvMstrSgmtRuleAttrTblList]
            return rtn
        })
    }, [behvMstrSgmtRuleAttrTblList])
    // 속성 및 행동 테이블 컬럼 정보 수정시 formData setting
    useEffect(() => {
        setMstrSgmtFormData((prevState: MasterProfileInfo) => {
            let rtn = cloneDeep(prevState)
            rtn.tbRsMstrSgmtRuleAttrClmn = mstrSgmtRuleAttrClmnList
            return rtn
        })
    }, [mstrSgmtRuleAttrClmnList])
    // 페이지 이동 및 버튼 처리
    const onClickPageMovHandler = (pageNm: string) => {
        if (pageNm === SelfFeatPgPpNm.LIST) {
            navigate('..')
        } else if (pageNm === SelfFeatPgPpNm.REG) {
            // 등록 확인 팝업
            setModalType(ModalType.CONFIRM)
            setBtnClickType("reg")
            setConfirmModalTit("Master Profile 등록")
            setConfirmModalCont("설정한 정보로 등록 하시겠습니까?")
            setIsOpenConfirmModal(true)
        } else {
            navigate(`../${pageNm}`)
        }
    }
    // input 입력 변경시
    const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        let inputValue = cloneDeep(value)
        setMstrSgmtRule((state: TbRsMstrSgmtRule) => {
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
    // 속성 및 행동 테이블 정보 추가
    const onClickAddTblInfo = (divType: string) => {
        if (divType === DivisionTypes.ATTR) {
            setAttrMstrSgmtRuleAttrTblList((prevState: Array<TbRsMstrSgmtRuleAttrTbl>) => {
                let rtn = cloneDeep(prevState)
                let addItem = cloneDeep(initTbRsMstrSgmtRuleAttrTbl)
                addItem.sgmtDvCd = divType
                rtn.push(addItem)
                return rtn
            })
        } else if (divType === DivisionTypes.BEHV) {
            setBehvMstrSgmtRuleAttrTblList((prevState: Array<TbRsMstrSgmtRuleAttrTbl>) => {
                let rtn = cloneDeep(prevState)
                let addItem = cloneDeep(initTbRsMstrSgmtRuleAttrTbl)
                addItem.sgmtDvCd = divType
                rtn.push(addItem)
                return rtn
            })
        }
    }
    // 등록 API 호출 Call back
    useEffect(() => {
        if (createMstrProfInfoErr || createMstrProfInfoRes?.successOrNot === 'N') {
            toast({
                type: ValidType.ERROR,
                content: '등록 중 에러가 발생했습니다.',
            })
        } else if (createMstrProfInfoSucc) {
            toast({
                type: ValidType.CONFIRM,
                content: '등록되었습니다.',
            })
            console.log(createMstrProfInfoRes.result)
            // 상세로 redirect
            // navigate(`../${SelfFeatPgPpNm.DETL}`, { state: featureInfo.tbRsCustFeatRule })
        }
    }, [createMstrProfInfoRes, createMstrProfInfoSucc, createMstrProfInfoErr])

    return (
        <Stack direction="Vertical" gap="MD" justifyContent="Between" className='height-100'>
            {/* 기본 정보 */}
            <Typography variant="h4">Master Profile 정보</Typography>
            <Stack direction="Vertical" className="width-100" gap="MD">
                <HorizontalTable className="width-100">
                    <TR>
                        <TH colSpan={1} align="right" required>
                            Master Profile
                        </TH>
                        <TD colSpan={2} align="left">
                            <TextField
                                className="width-100"
                                id="mstrSgmtRuleNm"
                                onChange={onchangeInputHandler}
                            />
                            {/* {masterProfileInfo.tbRsMstrSgmtRule.mstrSgmtRuleNm} */}
                        </TD>
                        <TH colSpan={1} align="right" required>
                            Description
                        </TH>
                        <TD colSpan={2} align="left">
                            <TextField
                                className="width-100"
                                id="mstrSgmtRuleDesc"
                                onChange={onchangeInputHandler}
                            />
                            {/* {masterProfileInfo.tbRsMstrSgmtRule.mstrSgmtRuleDesc} */}
                        </TD>
                    </TR>
                </HorizontalTable>
            </Stack>
            {/* 기본 정보 */}
            {/* 속성 정보 */}
            <Stack
                direction="Vertical"
                className="width-100"
                gap="MD"
            >
                <Stack
                    direction="Vertical"
                    className="width-100"
                    gap="MD"
                    style={{
                        border: '1px solid rgb(218, 218, 218)',
                        borderRadius: '5px',
                        padding: "1rem"
                    }}
                >
                    <Stack
                        direction="Horizontal"
                        justifyContent="Start"
                        gap="LG"
                    >
                        <Typography variant="h4">Fact 정보</Typography>
                        <AddIcon
                            onClick={() => onClickAddTblInfo(DivisionTypes.ATTR)}
                        />
                    </Stack>
                    {
                        attrMstrSgmtRuleAttrTblList.map((attrTblInfo: TbRsMstrSgmtRuleAttrTbl, index: number) => {
                            attrTblInfo.sgmtDvCd = DivisionTypes.ATTR
                            return (
                                <MstrProfInfo
                                    key={`attr-mstr-prof-reg-${index}`}
                                    targetIndex={index}
                                    editMode={true}
                                    rslnRuleKeyPrtyList={rslnRuleKeyPrtyList}   //선택된 resolution id에 해당되는 마스터 조인키 리스트
                                    metaTblInfo={attrTblInfo}                   //저장된 메타테이블 정보
                                    metaTblAllList={attrMetaTbList}             //모든 행동정보 메타테이블 정보(선택된 resolution id에 해당되는)
                                    setMstrSgmtRuleAttrTblList={setAttrMstrSgmtRuleAttrTblList}
                                    setMstrSgmtRuleAttrClmnList={setMstrSgmtRuleAttrClmnList}
                                />
                            )
                        })
                    }
                </Stack>
            </Stack>
            {/* 속성 정보 */}
            {/* 행동 정보 */}
            <Stack
                direction="Vertical"
                className="width-100"
                gap="MD"
            >
                <Stack
                    direction="Vertical"
                    className="width-100"
                    gap="MD"
                    style={{
                        border: '1px solid rgb(218, 218, 218)',
                        borderRadius: '5px',
                        padding: "1rem"
                    }}
                >
                    <Stack
                        direction="Horizontal"
                        justifyContent="Start"
                        gap="LG"
                    >
                        <Typography variant="h4">Base Fact 정보</Typography>
                        <AddIcon
                            onClick={() => onClickAddTblInfo(DivisionTypes.BEHV)}
                        />
                    </Stack>
                    {
                        behvMstrSgmtRuleAttrTblList.map((behvTblInfo: TbRsMstrSgmtRuleAttrTbl, index: number) => {
                            behvTblInfo.sgmtDvCd = DivisionTypes.BEHV
                            return (
                                <MstrProfInfo
                                    key={`behv-mstr-prof-reg-${index}`}
                                    editMode={true}
                                    targetIndex={index}
                                    rslnRuleKeyPrtyList={rslnRuleKeyPrtyList}   //선택된 resolution id에 해당되는 마스터 조인키 리스트
                                    metaTblInfo={behvTblInfo}                   //저장된 메타테이블 정보
                                    metaTblAllList={behvMetaTbList}             //모든 행동정보 메타테이블 정보(선택된 resolution id에 해당되는)
                                    setMstrSgmtRuleAttrTblList={setBehvMstrSgmtRuleAttrTblList}
                                    setMstrSgmtRuleAttrClmnList={setMstrSgmtRuleAttrClmnList}
                                />
                            )
                        })
                    }
                </Stack>
            </Stack>
            {/* 행동 정보 */}
            {/* 버튼 영역 */}
            <Stack direction="Vertical" gap="MD" justifyContent="End">
                <Stack justifyContent="End" gap="SM" className="width-100">
                    <Button priority="Normal" appearance="Outline" size="LG" onClick={() => onClickPageMovHandler(SelfFeatPgPpNm.LIST)}>
                        목록
                    </Button>
                    <Button priority="Primary" appearance="Contained" size="LG" onClick={() => onClickPageMovHandler(SelfFeatPgPpNm.REG)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M8.79502 15.8749L4.62502 11.7049L3.20502 13.1149L8.79502 18.7049L20.795 6.70492L19.385 5.29492L8.79502 15.8749Z"
                                fill="currentColor"
                            ></path>
                        </svg>
                        저장
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

export default MasterProfileManagementReg

// onThisDayClick={() => {
//     let today = getDateFormat(new Date().toString(), "YYYY-MM-DD")
//     setOprd2DpValue(today)
//     onChangeDatePickerHandler("operand2", today)
// }}