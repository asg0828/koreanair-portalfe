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
    { headerName: '결재자', field: 'approver', colSpan: 4 },
    { headerName: '상태',   field: 'statusNm', colSpan: 2 },
    { headerName: '일시',   field: 'approvedDate', colSpan: 4 },
    { headerName: '의견',   field: 'comment', colSpan: 8 },
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
    { value: 'inApproval', text: '결재진행중' },
    { value: 'approved',   text: '승인완료' },
    { value: 'rejected',   text: '반려' },
    { value: 'deleted',    text: '삭제' },
]

export const aprvSeqNm = {
    FIRST: "1차",
    SECOND: "2차",
    LAST: "3차",
}

export const initSfSubmissionRequestInfo: SfSubmissionRequestInfo = {
    id: '',
    type: 'Rule-Design',
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

export const protoTypeSfSubmissionRequestInfoSaved: SfSubmissionRequestInfo = {
    id: '',
    type: 'Rule-Design',
    referenceNo: 'CFR_00000002',
    submissionNo: '1108131315145',
    status: 'saved',
    title: '홈페이지 행동 분석용 Self-Feature 생성 요청건',
    content: '홈페이지 방문 분석을 위한 Feautre 생성을 요청드립니다.',
    requester: '',
    requesterName: '이두나',
    requestDate: '2023-11-07 11:22:33',
    approvalCompletionDate: '',
    creator: '',
    creatorName: '',
    createdDate: '',
    lastModifier: '',
    lastModifiedDate: '',
    statusNm: '',
}

export const protoTypeSfSubmissionApprovalListSaved: Array<SfSubmissionApproval> = [
    {
        id: 0,
        submissionId: 1108131315145,
        approvalSequence: 1,
        status: '',//[ requested, canceled, approved, rejected ]
        statusNm: '',
        approver: '운영담당자(김운영)',
        comment: '',
        requestDate: '',
        approvedDate: '',
        creator: '',
        createdDate: '',
        lastModifier: '',
        lastModifiedDate: '',
        approvalSequenceNm: '1차'
    }, {
        id: 0,
        submissionId: 1108131315145,
        approvalSequence: 2,
        status: '',//[ requested, canceled, approved, rejected ]
        statusNm: '',
        approver: '품질담당자(최품질)',
        comment: '',
        requestDate: '',
        approvedDate: '',
        creator: '',
        createdDate: '',
        lastModifier: '',
        lastModifiedDate: '',
        approvalSequenceNm: '2차'
    }, {
        id: 0,
        submissionId: 1108131315145,
        approvalSequence: 3,
        status: '',//[ requested, canceled, approved, rejected ]
        statusNm: '',
        approver: '최종승인자(박최종)',
        comment: '',
        requestDate: '',
        approvedDate: '',
        creator: '',
        createdDate: '',
        lastModifier: '',
        lastModifiedDate: '',
        approvalSequenceNm: '3차'
    }
]

export const protoTypeSfSubmissionRequestInfoInApproval: SfSubmissionRequestInfo = {
    id: '',
    type: 'Rule-Design',
    referenceNo: 'CFR_00000004',
    submissionNo: '1108131315200',
    status: 'inApproval',
    title: '홈페이지 행동 분석용 Self-Feature 생성 요청건',
    content: '홈페이지 방문 분석을 위한 Feautre 생성을 요청드립니다.',
    requester: '',
    requesterName: '이두나',
    requestDate: '2023-11-07 11:22:33',
    approvalCompletionDate: '',
    creator: '',
    creatorName: '',
    createdDate: '',
    lastModifier: '',
    lastModifiedDate: '',
    statusNm: '',
}

export const protoTypeSfSubmissionApprovalListInApproval: Array<SfSubmissionApproval> = [
    {
        id: 0,
        submissionId: 1108131315200,
        approvalSequence: 1,
        status: 'approved',//[ requested, canceled, approved, rejected ]
        statusNm: '승인완료',//[ requested, canceled, approved, rejected ]
        approver: '운영담당자(김운영)',
        comment: '승인합니다.',
        requestDate: '',
        approvedDate: '2023-11-08 10:05:32',
        creator: '',
        createdDate: '',
        lastModifier: '',
        lastModifiedDate: '',
        approvalSequenceNm: '1차'
    }, {
        id: 0,
        submissionId: 1108131315200,
        approvalSequence: 2,
        status: '',//[ requested, canceled, approved, rejected ]
        statusNm: '',//[ requested, canceled, approved, rejected ]
        approver: '품질담당자(최품질)',
        comment: '',
        requestDate: '',
        approvedDate: '',
        creator: '',
        createdDate: '',
        lastModifier: '',
        lastModifiedDate: '',
        approvalSequenceNm: '2차'
    }, {
        id: 0,
        submissionId: 1108131315200,
        approvalSequence: 3,
        status: '',//[ requested, canceled, approved, rejected ]
        statusNm: '',//[ requested, canceled, approved, rejected ]
        approver: '최종승인자(박최종)',
        comment: '',
        requestDate: '',
        approvedDate: '',
        creator: '',
        createdDate: '',
        lastModifier: '',
        lastModifiedDate: '',
        approvalSequenceNm: '3차'
    }
]

export const protoTypeSfSubmissionRequestInfoApproved: SfSubmissionRequestInfo = {
    id: '',
    type: 'Rule-Design',
    referenceNo: 'CFR_00000005',
    submissionNo: '1108131315200',
    status: 'approved',
    title: '홈페이지 행동 분석용 Self-Feature 생성 요청건',
    content: '홈페이지 방문 분석을 위한 Feautre 생성을 요청드립니다.',
    requester: '',
    requesterName: '이두나',
    requestDate: '2023-11-07 11:22:33',
    approvalCompletionDate: '',
    creator: '',
    creatorName: '',
    createdDate: '',
    lastModifier: '',
    lastModifiedDate: '',
    statusNm: '',
}

export const protoTypeSfSubmissionApprovalListApproved: Array<SfSubmissionApproval> = [
    {
        id: 0,
        submissionId: 1108131315200,
        approvalSequence: 1,
        status: 'approved',//[ requested, canceled, approved, rejected ]
        statusNm: '승인완료',//[ requested, canceled, approved, rejected ]
        approver: '운영담당자(김운영)',
        comment: '승인합니다.',
        requestDate: '',
        approvedDate: '2023-11-08 10:05:32',
        creator: '',
        createdDate: '',
        lastModifier: '',
        lastModifiedDate: '',
        approvalSequenceNm: '1차'
    }, {
        id: 0,
        submissionId: 1108131315200,
        approvalSequence: 2,
        status: 'approved',//[ requested, canceled, approved, rejected ]
        statusNm: '승인완료',//[ requested, canceled, approved, rejected ]
        approver: '품질담당자(최품질)',
        comment: '승인합니다.',
        requestDate: '',
        approvedDate: '2023-11-08 13:12:10',
        creator: '',
        createdDate: '',
        lastModifier: '',
        lastModifiedDate: '',
        approvalSequenceNm: '2차'
    }, {
        id: 0,
        submissionId: 1108131315200,
        approvalSequence: 3,
        status: 'approved',//[ requested, canceled, approved, rejected ]
        statusNm: '승인완료',//[ requested, canceled, approved, rejected ]
        approver: '최종승인자(박최종)',
        comment: '승인합니다.',
        requestDate: '',
        approvedDate: '2023-11-09 14:20:05',
        creator: '',
        createdDate: '',
        lastModifier: '',
        lastModifiedDate: '',
        approvalSequenceNm: '3차'
    }
]

export const protoTypeSfSubmissionRequestInfoRejected: SfSubmissionRequestInfo = {
    id: '',
    type: 'Rule-Design',
    referenceNo: 'CFR_00000004',
    submissionNo: '1108131315211',
    status: 'rejected',
    title: '홈페이지 행동 분석용 Self-Feature 생성 요청건',
    content: '홈페이지 방문 분석을 위한 Feautre 생성을 요청드립니다.',
    requester: '',
    requesterName: '이두나',
    requestDate: '2023-11-07 11:22:33',
    approvalCompletionDate: '',
    creator: '',
    creatorName: '',
    createdDate: '',
    lastModifier: '',
    lastModifiedDate: '',
    statusNm: '',
}

export const protoTypeSfSubmissionApprovalListRejected: Array<SfSubmissionApproval> = [
    {
        id: 0,
        submissionId: 1108131315211,
        approvalSequence: 1,
        status: 'approved',//[ requested, canceled, approved, rejected ]
        statusNm: '승인완료',//[ requested, canceled, approved, rejected ]
        approver: '운영담당자(김운영)',
        comment: '승인합니다.',
        requestDate: '',
        approvedDate: '2023-11-08 10:05:32',
        creator: '',
        createdDate: '',
        lastModifier: '',
        lastModifiedDate: '',
        approvalSequenceNm: '1차'
    }, {
        id: 0,
        submissionId: 1108131315211,
        approvalSequence: 2,
        status: 'rejected',//[ requested, canceled, approved, rejected ]
        statusNm: '반려',//[ requested, canceled, approved, rejected ]
        approver: '품질담당자(최품질)',
        comment: 'Feature 영문명 표준 불일치(수정필요)',
        requestDate: '',
        approvedDate: '2023-11-08 13:12:10',
        creator: '',
        createdDate: '',
        lastModifier: '',
        lastModifiedDate: '',
        approvalSequenceNm: '2차'
    }, {
        id: 0,
        submissionId: 1108131315211,
        approvalSequence: 3,
        status: 'approved',//[ requested, canceled, approved, rejected ]
        statusNm: '',//[ requested, canceled, approved, rejected ]
        approver: '최종승인자(박최종)',
        comment: '',
        requestDate: '',
        approvedDate: '',
        creator: '',
        createdDate: '',
        lastModifier: '',
        lastModifiedDate: '',
        approvalSequenceNm: '3차'
    }
]