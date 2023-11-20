import { 
    useState, 
    useEffect, 
    useCallback,
} from 'react'
import { cloneDeep } from 'lodash'

import { 
    Button,
    Modal,
    Select,
    SelectOption,
    Stack,
    TD,
    TH,
    TR,
    TextField,
} from '@components/ui'
import HorizontalTable from '@/components/table/HorizontalTable'
import VerticalTable from '@/components/table/VerticalTable'
import { 
    aprvSeqNm, 
    initSfSubmissionAppendApproval, 
    initSfSubmissionApproval, 
    sfSubmissionAppendApprovalListColumns 
} from '@/pages/user/self-feature-submission/data'
import { 
    SfSubmissionAppendApproval, 
    SfSubmissionApproval 
} from '@/models/selfFeature/FeatureSubmissionInfo'
import ConfirmModal from '@/components/modal/ConfirmModal'
import { ModalTitCont, ModalType } from '@/models/selfFeature/FeatureCommon'

export interface Props {
    isOpen?: boolean
    onClose: (isOpen: boolean) => void
    aprvCategory: string
    setDefaultSubAprvList: React.Dispatch<React.SetStateAction<Array<SfSubmissionApproval>>>
}

const SubAppdAprvPop = ({
    isOpen = false,
    onClose,
    aprvCategory,
    setDefaultSubAprvList
}: Props) => {

    const [ isOpenSubAppedAprvPop, setIsOpenSubAppedAprvPop ] = useState<boolean>(false);
    const [ isOpenConfirmModal, setIsOpenConfirmModal ] = useState<boolean>(false)
    const [ confirmModalTit, setConfirmModalTit ] = useState<string>('')
    const [ confirmModalCont, setConfirmModalCont ] = useState<string>('')
    const [ modalType, setModalType ] = useState<string>('')

    const [ approvalSrch, setApprovalSrch ] = useState<SfSubmissionAppendApproval>(cloneDeep(initSfSubmissionAppendApproval))
    // 전체 결재자 목록
    const [ appendApprovals, setAppendApprovals ] = useState<Array<SfSubmissionAppendApproval>>(cloneDeep([initSfSubmissionAppendApproval]))
    // 검색 결과 결재자 목록
    const [ searchApprovals, setSearchApprovals ] = useState<Array<SfSubmissionAppendApproval>>(cloneDeep([initSfSubmissionAppendApproval]))
    // 추가할 결재자 목록
    const [ appendApprovalList, setAppendApprovalList ] = useState<Array<SfSubmissionAppendApproval>>([])

    useEffect(() => {
        setIsOpenSubAppedAprvPop(isOpen)
        // 팝업 오픈시
        if (isOpen) {
            retrieveSubmissions2()
        }
    }, [isOpen])

    const handleClose = useCallback(
        (isOpenSubAppedAprvPop: boolean) => {
            if (onClose) {
                // 초기화
                setAppendApprovalList([])
                setApprovalSrch(cloneDeep(initSfSubmissionAppendApproval))
                onClose(isOpenSubAppedAprvPop)
            } else {
                setIsOpenSubAppedAprvPop(isOpenSubAppedAprvPop)
            }
        },
        [onClose]
    )

    // modal 확인/취소 이벤트
    const onConfirm = () => {
        if (modalType === ModalType.CONFIRM) {
            /*
            if (regType === selfFeatPgPpNm.SQL_REG) {
                createCustFeatSQL()
            } else if (regType === selfFeatPgPpNm.RULE_REG) {
                createCustFeatRule()
            }
            */
        }
        setIsOpenConfirmModal(false)
    }

    const onCancel = () => {
        setIsOpenConfirmModal(false)
    }

    const onClickCancelSubAppdAprv = () => {
        setAppendApprovalList([])
        setApprovalSrch(cloneDeep(initSfSubmissionAppendApproval))
        setIsOpenSubAppedAprvPop(false)
        onClose(false)
    }

    const retrieveSubmissions2 = async () => {
        /*
          Method      :: GET
          Url         :: /api/v1/submission-types/{type}/approver-candidate
          path param  :: {type} - TagManagerContainer, TagManagerDeployment, CustomerFeature
          query param :: 
          body param  :: 
        */
        // index에 따른 서로 다른 목록 호출 필요
        if (aprvCategory === aprvSeqNm.FIRST) {
            setAppendApprovals((state: Array<SfSubmissionAppendApproval>) => {
                let rtn = cloneDeep(state)
                let t = []
                for (let i = 0; i < 5; i++) {
                    let appendApproval = cloneDeep(initSfSubmissionAppendApproval)
                    appendApproval.lginId = `test${i+1}@koreanair.com`
                    appendApproval.userNm = `test${i+1}`
                    t.push(appendApproval)
                }
                rtn = t
                return rtn
            })
            setSearchApprovals((state: Array<SfSubmissionAppendApproval>) => {
                let rtn = cloneDeep(state)
                let t = []
                for (let i = 0; i < 5; i++) {
                    let appendApproval = cloneDeep(initSfSubmissionAppendApproval)
                    appendApproval.lginId = `test${i+1}@koreanair.com`
                    appendApproval.userNm = `test${i+1}`
                    t.push(appendApproval)
                }
                rtn = t
                return rtn
            })
        } else if (aprvCategory === aprvSeqNm.SECOND) {
            setAppendApprovals((state: Array<SfSubmissionAppendApproval>) => {
                let rtn = cloneDeep(state)
                let t = []
                for (let i = 5; i < 10; i++) {
                    let appendApproval = cloneDeep(initSfSubmissionAppendApproval)
                    appendApproval.lginId = `test${i+1}@koreanair.com`
                    appendApproval.userNm = `test${i+1}`
                    t.push(appendApproval)
                }
                rtn = t
                return rtn
            })
            setSearchApprovals((state: Array<SfSubmissionAppendApproval>) => {
                let rtn = cloneDeep(state)
                let t = []
                for (let i = 5; i < 10; i++) {
                    let appendApproval = cloneDeep(initSfSubmissionAppendApproval)
                    appendApproval.lginId = `test${i+1}@koreanair.com`
                    appendApproval.userNm = `test${i+1}`
                    t.push(appendApproval)
                }
                rtn = t
                return rtn
            })
        } else if (aprvCategory === aprvSeqNm.LAST) {
            setAppendApprovals((state: Array<SfSubmissionAppendApproval>) => {
                let rtn = cloneDeep(state)
                let t = []
                for (let i = 10; i < 15; i++) {
                    let appendApproval = cloneDeep(initSfSubmissionAppendApproval)
                    appendApproval.lginId = `test${i+1}@koreanair.com`
                    appendApproval.userNm = `test${i+1}`
                    t.push(appendApproval)
                }
                rtn = t
                return rtn
            })
            setSearchApprovals((state: Array<SfSubmissionAppendApproval>) => {
                let rtn = cloneDeep(state)
                let t = []
                for (let i = 10; i < 15; i++) {
                    let appendApproval = cloneDeep(initSfSubmissionAppendApproval)
                    appendApproval.lginId = `test${i+1}@koreanair.com`
                    appendApproval.userNm = `test${i+1}`
                    t.push(appendApproval)
                }
                rtn = t
                return rtn
            })
        }
    }

    const onClickAppendApprovals = () => {

        if (appendApprovalList.length === 0) {
            setModalType(ModalType.ALERT)
            setConfirmModalTit(ModalTitCont.APRO_MAX_SLCT.title)
            setConfirmModalCont(ModalTitCont.APRO_MAX_SLCT.context)
            setIsOpenConfirmModal(true)
            return
        }

        if (appendApprovalList.length > 1) {
            setModalType(ModalType.ALERT)
            setConfirmModalTit(ModalTitCont.APRO_MAX_APND.title)
            setConfirmModalCont(ModalTitCont.APRO_MAX_APND.context)
            setIsOpenConfirmModal(true)
            return
        }

        /*
        if (approvals.length > 2 || ((appendApprovalList.length + approvals.length) > 3)) {
            setModalType(ModalType.ALERT)
            setConfirmModalTit(ModalTitCont.APRO_MAX_APND.title)
            setConfirmModalCont(ModalTitCont.APRO_MAX_APND.context)
            setIsOpenConfirmModal(true)
            return
        }
        */
        setDefaultSubAprvList((state: Array<SfSubmissionApproval>) => {
            let rtn = cloneDeep(state)
            let t: Array<SfSubmissionApproval> = []

            for (let i = 0; i < 3; i++) {
                let subAprv: SfSubmissionApproval = cloneDeep(initSfSubmissionApproval)

                if (rtn && rtn[i]) {
                    subAprv = rtn[i]
                }

                subAprv.approvalSequence = i + 1

                if (subAprv.approvalSequence === 1) subAprv.approvalSequenceNm = aprvSeqNm.FIRST
                else if (subAprv.approvalSequence === 2) subAprv.approvalSequenceNm = aprvSeqNm.SECOND
                else if (subAprv.approvalSequence === 3) subAprv.approvalSequenceNm = aprvSeqNm.LAST

                t.push(subAprv)
            }

            //index에 따른 결재자 지정
            if (aprvCategory === aprvSeqNm.FIRST) {
                t[0].approver = appendApprovalList[0].userNm
            } else if (aprvCategory === aprvSeqNm.SECOND) {
                t[1].approver = appendApprovalList[0].userNm
            } else if (aprvCategory === aprvSeqNm.LAST) {
                t[2].approver = appendApprovalList[0].userNm
            }

            return t
        })

        onClickCancelSubAppdAprv()
    }

    const getCheckList = (checkedList: Array<number>) => {
        //checkedList = checkedList.sort((a: number, b: number) => a - b)
        setAppendApprovalList(() => {
            let appendList = checkedList.map((appendItemIdx) => searchApprovals[appendItemIdx])
            return cloneDeep(appendList)
        })
    }

    const onClickTrgtSrchHandler = () => {

        if (approvalSrch.userNm.trim() === "" && approvalSrch.lginId.trim() === "") {
            setSearchApprovals(appendApprovals)
            return
        }
        let srchRsltList: Array<SfSubmissionAppendApproval> = []
        
        if (approvalSrch.userNm.trim() !== "" && approvalSrch.userNm.trim() !== "") {
            srchRsltList = appendApprovals.filter((trgt: SfSubmissionAppendApproval) => (trgt.userNm.indexOf(approvalSrch.userNm) > -1 && trgt.lginId.indexOf(approvalSrch.lginId) > -1) ? true : false)
        } else if (approvalSrch.userNm.trim() !== "" && approvalSrch.lginId.trim() === "") {
            srchRsltList = appendApprovals.filter((trgt: SfSubmissionAppendApproval) => trgt.userNm.indexOf(approvalSrch.userNm) > -1 ? true : false)
        } else if (approvalSrch.lginId.trim() !== "" && approvalSrch.userNm.trim() === "") {
            srchRsltList = appendApprovals.filter((trgt: SfSubmissionAppendApproval) => trgt.lginId.indexOf(approvalSrch.lginId) > -1 ? true : false)
        }

        setSearchApprovals(() => {
            let rtn: Array<SfSubmissionAppendApproval> = []
            rtn = [ ...srchRsltList ]
            return rtn
        })

    }

    const onKeyPressNameSrchHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onClickTrgtSrchHandler()
        }
    }
    const onKeyPressEmailSrchHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onClickTrgtSrchHandler()
        }
    }

    return (
        <>
        <Modal 
            open={isOpenSubAppedAprvPop} 
            onClose={handleClose} 
            size="LG" 
            closeOnOutsideClick={false}
        >
            <Modal.Header>결재선 선택</Modal.Header>
            <Modal.Body className="width-100" style={{maxHeight:"60vh"}}>
                <Stack 
                    direction="Vertical" 
                    gap="SM"
                    className="width-100"
                >
                    <HorizontalTable className="width-100">
                        <TR>
                            <TH colSpan={1} align="right">
                            이름
                            </TH>
                            <TD colSpan={2}>
                                <TextField 
                                    className="width-100" 
                                    value={approvalSrch.userNm} 
                                    onChange={(e) => setApprovalSrch((state: SfSubmissionAppendApproval) => {
                                        let rtn = cloneDeep(state)
                                        rtn.userNm = e.target.value
                                        return rtn
                                    })}
                                    onKeyDown={onKeyPressNameSrchHandler}
                                />
                            </TD>
                        </TR>
                        <TR>
                            <TH colSpan={1} align="right">
                            이메일
                            </TH>
                            <TD colSpan={2}>
                                <TextField 
                                    className="width-100" 
                                    value={approvalSrch.lginId} 
                                    onChange={(e) => setApprovalSrch((state: SfSubmissionAppendApproval) => {
                                        let rtn = cloneDeep(state)
                                        rtn.lginId = e.target.value
                                        return rtn
                                    })}
                                    onKeyDown={onKeyPressEmailSrchHandler}
                                />
                            </TD>
                        </TR>
                    </HorizontalTable>
                    <Stack justifyContent="Center">
                        <Button 
                            type="button" 
                            priority="Primary" 
                            appearance="Contained" 
                            size="MD" 
                            onClick={onClickTrgtSrchHandler}
                        >
                        <span className="searchIcon"></span>
                        조회
                        </Button>
                    </Stack>
                    {/* <Stack justifyContent="End">
                        <Select 
                            appearance="Outline" 
                            size="MD" 
                            defaultValue={1}
                        >
                            <SelectOption value={1}>전체</SelectOption>
                        </Select>
                    </Stack> */}
                    <VerticalTable
                        columns={sfSubmissionAppendApprovalListColumns}
                        rows={searchApprovals}
                        enableSort={false}
                        clickable={true}
                        rowSelection={(checkedList: Array<number>) => getCheckList(checkedList)}
                    />
                </Stack>
            </Modal.Body>
            <Modal.Footer>
                <Button 
                    priority="Primary" 
                    appearance="Contained" 
                    size="LG"
                    onClick={onClickAppendApprovals} 
                >
                지정
                </Button>
                <Button
                    priority="Normal" 
                    appearance="Outline" 
                    size="LG"
                    onClick={onClickCancelSubAppdAprv} 
                >
                닫기
                </Button>
            </Modal.Footer>
        </Modal>

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
        </>
    )
}

export default SubAppdAprvPop