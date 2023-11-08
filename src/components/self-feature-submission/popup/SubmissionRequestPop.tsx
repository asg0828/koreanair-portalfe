import { useCallback, useEffect, useState } from 'react';
import { cloneDeep } from 'lodash'

import VerticalTable from '@components/table/VerticalTable';
import HorizontalTable from '@/components/table/HorizontalTable';
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
    Modal 
} from '@components/ui'
import SubmissionApprovePop from './SubmissionApprovePop';

import { 
    SfSubmission, 
    SfSubmissionApproval, 
    SfSubmissionRequestInfo
} from '@/models/selfFeature/FeatureSubmissionInfo';
import { 
    aprvSeqNm,
    initSfSubmission, 
    initSfSubmissionApproval, 
    initSfSubmissionRequestInfo, 
    protoTypeSfSubmissionApprovalListApproved, 
    protoTypeSfSubmissionApprovalListInApproval, 
    protoTypeSfSubmissionApprovalListRejected, 
    protoTypeSfSubmissionApprovalListSaved, 
    protoTypeSfSubmissionRequestInfoApproved, 
    protoTypeSfSubmissionRequestInfoInApproval, 
    protoTypeSfSubmissionRequestInfoRejected, 
    protoTypeSfSubmissionRequestInfoSaved, 
    sfSubmissionApprovalListColumns, 
    sfSubmissionStatusOption
} from '@/pages/user/self-feature-submission/data';
import { 
    ModalTitCont,
    ModalType,
    initApiRequest, 
    initCommonResponse, 
    initConfig, 
    subFeatStatus
} from '@/models/selfFeature/FeatureCommon';
import { Method } from '@/utils/ApiUtil';
import ConfirmModal from '@/components/modal/ConfirmModal';
import { FeatureInfo } from '@/models/selfFeature/FeatureInfo';

export interface Props {
    isOpen?: boolean
    onClose: (isOpen: boolean) => void
    featureInfo: FeatureInfo
}

const SubmissionRequestPop = ({
    isOpen = false,
    onClose,
    featureInfo,
}: Props) => {

    const [ regType, setRegType ] = useState<string>('')

    const [ isOpenConfirmModal, setIsOpenConfirmModal ] = useState<boolean>(false)
    const [ confirmModalTit, setConfirmModalTit ] = useState<string>('')
    const [ confirmModalCont, setConfirmModalCont ] = useState<string>('')
    const [ modalType, setModalType ] = useState<string>('')

    const [ submissionInfo, setSubmissionInfo ] = useState<SfSubmission>(cloneDeep(initSfSubmission))
    const [ submission, setSubmission ] = useState<SfSubmissionRequestInfo>(cloneDeep(initSfSubmissionRequestInfo))
    const [ approvals, setApprovals ] = useState<Array<SfSubmissionApproval>>([])
    const [ approveRemoveList, setApproveRemoveList ] = useState<Array<SfSubmissionApproval>>([])

    const [isOpenSubmissionRequestPop, setIsOpenSubmissionRequestPop] = useState<boolean>(false);
    const [isOpenSubmissionApprovePop, setIsOpenSubmissionApprovePop] = useState('rightPopup openFalse');

    useEffect(() => {
        setIsOpenSubmissionRequestPop(isOpen)
        // 팝업 오픈시
        if (isOpen) {
            retrieveSubmission1()
        }
    }, [isOpen])

    // modal 확인/취소 이벤트
    const onConfirm = () => {
        if (modalType === ModalType.CONFIRM) {
            if (regType === "cancel") {
                cancelRequestSubmission()
            } else if (regType === "insert") {
                insertSubmission()
            } else if (regType === "insertRequest") {
                insertRequestSubmission()                
            }
        }
        setIsOpenConfirmModal(false)
    }

    const onCancel = () => {
        setIsOpenConfirmModal(false)
    }

    useEffect(() => {
        setSubmissionInfo((state: SfSubmission) => {
            let rtn = cloneDeep(state)
            rtn.submission = submission
            return rtn
        })
    }, [submission])

    useEffect(() => {
        setSubmissionInfo((state: SfSubmission) => {
            let rtn = cloneDeep(state)
            rtn.approvals = approvals
            return rtn
        })
    }, [approvals])

    const retrieveSubmission1 = () => {
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
        let submissionId = ""
        request.url = `/api/v1/submissions/${submissionId}`
        console.log("[retrieveSubmission1] Request  :: ", request)

        let response = cloneDeep(initCommonResponse)
        //response = await callApi(request)
        console.log("[retrieveSubmission1] Response :: ", response)
        if (featureInfo.tbRsCustFeatRule.submissionStatus !== "") {
            let featureStatus = featureInfo.tbRsCustFeatRule.submissionStatus
            let requestInfo: SfSubmissionRequestInfo = cloneDeep(initSfSubmissionRequestInfo)
            let approvalList: Array<SfSubmissionApproval> = cloneDeep([initSfSubmissionApproval])
    
            if (featureStatus === subFeatStatus.SAVE) {
                protoTypeSfSubmissionRequestInfoSaved.statusNm = sfSubmissionStatusOption[1].text
                requestInfo = protoTypeSfSubmissionRequestInfoSaved
                approvalList = protoTypeSfSubmissionApprovalListSaved
            } else if (featureStatus === subFeatStatus.IN_APRV) {
                protoTypeSfSubmissionRequestInfoInApproval.statusNm = sfSubmissionStatusOption[2].text
                requestInfo = protoTypeSfSubmissionRequestInfoInApproval
                approvalList = protoTypeSfSubmissionApprovalListInApproval
            } else if (featureStatus === subFeatStatus.APRV) {
                protoTypeSfSubmissionRequestInfoApproved.statusNm = sfSubmissionStatusOption[3].text
                requestInfo = protoTypeSfSubmissionRequestInfoApproved
                approvalList = protoTypeSfSubmissionApprovalListApproved
            } else if (featureStatus === subFeatStatus.REJT) {
                protoTypeSfSubmissionRequestInfoRejected.statusNm = sfSubmissionStatusOption[4].text
                requestInfo = protoTypeSfSubmissionRequestInfoRejected
                approvalList = protoTypeSfSubmissionApprovalListRejected
            }
            console.log("requestInfo :: ", requestInfo)
            console.log("approvalList :: ", approvalList)
            setSubmission((state: SfSubmissionRequestInfo) => {
              return requestInfo
            })
            setApprovals((state: Array<SfSubmissionApproval>) => {
              /*
              let rtn = []//cloneDeep(state)
              for (let i = 0; i < 3; i++) {
                let approval: SfSubmissionApproval = cloneDeep(initSfSubmissionApproval)
                approval.approver = `결재자${i + 1}`
                approval.approvalSequence = i + 1
                if (approval.approvalSequence === 1) {
                  approval.approvalSequenceNm = aprvSeqNm.FIRST
                } else if (approval.approvalSequence === 2) {
                  approval.approvalSequenceNm = aprvSeqNm.SECOND
                } else if (approval.approvalSequence === 3) {
                  approval.approvalSequenceNm = aprvSeqNm.LAST
                }
                rtn.push(approval)
              }
              */
              return approvalList
            })
        }
    }

    const handleClose = useCallback(
        (isOpenSubmissionRequestPop: boolean) => {
            if (onClose) {
                // 초기화
                setApprovals([])
                onClose(isOpenSubmissionRequestPop)
            } else {
                setIsOpenSubmissionRequestPop(isOpenSubmissionRequestPop)
            }
        },
        [onClose]
    )

    const onClickCancelSubmission = () => {
        setIsOpenSubmissionRequestPop(false);
        setIsOpenSubmissionApprovePop('rightPopup openFalse');
        // 초기화
        setSubmission(cloneDeep(initSfSubmissionRequestInfo))
        setApprovals([])
        onClose(false)
    }

    const handleApproveAppend = () => {
        if (isOpenSubmissionApprovePop === "rightPopup openFalse")
            setIsOpenSubmissionApprovePop('rightPopup openTrue');
    }

    const handleApproveDelete = () => {
        // 결재선 리스트 삭제
        setApprovals((state: Array<SfSubmissionApproval>) => {
            let prev = cloneDeep(state)
            let rtn: Array<SfSubmissionApproval> = []

            rtn = prev.filter((item: SfSubmissionApproval) => {
                return !approveRemoveList.some(remove => item.approvalSequence === remove.approvalSequence)
            })

            rtn.map((v: SfSubmissionApproval, idx: number) => {
                v.approvalSequence = idx + 1
                if (v.approvalSequence === 1) {
                    v.approvalSequenceNm = aprvSeqNm.FIRST
                } else if (v.approvalSequence === 2) {
                    v.approvalSequenceNm = aprvSeqNm.SECOND
                } else if (v.approvalSequence === 3) {
                    v.approvalSequenceNm = aprvSeqNm.LAST
                }
            })

            return rtn
        })
    }

    const getCheckList = (checkedList: Array<number>) => {
        // 삭제할 결재선 목록 선택
        setApproveRemoveList(() => {
            let delList = checkedList.map((delItemIdx) => approvals[delItemIdx])
            return cloneDeep(delList)
        })
    }

    const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target

        setSubmission((state: SfSubmissionRequestInfo) => {
            let rtn = cloneDeep(state)
            Object.keys(submission).map((key) => {
                if (key === id) {
                    rtn[key] = value
                }
            })
            return rtn
        })
    }

    const onClickCancelRequestSubmission = () => {
        setModalType(ModalType.CONFIRM)
        setRegType("cancel")
        setConfirmModalTit(ModalTitCont.SUBMISSION_CANCEL.title)
        setConfirmModalCont(ModalTitCont.SUBMISSION_CANCEL.context)
        setIsOpenConfirmModal(true)
    }

    const onClickInsertSubmission = () => {
        setModalType(ModalType.CONFIRM)
        setRegType("insert")
        setConfirmModalTit(ModalTitCont.SUBMISSION_INSERT.title)
        setConfirmModalCont(ModalTitCont.SUBMISSION_INSERT.context)
        setIsOpenConfirmModal(true)
    }

    const onClickInsertRequestSubmission = () => {
        setModalType(ModalType.CONFIRM)
        setRegType("insertRequest")
        setConfirmModalTit(ModalTitCont.SUBMISSION_INSERT_REQ.title)
        setConfirmModalCont(ModalTitCont.SUBMISSION_INSERT_REQ.context)
        setIsOpenConfirmModal(true)
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

    const insertSubmission = async () => {
        /*
            품의(승인정보) 저장
            Method      :: POST
            Url         :: /api/v1/users/${email}/submissions
            path param  :: email
            query param :: 
            body param  :: submissionInfo
        */
        let config = cloneDeep(initConfig)
        config.isLoarding = true
        let request = cloneDeep(initApiRequest)
        request.method = Method.POST
        let email = ""
        request.url = `/api/v1/users/${email}/submissions`
        request.params!.bodyParams = submissionInfo
        console.log("[InsertSubmission] Request  :: ", request)

        let response = cloneDeep(initCommonResponse)
        //response = await callApi(request)
        console.log("[InsertSubmission] Response :: ", response)

    }

    const insertRequestSubmission = async () => {
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
        console.log("[InsertRequestSubmission] Request  :: ", request)

        let response = cloneDeep(initCommonResponse)
        //response = await callApi(request)
        console.log("[InsertRequestSubmission] Response :: ", response)
    }

    const BtnComponent = () => {
        if (submissionInfo.submission.status === "") {
            // 등록
            return (
                <>
                    <Button 
                        priority="Normal" 
                        appearance="Outline" 
                        size="LG"
                        onClick={onClickCancelSubmission} 
                    >
                    취소
                    </Button>
                    <Button 
                        priority="Primary" 
                        appearance="Contained" 
                        size="LG"
                        onClick={onClickInsertSubmission} 
                    >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path 
                            d="M8.79502 15.8749L4.62502 11.7049L3.20502 13.1149L8.79502 18.7049L20.795 6.70492L19.385 5.29492L8.79502 15.8749Z" 
                            fill="currentColor"
                        />
                    </svg>
                    저장
                    </Button>
                </>
            )
        } else if (submissionInfo.submission.status === subFeatStatus.SAVE) {
            // 품의 등록 상태
            return (
                <>
                    <Button 
                        priority="Normal" 
                        appearance="Outline" 
                        size="LG"
                        onClick={onClickCancelSubmission} 
                    >
                    취소
                    </Button>
                    <Button 
                        priority="Primary" 
                        appearance="Contained" 
                        size="LG"
                        onClick={onClickInsertSubmission} 
                    >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path 
                            d="M8.79502 15.8749L4.62502 11.7049L3.20502 13.1149L8.79502 18.7049L20.795 6.70492L19.385 5.29492L8.79502 15.8749Z" 
                            fill="currentColor"
                        />
                    </svg>
                    저장
                    </Button>
                    <Button 
                        priority="Normal" 
                        appearance="Outline" 
                        size="LG"
                        onClick={onClickInsertRequestSubmission} 
                    >
                    승인 요청
                    </Button>
                </>
            )
        } else if (submissionInfo.submission.status === subFeatStatus.IN_APRV) {
            // 결재 진행중
            return (
                <>
                    <Button 
                        priority="Normal" 
                        appearance="Outline" 
                        size="LG"
                        onClick={onClickCancelSubmission} 
                    >
                    취소
                    </Button>
                    <Button 
                        priority="Primary" 
                        appearance="Contained" 
                        size="LG"
                        onClick={onClickCancelRequestSubmission} 
                    >
                    요청 취소
                    </Button>
                </>
            )
        } else if (
            submissionInfo.submission.status === subFeatStatus.APRV
            || submissionInfo.submission.status === subFeatStatus.REJT
        ) {
            // 승인완료, 반려
            return (
                <>
                    <Button 
                        priority="Normal" 
                        appearance="Outline" 
                        size="LG"
                        onClick={onClickCancelSubmission} 
                    >
                    취소
                    </Button>
                </>
            )
        } else {
            return (
                <></>
            )
        }
    }

    return (
        <>
        <Modal 
            open={isOpenSubmissionRequestPop} 
            onClose={handleClose} 
            size="LG" 
            closeOnOutsideClick={false}
        >
            <Stack className="width-100" style={{ position: 'relative' }} alignItems="Start">
                {/* 승인 정보 */}
                <div className="width-100">
                <Modal.Header>승인 요청서</Modal.Header>
                <Modal.Body className="width-100" style={{maxHeight:"60vh"}}>
                    <Stack direction="Vertical" className="width-100" gap="MD">
                        <HorizontalTable className="width-100">
                            <TR>
                                <TH colSpan={1} align="right">
                                승인 번호
                                </TH>
                                <TD colSpan={2}>
                                    <TextField className="width-100" readOnly value={submission.submissionNo} />
                                </TD>
                                <TH colSpan={1} align="right">
                                요청자
                                </TH>
                                <TD colSpan={2}>
                                    <TextField className="width-100" readOnly value={submission.requesterName} />
                                </TD>
                            </TR>
                            <TR>
                                <TH colSpan={1} align="right">
                                승인 유형
                                </TH>
                                <TD colSpan={2}>
                                    <TextField className="width-100" readOnly value={submission.type} />
                                </TD>
                                <TH colSpan={1} align="right">
                                승인 상태
                                </TH>
                                <TD colSpan={2}>
                                    <TextField className="width-100" readOnly value={submission.statusNm} />
                                </TD>
                            </TR>
                            <TR>
                                <TH colSpan={1} align="right">
                                요청 일시
                                </TH>
                                <TD colSpan={5.01}>
                                    <TextField className="width-100" readOnly value={submission.requestDate} />
                                </TD>
                            </TR>
                            <TR>
                                <TH colSpan={1} align="right">
                                승인 제목
                                </TH>
                                <TD colSpan={5.01}>
                                    <TextField 
                                        className="width-100"  
                                        id="title" 
                                        value={submission.title}
                                        onChange={onchangeInputHandler}
                                    />
                                </TD>
                            </TR>
                            <TR>
                                <TH colSpan={1} align="right">
                                승인 내용
                                </TH>
                                <TD colSpan={5.01}>
                                    <TextField 
                                        className="width-100" 
                                        multiline  
                                        id="content" 
                                        value={submission.content}
                                        onChange={onchangeInputHandler}
                                    />
                                </TD>
                            </TR>
                        </HorizontalTable>

                        <Stack justifyContent="Between" className="width-100">
                            <Typography variant="h4">결재선</Typography>
                            {(
                                submissionInfo.submission.status === ""
                                || submissionInfo.submission.status === subFeatStatus.SAVE
                            ) && 
                            <Stack gap="SM">
                                <Button onClick={handleApproveAppend}>추가</Button>
                                <Button onClick={handleApproveDelete}>삭제</Button>
                            </Stack>
                            }
                        </Stack>
                        {(
                            submissionInfo.submission.status === ""
                            || submissionInfo.submission.status === subFeatStatus.SAVE
                        ) && 
                        <VerticalTable
                            columns={sfSubmissionApprovalListColumns}
                            rows={approvals}
                            enableSort={false}
                            clickable={true}
                            rowSelection={(checkedList: Array<number>) => getCheckList(checkedList)}
                        />
                        }
                        {(
                            submissionInfo.submission.status !== ""
                            && submissionInfo.submission.status !== subFeatStatus.SAVE
                        ) && 
                        <VerticalTable
                            columns={sfSubmissionApprovalListColumns}
                            rows={approvals}
                            enableSort={false}
                        />
                        }
                    </Stack>
                </Modal.Body>
                <Modal.Footer>
                    <BtnComponent />
                </Modal.Footer>
                </div>

                {/* 승인 정보 */}
                {isOpenSubmissionApprovePop === "rightPopup openTrue" &&
                    <SubmissionApprovePop
                        isOpenSubmissionApprovePop={isOpenSubmissionApprovePop}
                        setIsOpenSubmissionApprovePop={setIsOpenSubmissionApprovePop}
                        approvals={approvals}
                        setApprovals={setApprovals}
                    />
                }
            </Stack>
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

export default SubmissionRequestPop