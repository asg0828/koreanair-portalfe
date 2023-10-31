import { 
    useState, 
    useEffect, 
    useCallback 
} from 'react'

import { 
    Modal, 
    Button, 
    Stack, 
} from '@components/ui';

export interface Props {
    isOpen?: boolean
    onClose?: (isOpen: boolean) => void
    headerText?: string
    bodyText?: string
    btnType?: string
    setModalCloseRslt?: React.Dispatch<React.SetStateAction<boolean>>
}

const SelfFeatureConfirmModal = ({ 
    isOpen = false, 
    onClose,
    headerText,
    bodyText,
    btnType,
    setModalCloseRslt,
}: Props) => {
    
    const [ isOpenPopUp, setIsOpenPopUp ] = useState<boolean>(false)

    useEffect(() => {
        setIsOpenPopUp(isOpen)
        // 팝업 오픈시
        if (isOpen) {

        }
    }, [isOpen])

    const handleClose = useCallback(
        (isOpenPopUp: boolean) => {
            if (onClose) {
                onClose(isOpenPopUp)
            } else {
                setIsOpenPopUp(isOpenPopUp)
            }
        },
        [onClose]
    )

    const handleConfirm = () => {
        setModalCloseRslt && setModalCloseRslt(true)
        handleClose(false)
    }

    const handleCancel = () => {
        setModalCloseRslt && setModalCloseRslt(false)
        handleClose(false)
    }

    return (
        <Modal 
            open={isOpenPopUp} 
            onClose={handleClose} 
            size='LG'
            closeOnOutsideClick={false}
        >
            <Modal.Header>{headerText}</Modal.Header>
            <Modal.Body>
                {bodyText}
            </Modal.Body>
            <Modal.Footer>
                {!btnType && 
                <Stack>
                    <Button priority="Normal" appearance="Contained" onClick={handleConfirm}>
                    확인
                    </Button>
                    <Button priority="Normal" appearance="Contained" onClick={handleCancel}>
                    닫기
                    </Button>
                </Stack>}
                {(btnType === "b1") && 
                <Stack>
                    <Button priority="Normal" appearance="Contained" onClick={handleConfirm}>
                    저장
                    </Button>
                    <Button priority="Normal" appearance="Contained" onClick={handleCancel}>
                    취소
                    </Button>
                </Stack>}
                {(btnType === "b2") && 
                <Stack>
                    <Button priority="Normal" appearance="Contained" onClick={handleConfirm}>
                    수정
                    </Button>
                    <Button priority="Normal" appearance="Contained" onClick={handleCancel}>
                    취소
                    </Button>
                </Stack>}
                {(btnType === "b3") && 
                <Stack>
                    <Button priority="Normal" appearance="Contained" onClick={handleConfirm}>
                    삭제
                    </Button>
                    <Button priority="Normal" appearance="Contained" onClick={handleCancel}>
                    취소
                    </Button>
                </Stack>}
            </Modal.Footer>
        </Modal>
    )
}

export default SelfFeatureConfirmModal