import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash'
import { Method } from '@/utils/ApiUtil';

import VerticalTable from '@components/table/VerticalTable';
import HorizontalTable from '@/components/table/HorizontalTable';
import ConfirmModal from '@/components/modal/ConfirmModal';
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

import { 
    ModalTitCont,
    ModalType,
    initApiRequest, 
    initCommonResponse, 
    initConfig, 
    selfFeatPgPpNm
} from '@/models/selfFeature/FeatureCommon';
import { 
    aprvSeqNm,
    initSfSubmissionAppendApproval, 
    initSfSubmissionApproval, 
    sfSubmissionAppendApprovalListColumns 
} from '@/pages/user/self-feature-submission/data';
import { 
    SfSubmissionAppendApproval, 
    SfSubmissionApproval 
} from '@/models/selfFeature/FeatureSubmissionInfo';

export interface Props {
    isOpenSubmissionApprovePop: string
    setIsOpenSubmissionApprovePop: React.Dispatch<React.SetStateAction<string>>
    approvals: Array<SfSubmissionApproval>
    setApprovals: React.Dispatch<React.SetStateAction<Array<SfSubmissionApproval>>>
}

const SubmissionApprovePop = ({
    isOpenSubmissionApprovePop,
    setIsOpenSubmissionApprovePop,
    approvals,
    setApprovals,
}: Props) => {

    const [ regType, setRegType ] = useState<string>('')

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
        // 팝업 오픈시
        if (isOpenSubmissionApprovePop === "rightPopup openTrue") {
            retrieveSubmissions2()
        }
    }, [isOpenSubmissionApprovePop])
    
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

    const retrieveSubmissions2 = async () => {
        /*
          Method      :: GET
          Url         :: /api/v1/submission-types/{type}/approver-candidate
          path param  :: {type} - TagManagerContainer, TagManagerDeployment, CustomerFeature
          query param :: 
          body param  :: 
        */
        let config = cloneDeep(initConfig)
        config.isLoarding = true
        let request = cloneDeep(initApiRequest)
        request.method = Method.GET
        let type = "CustomerFeature"
        request.url = `/api/v1/submission-types/${type}/approver-candidate`
        console.log("[retrieveSubmissions2] Request  :: ", request)

        let response = cloneDeep(initCommonResponse)
        //response = await callApi(request)
        console.log("[retrieveSubmissions2] Response :: ", response)
        setAppendApprovals((state: Array<SfSubmissionAppendApproval>) => {
            let rtn = cloneDeep(state)
            let t = []
            for (let i = 0; i < 20; i++) {
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
            for (let i = 0; i < 20; i++) {
                let appendApproval = cloneDeep(initSfSubmissionAppendApproval)
                appendApproval.lginId = `test${i+1}@koreanair.com`
                appendApproval.userNm = `test${i+1}`
                t.push(appendApproval)
            }
            rtn = t
            return rtn
        })
    }

    const closePopup6 = () => {
        setIsOpenSubmissionApprovePop('rightPopup openFalse');
    }

    const getCheckList = (checkedList: Array<number>) => {
        checkedList = checkedList.sort((a: number, b: number) => a - b)
        setAppendApprovalList(() => {
          let appendList = checkedList.map((appendItemIdx) => appendApprovals[appendItemIdx])
          return cloneDeep(appendList)
        })
    }

    const onClickAppendApprovals = () => {

        if (appendApprovalList.length === 0) return

        if (appendApprovalList.length > 3) {
            setModalType(ModalType.ALERT)
            setConfirmModalTit(ModalTitCont.APRO_MAX_SLCT.title)
            setConfirmModalCont(ModalTitCont.APRO_MAX_SLCT.context)
            setIsOpenConfirmModal(true)
            return
        }

        if (approvals.length > 2 || ((appendApprovalList.length + approvals.length) > 3)) {
            setModalType(ModalType.ALERT)
            setConfirmModalTit(ModalTitCont.APRO_MAX_APND.title)
            setConfirmModalCont(ModalTitCont.APRO_MAX_APND.context)
            setIsOpenConfirmModal(true)
            return
        }
        
        setApprovals((state: Array<SfSubmissionApproval>) => {
            let rtn = cloneDeep(state)

            appendApprovalList.map((v: SfSubmissionAppendApproval) => {
                let a: SfSubmissionApproval = cloneDeep(initSfSubmissionApproval)
                a.approver = v.userNm
                rtn.push(a)
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

    const onClickTrgtSrchHandler = () => {
        console.log(approvalSrch)

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
        {/* 결재자 추가 */}
        <div className={isOpenSubmissionApprovePop}>
            <div className="popupTop">
                결재자 추가
                <Button
                    onClick={closePopup6}
                    shape="Square"
                    type="button"
                    aria-haspopup="dialog"
                    aria-expanded="true"
                    aria-controls="radix-:r18:"
                    data-state="open"
                    className="sc-hZDyAQ hrrooe"
                >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                        d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" 
                        fill="currentColor"
                    />
                </svg>
                </Button>
            </div>
            <Modal.Body style={{maxHeight:"60vh"}}>
                <Stack direction="Vertical" gap="SM">
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
                    <Stack justifyContent="End">
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
                    <Stack justifyContent="End">
                        <Select 
                            appearance="Outline" 
                            size="MD" 
                            defaultValue={1}
                        >
                        <SelectOption value={1}>전체</SelectOption>
                        </Select>
                    </Stack>

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
                    priority="Normal" 
                    appearance="Outline" 
                    size="LG"
                    onClick={onClickAppendApprovals} 
                >
                추가
                </Button>
            </Modal.Footer>
        </div>
        {/* 결재자 추가 */}

                                    
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

export default SubmissionApprovePop