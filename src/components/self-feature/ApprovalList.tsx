import { useEffect, useState } from "react"
import { cloneDeep } from 'lodash'

import { 
    Button,
    Stack,
    TBody,
    TD,
    TH,
    THead,
    TR,
    Table,
    TextField,
    Typography, 
} from '@components/ui'

import { 
    ApporvalListComponentProps,
    SfSubmissionApproval,
} from "@/models/selfFeature/FeatureSubmissionInfo"
import {
    aprvSeqNm,
    sfSubmissionApprovalListColumns as columns,
    initSfSubmissionApproval,
} from '@pages/user/self-feature-submission/data'
import { subFeatStatus } from "@/models/selfFeature/FeatureCommon"
import SubAppdAprvPop from "../self-feature-submission/popup/SubAppdAprvPop"

const ApprovalList = ({
    sfSubmissionRequestData,
    sfSubmissionApprovalList,
    setSfSubmissionApprovalList,
}: ApporvalListComponentProps) => {

    const [ defaultSubAprvList, setDefaultSubAprvList ] = useState<Array<SfSubmissionApproval>>([])
    // 결재선 선택 팝업
    const [ isOpenSubAppdAprvPop, setIsOpenSubAppdAprvPop ] = useState<boolean>(false)
    const [ aprvCategory, setAprvCategory ] = useState<string>("")

    // useEffect(() => {
    //     let t: Array<SfSubmissionApproval> = []

    //     for (let i = 0; i < 3; i++) {

    //         let subAprv: SfSubmissionApproval = cloneDeep(initSfSubmissionApproval)

    //         if (sfSubmissionApprovalList && sfSubmissionApprovalList[i]) {
    //             subAprv = cloneDeep(sfSubmissionApprovalList[i])
    //         }

    //         subAprv.approvalSequence = i + 1

    //         if (subAprv.approvalSequence === 1) subAprv.approvalSequenceNm = aprvSeqNm.FIRST
    //         else if (subAprv.approvalSequence === 2) subAprv.approvalSequenceNm = aprvSeqNm.SECOND
    //         else if (subAprv.approvalSequence === 3) subAprv.approvalSequenceNm = aprvSeqNm.LAST

    //         t.push(subAprv)
    //     }

    //     setDefaultSubAprvList(t)
    // }, [sfSubmissionApprovalList])

    useEffect(() => {
        setSfSubmissionApprovalList(defaultSubAprvList)
    }, [defaultSubAprvList])

    const appendAprvHanbler = (index: number) => {
        if (index === 0) setAprvCategory(aprvSeqNm.FIRST)
        else if (index === 1) setAprvCategory(aprvSeqNm.SECOND)
        else if (index === 2) setAprvCategory(aprvSeqNm.LAST)

        setIsOpenSubAppdAprvPop((prevState) => !prevState)
    }

    return (
        <>
        <Stack justifyContent="Between" className="width-100">
            <Typography variant="h4">결재선</Typography>
        </Stack>
        <Table variant="vertical" size="normal" align="center" className="verticalTable">
            <THead>
                <TR>
                {columns.map((column, index) => (
                    <TH
                        colSpan={column.colSpan ? column.colSpan : 1}
                        key={`header-${index}`}
                    >
                    {column.headerName}
                    </TH>
                ))}
                </TR>
            </THead>
            <TBody>
            {sfSubmissionApprovalList.map((row, index) => (
                <TR key={`row-${index}`}>
                {Object.keys(columns).map((column, index2) => (
                    <TD
                        colSpan={columns[index2].colSpan ? columns[index2].colSpan : undefined}
                        key={`row-body-${index2}`}
                    >
                        {columns[index2].field === "approver" && 
                            <Stack gap="XS" className="width-100">
                                <Typography 
                                    style={{
                                        textAlign: "center"
                                    }}
                                    className="width-100" 
                                    variant="body2"
                                >
                                    {row[columns[index2].field]}
                                </Typography>
                                {/* 신규등록 및 품의등록,승인요청전 상태인 경우 */}
                                {(
                                    !sfSubmissionRequestData
                                    || (
                                        sfSubmissionRequestData 
                                        && (sfSubmissionRequestData.status === "" || sfSubmissionRequestData.status === subFeatStatus.SAVE)
                                    )
                                ) &&
                                <Button 
                                    style={{
                                        backgroundColor: "rgb(177 175 185)"
                                    }} 
                                    appearance="Contained" 
                                    priority="Normal" 
                                    shape="Round" 
                                    size="XS"
                                    onClick={() => appendAprvHanbler(index)}
                                >
                                    <span className="searchIcon" ></span>
                                </Button>
                                }
                            </Stack>
                        }
                        {columns[index2].field !== "approver" && 
                            <Typography variant="body2">{row[columns[index2].field]}</Typography>
                        }
                    </TD>
                ))}
                </TR>
            ))}
            </TBody>
        </Table>
        {/* 팝업 */}
        <SubAppdAprvPop 
            isOpen={isOpenSubAppdAprvPop} 
            onClose={(isOpen) => setIsOpenSubAppdAprvPop(isOpen)} 
            aprvCategory={aprvCategory}
            setDefaultSubAprvList={setDefaultSubAprvList}
        />
        {/* 팝업 */}
        </>
    )
}

export default ApprovalList