import React, { 
    useState, 
    useEffect, 
    useCallback,
} from 'react'
import { cloneDeep } from 'lodash'

import { 
    Method, 
    callApi 
} from '@/utils/ApiUtil'
import { StatusCode } from '@/models/common/CommonResponse'

import { 
    Button,
    Modal,
    Stack,
    TD,
    TH,
    TR,
    TextField,
} from '@components/ui'
import { 
    ModalTitCont, 
    ModalType, 
    initApiRequest, 
    initCommonResponse, 
    initConfig,
} from '@/models/selfFeature/FeatureCommon'
import ConfirmModal from '@/components/modal/ConfirmModal'
import { SfSubmissionApproval } from '@/models/selfFeature/FeatureSubmissionModel'

export interface SubRejectPopProps {
    isOpen?: boolean
    onClose: (isOpen: boolean) => void
    sfSubmissionApprovalList: Array<SfSubmissionApproval>
    setSfSubmissionApprovalList: React.Dispatch<React.SetStateAction<Array<SfSubmissionApproval>>>
}

const SubRejectPop = ({
    isOpen = false,
    onClose,
    sfSubmissionApprovalList,
    setSfSubmissionApprovalList,
} : SubRejectPopProps) => {

    const [ isOpenSubRejectPop, setIsOpenSubRejectPop ] = useState<boolean>(false)

    const [ isOpenConfirmModal, setIsOpenConfirmModal ] = useState<boolean>(false)
    const [ confirmModalTit, setConfirmModalTit ] = useState<string>('')
    const [ confirmModalCont, setConfirmModalCont ] = useState<string>('')
    const [ modalType, setModalType ] = useState<string>('')

    const [ comment, setComment ] = useState<string>("")

    useEffect(() => {
        setIsOpenSubRejectPop(isOpen)
        // 팝업 오픈시
        if (isOpen) {

        }
    }, [isOpen])

    const handleClose = useCallback(
        (isOpenSubRejectPop: boolean) => {
            if (onClose) {
                // 초기화
                setComment("")
                onClose(isOpenSubRejectPop)
            } else {
                setIsOpenSubRejectPop(isOpenSubRejectPop)
            }
        },
        [onClose]
    )

    // modal 확인/취소 이벤트
    const onConfirm = () => {
        if (modalType === ModalType.CONFIRM) {
            rejectSubmissionApproval()
        }
        onClickCancelSubRejectPop()
        setIsOpenConfirmModal(false)
    }

    const onCancel = () => {
        setIsOpenConfirmModal(false)
    }

    const onClickRejectHandler = () => {
        setModalType(ModalType.CONFIRM)
        setConfirmModalTit(ModalTitCont.SUBMISSION_REJECT.title)
        setConfirmModalCont(ModalTitCont.SUBMISSION_REJECT.context)
        setIsOpenConfirmModal(true)
    }

    const onClickCancelSubRejectPop = () => {
        setComment("")
        setIsOpenSubRejectPop(false)
        onClose(false)
    }

    const rejectSubmissionApproval = async () => {
        /*
            Method      :: GET
            Url         :: /api/v1/mastersegment/table-columns-meta-info
            path param  :: {mstrSgmtRuleId}
            query param :: 
        */
        let email = ""
        let approvalId = ""
        let config = cloneDeep(initConfig)
        config.isLoarding = true
        let request = cloneDeep(initApiRequest)
        request.method = Method.PUT
        request.url = `/api/v1/users/${email}/submission-approvals/${approvalId}/reject`
        request.params!.bodyParams = { comment: comment }
        console.log("[rejectSubmissionApproval] Request  :: ", request)

        let response = cloneDeep(initCommonResponse)
        //response = await callApi(request)
        console.log("[rejectSubmissionApproval] Response header       :: ", response.header)
        console.log("[rejectSubmissionApproval] Response statusCode   :: ", response.statusCode)
        console.log("[rejectSubmissionApproval] Response status       :: ", response.status)
        console.log("[rejectSubmissionApproval] Response successOrNot :: ", response.successOrNot)
        console.log("[rejectSubmissionApproval] Response result       :: ", response.result)

        if (response.statusCode === StatusCode.SUCCESS) {

        }
    }

    return (
        <>
        <Modal 
            open={isOpenSubRejectPop} 
            onClose={handleClose} 
            size="MD" 
            closeOnOutsideClick={false}
        >
            <Modal.Header>반려 처리</Modal.Header>
            <Modal.Body className="width-100" style={{height: "100px"}}>
                <TextField 
                    className='width-100 height-100'
                    multiline
                    value={comment}
                    onChange={(e) => {
                        const { id, value } = e.target
                        setComment(value)
                        //setSfSubmissionApprovalList(value)
                    }}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button 
                    priority="Primary" 
                    appearance="Contained" 
                    size="LG"
                    onClick={onClickRejectHandler} 
                >
                반려
                </Button>
                <Button
                    priority="Normal" 
                    appearance="Outline" 
                    size="LG"
                    onClick={onClickCancelSubRejectPop} 
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

export default SubRejectPop