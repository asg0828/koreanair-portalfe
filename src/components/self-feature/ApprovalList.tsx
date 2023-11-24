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
    Typography,
    useToast, 
} from '@components/ui'

import { 
    ApporvalListComponentProps,
    SfSubmissionAppendApproval,
    SfSubmissionApproval,
} from "@/models/selfFeature/FeatureSubmissionModel"
import {
    aprvSeqNm,
    sfSubmissionApprovalListColumns as columns,
} from '@pages/user/self-feature-submission/data'
import { subFeatStatus } from "@/models/selfFeature/FeatureCommon"
import SubAppdAprvPop from "../self-feature-submission/popup/SubAppdAprvPop"
import { useApproverCandidate } from "@/hooks/queries/self-feature/useSelfFeatureUserQueries"
import { ValidType } from "@/models/common/Constants"

const ApprovalList = ({
    sfSubmissionRequestData,
    sfSubmissionApprovalList,
    setSfSubmissionApprovalList,
}: ApporvalListComponentProps) => {

    const { toast } = useToast()
    const {
        data: response,
        isError: isError,
        refetch: refetch
    } = useApproverCandidate()
    const [ aprvList, setAprvList ] = useState<Array<SfSubmissionAppendApproval>>([])
    const [ aprvType1, setAprvType1 ] = useState<Array<SfSubmissionAppendApproval>>([])
    const [ aprvType2, setAprvType2 ] = useState<Array<SfSubmissionAppendApproval>>([])
    const [ aprvType3, setAprvType3 ] = useState<Array<SfSubmissionAppendApproval>>([])
    const [ aprvType1Priority, setAprvType1Priority ] = useState<string>("")
    const [ aprvType2Priority, setAprvType2Priority ] = useState<string>("")
    const [ aprvType3Priority, setAprvType3Priority ] = useState<string>("")
    // 결재선 선택 팝업
    const [ isOpenSubAppdAprvPop, setIsOpenSubAppdAprvPop ] = useState<boolean>(false)
    const [ aprvCategory, setAprvCategory ] = useState<string>("")
    
    const appendAprvHanbler = (index: number) => {
        if (index === 0) {
            setAprvType1(aprvList.filter((aprroval: SfSubmissionAppendApproval) => aprroval.groupNm === aprvSeqNm.FIRST))
            setAprvCategory(aprvSeqNm.FIRST)
        } else if (index === 1) {
            setAprvType2(aprvList.filter((aprroval: SfSubmissionAppendApproval) => aprroval.groupNm === aprvSeqNm.SECOND))
            setAprvCategory(aprvSeqNm.SECOND)
        } else if (index === 2) {
            setAprvType3(aprvList.filter((aprroval: SfSubmissionAppendApproval) => aprroval.groupNm === aprvSeqNm.LAST))
            setAprvCategory(aprvSeqNm.LAST)
        }

        setIsOpenSubAppdAprvPop((prevState) => !prevState)
    }

    useEffect(() => {
        setAprvType1Priority(aprvList.filter((aprroval: SfSubmissionAppendApproval) => (aprroval.groupNm === aprvSeqNm.FIRST) && aprroval.isPriority)[0]?.userEmail)
        setAprvType2Priority(aprvList.filter((aprroval: SfSubmissionAppendApproval) => (aprroval.groupNm === aprvSeqNm.SECOND) && aprroval.isPriority)[0]?.userEmail)
        setAprvType3Priority(aprvList.filter((aprroval: SfSubmissionAppendApproval) => (aprroval.groupNm === aprvSeqNm.LAST) && aprroval.isPriority)[0]?.userEmail)
    }, [aprvList])

    useEffect(() => {
        if (isError || response?.successOrNot === 'N') {
            toast({
                type: ValidType.ERROR,
                content: '조회 중 에러가 발생했습니다.',
            });
        } else {
            if (response) {
                setAprvList(response.result)
            }
        }
    }, [response, isError, toast])

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
        {aprvCategory === aprvSeqNm.FIRST &&
        <SubAppdAprvPop 
            isOpen={isOpenSubAppdAprvPop} 
            onClose={(isOpen) => setIsOpenSubAppdAprvPop(isOpen)}
            aprvList={aprvType1}
            aprvCategory={aprvCategory}
            setSfSubmissionApprovalList={setSfSubmissionApprovalList}
        />
        }
        {aprvCategory === aprvSeqNm.SECOND &&
        <SubAppdAprvPop 
            isOpen={isOpenSubAppdAprvPop} 
            onClose={(isOpen) => setIsOpenSubAppdAprvPop(isOpen)}
            aprvList={aprvType2}
            aprvCategory={aprvCategory}
            setSfSubmissionApprovalList={setSfSubmissionApprovalList}
        />
        }
        {aprvCategory === aprvSeqNm.LAST &&
        <SubAppdAprvPop 
            isOpen={isOpenSubAppdAprvPop} 
            onClose={(isOpen) => setIsOpenSubAppdAprvPop(isOpen)}
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