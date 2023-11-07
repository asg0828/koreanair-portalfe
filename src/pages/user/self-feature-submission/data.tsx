import { SfSubmission, SfSubmissionAppendApproval, SfSubmissionApproval, SfSubmissionRequestInfo } from "@/models/selfFeature/FeatureSubmissionInfo"

// Feature 승인 요청 리스트 table header
export const sfSubmissionListColumns = [
    { headerName: '유형',      field: 'type', colSpan: 4 },
    { headerName: '제목',      field: 'title', colSpan: 8 },
    { headerName: '상태',      field: 'status', colSpan: 4 },
    { headerName: '요청자',    field: 'requesterName', colSpan: 3 },
    { headerName: '요청 일시', field: 'requestDate', colSpan: 3 },
]
// Feature 결재선 리스트 table header
export const sfSubmissionApprovalListColumns = [
    { headerName: '단계',   field: 'approvalSequenceNm', colSpan: 2 },
    { headerName: '결재자', field: 'approver', colSpan: 6 },
    { headerName: '상태',   field: 'status', colSpan: 2 },
    { headerName: '일시',   field: 'approvedDate', colSpan: 3 },
    { headerName: '의견',   field: 'comment', colSpan: 6 },
]

// Feature 결재자 선택 리스트 talbe header
export const sfSubmissionAppendApprovalListColumns = [
    { headerName: '이름',   field: 'userNm', colSpan: 2 },
    { headerName: '이메일', field: 'lginId', colSpan: 2 },
]

export const sfSubmissionTypeOption = [
    { value: '', text: '선택' },
    { value: 'TagManagerContainer',     text: 'TagManagerContainer' },
    { value: 'TagManagerDeployment',    text: 'TagManagerDeployment' },
    { value: 'CustomerFeature',         text: 'CustomerFeature' },
]

export const sfSubmissionStatusOption = [
    { value: '', text: '선택' },
    { value: 'saved',      text: '등록' },
    { value: 'requested',  text: '승인요청' },
    { value: 'inApproval', text: '결재진행중' },
    { value: 'approved',   text: '승인완료' },
    { value: 'rejected',   text: '반려' },
    { value: 'deleted',    text: '삭제' },
]

export const aprvSeqNm = {
    FIRST: "1차",
    SECOND: "2차",
    LAST: "최종",
}

export const initSfSubmissionRequestInfo: SfSubmissionRequestInfo = {
    id: '',
    type: 'CustomerFeature',
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
    approver: '',
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
    approvals: [{...initSfSubmissionApproval}]
}

export const initSfSubmissionAppendApproval: SfSubmissionAppendApproval = {
    lginId: '',
    userNm: '',
    mbltlno: '',
    cmpyNm: '',
    teamNm: '',
    defaultApproverUserId: '',
}