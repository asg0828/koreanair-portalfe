import { RowsInfo } from "@/models/components/Table";

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
    sfSubmissionApprovalList: Array<SfSubmissionApproval>
    setSfSubmissionApprovalList: React.Dispatch<React.SetStateAction<Array<SfSubmissionApproval>>>
}