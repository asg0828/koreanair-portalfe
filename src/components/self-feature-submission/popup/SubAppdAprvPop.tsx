import { 
    useState, 
    useEffect, 
    useCallback, 
} from 'react'

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
import { sfSubmissionAppendApprovalListColumns } from '@/pages/user/self-feature-submission/data'

export interface Props {
    isOpen?: boolean
    onClose: (isOpen: boolean) => void
}

const SubAppdAprvPop = ({
    isOpen = false,
    onClose,
}: Props) => {

    const [isOpenSubAppedAprvPop, setIsOpenSubAppedAprvPop] = useState<boolean>(false);

    useEffect(() => {
        setIsOpenSubAppedAprvPop(isOpen)
        // 팝업 오픈시
        if (isOpen) {
            
        }
    }, [isOpen])

    const handleClose = useCallback(
        (isOpenSubAppedAprvPop: boolean) => {
            if (onClose) {
                // 초기화
                onClose(isOpenSubAppedAprvPop)
            } else {
                setIsOpenSubAppedAprvPop(isOpenSubAppedAprvPop)
            }
        },
        [onClose]
    )

    const onClickCancelSubAppdAprv = () => {
        setIsOpenSubAppedAprvPop(false)
        onClose(false)
    }

    const getCheckList = (checkedList: Array<number>) => {
        checkedList = checkedList.sort((a: number, b: number) => a - b)
        console.log(checkedList)
    }

    return (
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
                                    //value={approvalSrch.userNm} 
                                    // onChange={(e) => setApprovalSrch((state: SfSubmissionAppendApproval) => {
                                    //     let rtn = cloneDeep(state)
                                    //     rtn.userNm = e.target.value
                                    //     return rtn
                                    // })}
                                    //onKeyDown={onKeyPressNameSrchHandler}
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
                                    // value={approvalSrch.lginId} 
                                    // onChange={(e) => setApprovalSrch((state: SfSubmissionAppendApproval) => {
                                    //     let rtn = cloneDeep(state)
                                    //     rtn.lginId = e.target.value
                                    //     return rtn
                                    // })}
                                    // onKeyDown={onKeyPressEmailSrchHandler}
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
                            //onClick={onClickTrgtSrchHandler}
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
                        rows={[]}
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
                    //onClick={onClickAppendApprovals} 
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
    )
}

export default SubAppdAprvPop