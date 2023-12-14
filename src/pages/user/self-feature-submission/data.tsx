import { FeatureType } from "@/models/selfFeature/FeatureCommon"
import { AprvSubCommentProps, FeatureSubmissionSearchProps, RjctSubAprvalBodyParamsProps, SfSubmission, SfSubmissionAppendApproval, SfSubmissionApproval, SfSubmissionRequestInfo, SubmissionGroupCode } from "@/models/selfFeature/FeatureSubmissionModel"

// Feature 승인 요청 리스트 table header
export const sfSubmissionListColumns = [
    { headerName: '유형', field: 'type', colSpan: 4 },
    { headerName: '제목', field: 'title', colSpan: 8 },
    { headerName: '상태', field: 'statusNm', colSpan: 4 },
    { headerName: '요청자', field: 'requesterName', colSpan: 3 },
    { headerName: '요청 일시', field: 'requestDate', colSpan: 3 },
]
// Feature 결재선 리스트 table header
export const sfSubmissionApprovalListColumns = [
    { headerName: '단계(담당)', field: 'approvalSequenceNm', colSpan: 4 },
    { headerName: '결재자', field: 'approverNm', colSpan: 2 },
    { headerName: '상태', field: 'statusNm', colSpan: 2 },
    { headerName: '일시', field: 'approvedDate', colSpan: 4 },
    { headerName: '의견', field: 'comment', colSpan: 8 },
]

// Feature 결재자 선택 리스트 talbe header
export const sfSubmissionAppendApprovalListColumns = [
    { headerName: '이름', field: 'userNm', colSpan: 2 },
    { headerName: '이메일', field: 'userEmail', colSpan: 2 },
]

export const sfSubmissionTypeOption = [
    { value: '', text: '선택' },
    { value: 'TagManagerContainer', text: 'TagManagerContainer' },
    { value: 'TagManagerDeployment', text: 'TagManagerDeployment' },
    { value: 'CustomerFeature', text: 'CustomerFeature' },
]

export const sfSubmissionStatusOption = [
    { value: '', text: '선택' },
    { value: 'saved', text: '등록' },
    { value: 'inApproval', text: '결재진행중' },
    { value: 'approved', text: '승인완료' },
    { value: 'rejected', text: '반려' },
    { value: 'deleted', text: '삭제' },
]

export const submissionGroupCode: SubmissionGroupCode = {
    sf_aprv_egroup1: "Self-Feature 1차승인(운영)",
    sf_aprv_egroup2: "Self-Feature 2차승인(품질-메타)",
    sf_aprv_egroup3: "Self-Feature 3차승인(최종생성승인)",
}

export const categoryOption = [
    { value: '', text: '선택' },
    { value: '고객', text: '고객' },
    { value: '여객', text: '여객' },
    { value: '행동', text: '행동' },
]

export const initFeatureSubmissionSearchProps: FeatureSubmissionSearchProps = {
    type: FeatureType.CUST,
    status: '',
    referenceNo: '',
    submissionNo: '',
    requester: '',
    title: '',
    titleLike: '',
    requestDateFrom: '',
    requestDateTo: '',
    approvalCompletionDateFrom: '',
    approvalCompletionDateTo: '',
}

export const initAprvSubCommentProps: AprvSubCommentProps = {
    comment: '승인합니다.'
}

export const initRjctSubAprvalBodyParamsProps: RjctSubAprvalBodyParamsProps = {
    comment: ''
}

export const initSfSubmissionRequestInfo: SfSubmissionRequestInfo = {
    id: '',
    type: FeatureType.CUST,
    referenceNo: '',
    submissionNo: '',
    status: '',
    title: '',
    content: '',
    requester: '',
    requesterName: '',
    requestDate: '',
    approvalCompletionDate: '',
    creator: '',
    creatorName: '',
    createdDate: '',
    lastModifier: '',
    lastModifiedDate: '',
    statusNm: '',
}

export const initSfSubmissionApproval: SfSubmissionApproval = {
    id: 0,
    submissionId: 0,
    approvalSequence: 0,
    status: '',//[ requested, canceled, approved, rejected ]
    statusNm: '',
    approver: '',
    approverNm: '',
    comment: '',
    requestDate: '',
    approvedDate: '',
    creator: '',
    createdDate: '',
    lastModifier: '',
    lastModifiedDate: '',
    approvalSequenceNm: ''
}

export const initSfSubmission: SfSubmission = {
    submission: initSfSubmissionRequestInfo,
    approvals: [{ ...initSfSubmissionApproval }]
}

export const initSfSubmissionAppendApproval: SfSubmissionAppendApproval = {
    userNm: '',
    groupCode: '',
    groupNm: '',
    userId: '',
    userEmail: '',
    cmpyCd: '',
    teamNm: '',
    isPriority: false,
}