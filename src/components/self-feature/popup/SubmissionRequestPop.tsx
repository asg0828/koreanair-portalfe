import { useCallback, useEffect, useState } from 'react';

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

export interface Props {
    isOpen?: boolean
    onClose: (isOpen: boolean) => void
}

const SubmissionRequestPop = ({
    isOpen = false,
    onClose,
}: Props) => {

    const [isOpenSubmissionRequestPop, setIsOpenSubmissionRequestPop] = useState<boolean>(false);
    const [isOpenSubmissionApprovePop, setIsOpenSubmissionApprovePop] = useState('rightPopup openFalse');

    useEffect(() => {
        setIsOpenSubmissionRequestPop(isOpen)
        // 팝업 오픈시
        if (isOpen) {
            
        }
    }, [isOpen])


    const handleClose = useCallback(
        (isOpenSubmissionRequestPop: boolean) => {
            if (onClose) {
                onClose(isOpenSubmissionRequestPop)
            } else {
                setIsOpenSubmissionRequestPop(isOpenSubmissionRequestPop)
            }
        },
        [onClose]
    )

    const closePopup5 = () => {
        setIsOpenSubmissionRequestPop(false);
        setIsOpenSubmissionApprovePop('rightPopup openFalse');
        onClose(false)
    }
    const handleApproveAppend = () => {
        if (isOpenSubmissionApprovePop === "rightPopup openFalse")
            setIsOpenSubmissionApprovePop('rightPopup openTrue');
    }

    return (
        <Modal 
            open={isOpenSubmissionRequestPop} 
            onClose={handleClose} 
            size="MD" 
            closeOnOutsideClick={false}
        >
            <Stack className="width-100" style={{ position: 'relative' }} alignItems="Start">
                {/* 승인 정보 */}
                <div className="width-100">
                <Modal.Header>승인 정보</Modal.Header>
                <Modal.Body className="width-100" style={{maxHeight:"60vh"}}>
                    <Stack direction="Vertical" className="width-100" gap="MD">
                        <HorizontalTable className="width-100">
                            <TR>
                                <TH colSpan={1} align="right">
                                승인 번호
                                </TH>
                                <TD colSpan={2}>
                                    <TextField className="width-100" readOnly value="TD-1234" />
                                </TD>
                                <TH colSpan={1} align="right">
                                요청자
                                </TH>
                                <TD colSpan={2}>
                                    <TextField className="width-100" readOnly value="김아무개" />
                                </TD>
                            </TR>
                            <TR>
                                <TH colSpan={1} align="right">
                                승인 유형
                                </TH>
                                <TD colSpan={2}>
                                    <TextField className="width-100" readOnly value="ruleDesign" />
                                </TD>
                                <TH colSpan={1} align="right">
                                승인 상태
                                </TH>
                                <TD colSpan={2}>
                                    <TextField className="width-100" readOnly value="승인중" />
                                </TD>
                            </TR>
                            <TR>
                                <TH colSpan={1} align="right">
                                요청 일시
                                </TH>
                                <TD colSpan={5.01}>
                                    <TextField className="width-100" readOnly value="2023-05-24 10:11:42" />
                                </TD>
                            </TR>
                            <TR>
                                <TH colSpan={1} align="right">
                                승인 제목
                                </TH>
                                <TD colSpan={5.01}>
                                    <TextField className="width-100" />
                                </TD>
                            </TR>
                            <TR>
                                <TH colSpan={1} align="right">
                                승인 내용
                                </TH>
                                <TD colSpan={5.01}>
                                    <TextField className="width-100" multiline />
                                </TD>
                            </TR>
                        </HorizontalTable>

                        <Stack justifyContent="Between" className="width-100">
                            <Typography variant="h4">결재선</Typography>
                            <Stack gap="SM">
                                <Button onClick={handleApproveAppend}>추가</Button>
                                <Button>삭제</Button>
                            </Stack>
                        </Stack>
                        <VerticalTable
                            columns={[]}
                            rows={[]}
                            enableSort={false}
                            clickable={true}
                            rowSelection={() => {}}
                        />
                    </Stack>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        priority="Normal" 
                        appearance="Outline" 
                        size="LG"
                        onClick={closePopup5} 
                    >
                    요청 취소
                    </Button>
                    <Button 
                        priority="Primary" 
                        appearance="Contained" 
                        size="LG"
                        onClick={closePopup5} 
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
                        onClick={closePopup5} 
                    >
                    승인 요청
                    </Button>
                </Modal.Footer>
                </div>

                {/* 승인 정보 */}
                {isOpenSubmissionApprovePop === "rightPopup openTrue" &&
                    <SubmissionApprovePop
                        isOpenSubmissionApprovePop={isOpenSubmissionApprovePop}
                        setIsOpenSubmissionApprovePop={setIsOpenSubmissionApprovePop}
                    />
                }
            </Stack>
        </Modal>
    )
}

export default SubmissionRequestPop