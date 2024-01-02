import { useEffect, useState } from "react"
import { isEmpty } from 'lodash'

import { 
    Button,
    Stack,
    TBody,
    TD,
    TH,
    THead,
    TR,
    Table,
    Typography,
} from '@components/ui'

import { 
    AprvSeqNm,
    ApporvalListComponentProps,
    SfSubmissionAppendApproval,
} from "@/models/selfFeature/FeatureSubmissionModel"
import {
    sfSubmissionApprovalListColumns as columns,
} from '@pages/user/self-feature-submission/data'
import { SubFeatStatus } from "@/models/selfFeature/FeatureCommon"
import SubAppdAprvModal from "../self-feature-submission/modal/SubAppdAprvModal"

const ApprovalList = ({
    sfSubmissionRequestData,
    aprvList,
    sfSubmissionApprovalList,
    setSfSubmissionApprovalList,
}: ApporvalListComponentProps) => {

    const [ aprvType1, setAprvType1 ] = useState<Array<SfSubmissionAppendApproval>>([])
    const [ aprvType2, setAprvType2 ] = useState<Array<SfSubmissionAppendApproval>>([])
    const [ aprvType3, setAprvType3 ] = useState<Array<SfSubmissionAppendApproval>>([])
    const [ aprvType1Priority, setAprvType1Priority ] = useState<string>("")
    const [ aprvType2Priority, setAprvType2Priority ] = useState<string>("")
    const [ aprvType3Priority, setAprvType3Priority ] = useState<string>("")
    // 결재선 선택 팝업
    const [ isOpenSubAppdAprvModal, setIsOpenSubAppdAprvModal ] = useState<boolean>(false)
    const [ aprvCategory, setAprvCategory ] = useState<string>("")
    
    const appendAprvHanbler = (index: number) => {
        if (index === 0) {
            setAprvType1(aprvList.filter((aprroval: SfSubmissionAppendApproval) => aprroval.groupNm === AprvSeqNm.FIRST))
            setAprvCategory(AprvSeqNm.FIRST)
        } else if (index === 1) {
            setAprvType2(aprvList.filter((aprroval: SfSubmissionAppendApproval) => aprroval.groupNm === AprvSeqNm.SECOND))
            setAprvCategory(AprvSeqNm.SECOND)
        } else if (index === 2) {
            setAprvType3(aprvList.filter((aprroval: SfSubmissionAppendApproval) => aprroval.groupNm === AprvSeqNm.LAST))
            setAprvCategory(AprvSeqNm.LAST)
        }

        setIsOpenSubAppdAprvModal((prevState) => !prevState)
    }

    useEffect(() => {
        if (!aprvList || aprvList.length < 1) return
        let type1 = aprvList.find((aprroval: SfSubmissionAppendApproval) => (aprroval.groupNm === AprvSeqNm.FIRST) && aprroval.isPriority)
        let type2 = aprvList.find((aprroval: SfSubmissionAppendApproval) => (aprroval.groupNm === AprvSeqNm.SECOND) && aprroval.isPriority)
        let type3 = aprvList.find((aprroval: SfSubmissionAppendApproval) => (aprroval.groupNm === AprvSeqNm.LAST) && aprroval.isPriority)
        setAprvType1Priority(type1 ? type1.userNm : "")
        setAprvType2Priority(type2 ? type2.userNm : "")
        setAprvType3Priority(type3 ? type3.userNm : "")
    }, [aprvList])

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
                        style={{
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            overflowX: "hidden",
                        }}
                        colSpan={columns[index2].colSpan ? columns[index2].colSpan : undefined}
                        key={`row-body-${index2}`}
                    >
                        {columns[index2].field === "approverNm" && 
                            <Stack gap="XS" className="width-100">
                                <Typography 
                                    style={{
                                        textAlign: "center"
                                    }}
                                    className="width-100" 
                                    variant="body2"
                                >
                                    {(row[columns[index2].field] && row[columns[index2].field] !== "") &&
                                        row[columns[index2].field]
                                    }
                                    {(
                                        (!row[columns[index2].field] || row[columns[index2].field] === "")
                                        && index === 0
                                    ) &&
                                        aprvType1Priority
                                    }
                                    {(
                                        (!row[columns[index2].field] || row[columns[index2].field] === "")
                                        && index === 1
                                    ) &&
                                        aprvType2Priority
                                    }
                                    {(
                                        (!row[columns[index2].field] || row[columns[index2].field] === "")
                                        && index === 2
                                    ) &&
                                        aprvType3Priority
                                    }
                                </Typography>
                                {/* 신규등록 및 품의등록,승인요청전 상태인 경우 */}
                                {(
                                    !sfSubmissionRequestData
                                    || (
                                        sfSubmissionRequestData 
                                        && (sfSubmissionRequestData.status === "" || sfSubmissionRequestData.status === SubFeatStatus.SAVE)
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
                        {columns[index2].field !== "approverNm" && 
                            <Typography variant="body2">{row[columns[index2].field]}</Typography>
                        }
                    </TD>
                ))}
                </TR>
            ))}
            </TBody>
        </Table>
        {/* 팝업 */}
        {aprvCategory === AprvSeqNm.FIRST &&
        <SubAppdAprvModal 
            isOpen={isOpenSubAppdAprvModal} 
            onClose={(isOpen) => setIsOpenSubAppdAprvModal(isOpen)}
            aprvList={aprvType1}
            aprvCategory={aprvCategory}
            setSfSubmissionApprovalList={setSfSubmissionApprovalList}
        />
        }
        {aprvCategory === AprvSeqNm.SECOND &&
        <SubAppdAprvModal 
            isOpen={isOpenSubAppdAprvModal} 
            onClose={(isOpen) => setIsOpenSubAppdAprvModal(isOpen)}
            aprvList={aprvType2}
            aprvCategory={aprvCategory}
            setSfSubmissionApprovalList={setSfSubmissionApprovalList}
        />
        }
        {aprvCategory === AprvSeqNm.LAST &&
        <SubAppdAprvModal 
            isOpen={isOpenSubAppdAprvModal} 
            onClose={(isOpen) => setIsOpenSubAppdAprvModal(isOpen)}
            aprvList={aprvType3}
            aprvCategory={aprvCategory}
            setSfSubmissionApprovalList={setSfSubmissionApprovalList}
        />
        }
        {/* 팝업 */}
        </>
    )
}

export default ApprovalList