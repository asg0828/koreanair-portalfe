import { RowsInfo } from "@/models/components/Table";

export enum AprvSeqNm {
    FIRST = "Self-Feature 1차승인(운영)",
    SECOND = "Self-Feature 2차승인(품질-메타)",
    LAST = "Self-Feature 3차승인(최종생성승인)",
}

export interface SfSubmission {
    [key: string]: SfSubmissionRequestInfo | Array<SfSubmissionApproval>
    submission: SfSubmissionRequestInfo
    approvals: Array<SfSubmissionApproval>
}

export interface SfSubmissionRequestInfo extends RowsInfo {
    [key: string]: string
    id: string
    type: string
    referenceNo: string
    submissionNo: string
    status: string
    title: string
    content: string
    requester: string
    requesterName: string
    requestDate: string
    approvalCompletionDate: string
    creator: string
    creatorName: string
    createdDate: string
    lastModifier: string
    lastModifiedDate: string
    statusNm: string
}

export interface SfSubmissionApproval extends RowsInfo {
    [key: string]: string | number
    id: number
    submissionId: number
    approvalSequence: number
    status: string//[ requested, canceled, approved, rejected ]
    statusNm: string//[ requested, canceled, approved, rejected ]
    approver: string
    approverName: string // DB 저장 불러온 용
    approverNm: string // 화면용
    comment: string
    requestDate: string
    approvedDate: string
    creator: string
    createdDate: string
    lastModifier: string
    lastModifiedDate: string
    approvalSequenceNm: string
}

export interface SfSubmissionAppendApproval extends RowsInfo {
    [key: string]: string | Boolean
    userNm: string
    groupCode: string
    groupNm: string
    userId: string
    userEmail: string
    cmpyCd: string
    teamNm: string
    isPriority: Boolean
}

export interface SubmissionGroupCode {
    [key: string]: string
}

export interface ApporvalListComponentProps {
    sfSubmissionRequestData?: SfSubmissionRequestInfo
    aprvList: Array<SfSubmissionAppendApproval>
    sfSubmissionApprovalList: Array<SfSubmissionApproval>
    setSfSubmissionApprovalList: React.Dispatch<React.SetStateAction<Array<SfSubmissionApproval>>>
}
// 결재 목록 검색 조건 props
export interface FeatureSubmissionSearchProps {
    [key: string]: string
    type: string
    submissionStatus: string
    referenceNo: string
    submissionNo: string
    requester: string
    title: string
    titleLike: string
    requestDateFrom: string
    requestDateTo: string
    approvalCompletionDateFrom: string
    approvalCompletionDateTo: string
}
// 승인 bodyParam Props
export interface AprvSubCommentProps {
    [key: string]: string
    comment: string
}
export interface RjctSubAprvalBodyParamsProps {
    [key: string]: string
    comment: string
}
// 반려 팝업 Props
export interface SubRejectModalProps {
    isOpen?: boolean
    onClose: (isOpen: boolean) => void
    sfSubmissionApprovalList: Array<SfSubmissionApproval>
}