import {
    useState,
    useEffect,
    useCallback,
} from 'react'
import { cloneDeep, isEmpty } from 'lodash'
import { useNavigate } from 'react-router-dom'

import {
    Button,
    Modal,
    Stack,
    TextField,
    Typography,
    useToast,
} from '@components/ui'
import {
    ModalTitCont,
    ModalType,
    SubFeatStatus,
} from '@/models/selfFeature/FeatureCommon'
import ConfirmModal from '@/components/modal/ConfirmModal'
import { RjctSubAprvalBodyParamsProps, SfSubmissionApproval, SubRejectModalProps } from '@/models/selfFeature/FeatureSubmissionModel'
import { useRejectSubmissionApproval } from '@/hooks/mutations/self-feature/useSelfFeatureUserMutations'
import { ValidType } from '@/models/common/Constants'
import { useAppSelector } from '@/hooks/useRedux'
import { selectSessionInfo } from '@/reducers/authSlice'
import { initRjctSubAprvalBodyParamsProps } from '@/pages/user/self-feature-submission/data'

const SubRejectModal = ({
    isOpen = false,
    onClose,
    sfSubmissionApprovalList,
}: SubRejectModalProps) => {

    const { toast } = useToast()
    const navigate = useNavigate()
    const sessionInfo = useAppSelector(selectSessionInfo())

    const [isOpenSubRejectModal, setIsOpenSubRejectModal] = useState<boolean>(false)

    const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)
    const [confirmModalTit, setConfirmModalTit] = useState<string>('')
    const [confirmModalCont, setConfirmModalCont] = useState<string>('')
    const [modalType, setModalType] = useState<string>('')
    // 반려 API
    const [comment, setComment] = useState<string>("")
    const [userEmail, setUserEmail] = useState<string>("")
    const [approvalId, setApprovalId] = useState<number>(0)
    const [rjctSubAprvalBodyParams, setRjctSubAprvalBodyParams] = useState<RjctSubAprvalBodyParamsProps>(cloneDeep(initRjctSubAprvalBodyParamsProps))
    const { data: rjctSubAprvalRes, isSuccess: rjctSubAprvalSucc, isError: rjctSubAprvalErr, mutate: rjctSubAprvalMutate } = useRejectSubmissionApproval(userEmail, approvalId, rjctSubAprvalBodyParams)

    useEffect(() => {
        setIsOpenSubRejectModal(isOpen)
        // 팝업 오픈시
        if (isOpen) {
            if (!sessionInfo.userEmail) {
                return
            }
            setUserEmail(sessionInfo.userEmail)
            // 승인 요청 case만 check
            let approval = sfSubmissionApprovalList.filter((item: SfSubmissionApproval) => (item.approver === sessionInfo.userEmail) && (item.status === SubFeatStatus.REQ))
            if (isEmpty(approval)) {
                return
            }
            setApprovalId(approval[0].id)
        }
    }, [isOpen])
    const handleClose = useCallback(
        (isOpenSubRejectModal: boolean) => {
            if (onClose) {
                // 초기화
                //setRjctSubAprvalBodyParams(cloneDeep(initRjctSubAprvalBodyParamsProps))
                setComment("")
                onClose(isOpenSubRejectModal)
            } else {
                setIsOpenSubRejectModal(isOpenSubRejectModal)
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
    // 버튼 클릭
    const onClickRejectHandler = () => {
        setModalType(ModalType.CONFIRM)
        setConfirmModalTit(ModalTitCont.SUBMISSION_REJECT.title)
        setConfirmModalCont(ModalTitCont.SUBMISSION_REJECT.context)
        setIsOpenConfirmModal(true)
    }
    // 반려 작성 팝업 닫을시 comment 초기화
    const onClickCancelSubRejectPop = () => {
        //setRjctSubAprvalBodyParams(cloneDeep(initRjctSubAprvalBodyParamsProps))
        setComment("")
        setIsOpenSubRejectModal(false)
        onClose(false)
    }
    // 반려 API 호출
    const rejectSubmissionApproval = () => {
        if (isEmpty(userEmail)) {
            toast({
                type: ValidType.ERROR,
                content: '반려 중 에러가 발생했습니다',
            })
            return
        }
        if (!approvalId) {
            toast({
                type: ValidType.ERROR,
                content: '반려 중 에러가 발생했습니다',
            })
            return
        }
        if (isEmpty(comment)) {
            toast({
                type: ValidType.ERROR,
                content: '반려 사유를 작성 해주세요.',
            })
            return
        }
        setRjctSubAprvalBodyParams((prevState: RjctSubAprvalBodyParamsProps) => {
            let rtn = cloneDeep(prevState)
            rtn.comment = comment
            return rtn
        })
        rjctSubAprvalMutate()
    }
    // 반려 API Callback
    useEffect(() => {
        if (rjctSubAprvalErr || rjctSubAprvalRes?.successOrNot === 'N') {
            toast({
                type: ValidType.ERROR,
				content: rjctSubAprvalRes?.message ? rjctSubAprvalRes?.message : '반려 처리 중 에러가 발생했습니다.',
            })
        } else if (rjctSubAprvalSucc) {
            toast({
                type: ValidType.CONFIRM,
                content: '반려 처리 되었습니다.',
            })
            // 목록으로
            navigate('..')
        }
    }, [rjctSubAprvalRes, rjctSubAprvalSucc, rjctSubAprvalErr])

    return (
        <>
            <Modal
                open={isOpenSubRejectModal}
                onClose={handleClose}
                size="MD"
                closeOnOutsideClick={false}
            >
                <Modal.Header>반려 처리</Modal.Header>
                <Modal.Body className="width-100" style={{ height: "200px" }}>
                    <Stack
                        className='width-100 height-100'
                        direction="Vertical"
                        gap="LG"
                    >
                        <Typography variant='body1'>사유 작성</Typography>
                        <TextField
                            className='height-100'
                            multiline
                            value={comment}
                            onChange={(e) => {
                                const { id, value } = e.target
                                setComment(value)
                                // setRjctSubAprvalBodyParams((prevState: RjctSubAprvalBodyParamsProps) => {
                                //     let rtn = cloneDeep(prevState)
                                //     rtn.comment = value
                                //     return rtn
                                // })
                            }}
                        />
                    </Stack>
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

export default SubRejectModal