import {
    useState,
    useEffect,
    useCallback,
} from 'react'
import { cloneDeep } from 'lodash'

import {
    Button,
    Modal,
    Stack,
    TD,
    TH,
    TR,
    TextField,
} from '@components/ui'
import HorizontalTable from '@/components/table/HorizontalTable'
import VerticalTable from '@/components/table/VerticalTable'
import {
    initSfSubmissionAppendApproval,
    initSfSubmissionApproval,
    sfSubmissionAppendApprovalListColumns,
} from '@/pages/user/self-feature-submission/data'
import {
    AprvSeqNm,
    SfSubmissionAppendApproval,
    SfSubmissionApproval
} from '@/models/selfFeature/FeatureSubmissionModel'
import ConfirmModal from '@/components/modal/ConfirmModal'
import { ModalTitCont, ModalType } from '@/models/selfFeature/FeatureCommon'

export interface Props {
    isOpen?: boolean
    onClose: (isOpen: boolean) => void
    aprvList: Array<SfSubmissionAppendApproval>
    aprvCategory: string
    setSfSubmissionApprovalList: React.Dispatch<React.SetStateAction<Array<SfSubmissionApproval>>>
}

const SubAppdAprvModal = ({
    isOpen = false,
    onClose,
    aprvList,
    aprvCategory,
    setSfSubmissionApprovalList
}: Props) => {

    const [isOpenSubAppedAprvModal, setIsOpenSubAppedAprvModal] = useState<boolean>(false);
    const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)
    const [confirmModalTit, setConfirmModalTit] = useState<string>('')
    const [confirmModalCont, setConfirmModalCont] = useState<string>('')
    const [modalType, setModalType] = useState<string>('')

    const [approvalSrch, setApprovalSrch] = useState<SfSubmissionAppendApproval>(cloneDeep(initSfSubmissionAppendApproval))
    // 검색 결과 결재자 목록
    const [searchApprovals, setSearchApprovals] = useState<Array<SfSubmissionAppendApproval>>(cloneDeep([initSfSubmissionAppendApproval]))
    // 추가할 결재자 목록
    const [appendApprovalList, setAppendApprovalList] = useState<Array<SfSubmissionAppendApproval>>([])

    useEffect(() => {
        setIsOpenSubAppedAprvModal(isOpen)
        // 팝업 오픈시
        if (isOpen) {

        }
    }, [isOpen])

    const handleClose = useCallback(
        (isOpenSubAppedAprvModal: boolean) => {
            if (onClose) {
                // 초기화
                setAppendApprovalList([])
                setApprovalSrch(cloneDeep(initSfSubmissionAppendApproval))
                onClose(isOpenSubAppedAprvModal)
            } else {
                setIsOpenSubAppedAprvModal(isOpenSubAppedAprvModal)
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
        setIsOpenSubAppedAprvModal(false)
        onClose(false)
    }

    useEffect(() => {
        setSearchApprovals(aprvList)
    }, [aprvList])

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
        setSfSubmissionApprovalList((state: Array<SfSubmissionApproval>) => {
            let rtn = cloneDeep(state)
            let t: Array<SfSubmissionApproval> = []

            for (let i = 0; i < 3; i++) {
                let subAprv: SfSubmissionApproval = cloneDeep(initSfSubmissionApproval)

                if (rtn && rtn[i]) {
                    subAprv = rtn[i]
                }

                subAprv.approvalSequence = i + 1

                if (subAprv.approvalSequence === 1) subAprv.approvalSequenceNm = AprvSeqNm.FIRST
                else if (subAprv.approvalSequence === 2) subAprv.approvalSequenceNm = AprvSeqNm.SECOND
                else if (subAprv.approvalSequence === 3) subAprv.approvalSequenceNm = AprvSeqNm.LAST

                t.push(subAprv)
            }

            //index에 따른 결재자 지정
            if (aprvCategory === AprvSeqNm.FIRST) {
                t[0].approver = appendApprovalList[0].userEmail
                t[0].approverNm = appendApprovalList[0].userNm
            } else if (aprvCategory === AprvSeqNm.SECOND) {
                t[1].approver = appendApprovalList[0].userEmail
                t[1].approverNm = appendApprovalList[0].userNm
            } else if (aprvCategory === AprvSeqNm.LAST) {
                t[2].approver = appendApprovalList[0].userEmail
                t[2].approverNm = appendApprovalList[0].userNm
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

        if (approvalSrch.userNm.trim() === "" && approvalSrch.userEmail.trim() === "") {
            setSearchApprovals(aprvList)
            return
        }
        let srchRsltList: Array<SfSubmissionAppendApproval> = []

        if (approvalSrch.userNm.trim() !== "" && approvalSrch.userEmail.trim() !== "") {
            srchRsltList = aprvList.filter((trgt: SfSubmissionAppendApproval) => ((trgt.userNm && trgt.userEmail) && trgt.userNm.indexOf(approvalSrch.userNm) > -1 && trgt.userEmail.indexOf(approvalSrch.userEmail) > -1) ? true : false)
        } else if (approvalSrch.userNm.trim() !== "" && approvalSrch.userEmail.trim() === "") {
            srchRsltList = aprvList.filter((trgt: SfSubmissionAppendApproval) => trgt.userNm && trgt.userNm.indexOf(approvalSrch.userNm) > -1 ? true : false)
        } else if (approvalSrch.userEmail.trim() !== "" && approvalSrch.userNm.trim() === "") {
            srchRsltList = aprvList.filter((trgt: SfSubmissionAppendApproval) => trgt.userEmail && trgt.userEmail.indexOf(approvalSrch.userEmail) > -1 ? true : false)
        }

        setSearchApprovals(() => {
            let rtn: Array<SfSubmissionAppendApproval> = []
            rtn = [...srchRsltList]
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
                open={isOpenSubAppedAprvModal}
                onClose={handleClose}
                size="MD"
                closeOnOutsideClick={false}
            >
                <Modal.Header>결재선 선택</Modal.Header>
                <Modal.Body className="width-100" style={{ maxHeight: "60vh" }}>
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
                                        value={approvalSrch.userEmail}
                                        onChange={(e) => setApprovalSrch((state: SfSubmissionAppendApproval) => {
                                            let rtn = cloneDeep(state)
                                            rtn.userEmail = e.target.value
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

export default SubAppdAprvModal