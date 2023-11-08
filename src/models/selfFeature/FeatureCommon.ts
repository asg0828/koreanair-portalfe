import CommonResponse, { StatusCode } from "@/models/common/CommonResponse";
import { Service } from "@/models/common/Service";
import { ApiRequest, Config, Method, ParamObject, QueryParams } from "@/utils/ApiUtil";

// API Config inti
export const initConfig: Config = {
    isLoarding: false,
    isFile: false,
    isOAuth: false,
    isAccessTokenRefreshToken: false,
}
export const initQueryParams: QueryParams = {}
export const initParam: ParamObject = {
    queryParams: initQueryParams,
    bodyParams: {},
}
// API request init
export const initApiRequest: ApiRequest = {
    service: Service.KAL_SF_BE,
    url: '',
    method: Method.GET,
    params: initParam
}
// API response init
export const initCommonResponse: CommonResponse = {
    successOrNot: 'N',
    statusCode: StatusCode.FAIL,
    data: {},
}

// 모달 타입
export const ModalType = {
    ALERT: 'alert',
    CONFIRM: 'Confirm',
}
// 모달 title/context
export const ModalTitCont = {
    DETAIL: { title: "", context: ""},
    REG: { title: "Feature 저장", context: "Feature 정보를 저장 하시겠습니까?"},
    EDIT: { title: "Feature 수정", context: "Feature 정보를 수정 하시겠습니까?"},
    DELETE: { title: "Feature 삭제", context: "선택한 Feature 정보를 삭제 하시겠습니까?"},
    BETCH: { title: "Feature 수동 실행", context: "Feature 수동 실행을 진행 하시겠습니까?" },
    DEL_VALID: { title: "Feature 삭제", context: "삭제할 항목이 없습니다." },
    REG_VALID: { title: "Feature 저장", context: "계산식을 확인해주세요."},
    EDIT_VALID: { title: "Feature 수정", context: "계산식을 확인해주세요."},
    APRO_MAX_SLCT: { title: "결재자 선택", context: "최대 3명의 결재자 선택이 가능합니다."},
    APRO_MAX_APND: { title: "결재자 추가", context: "최대 3명의 결재자 선택이 가능합니다."},
    SUBMISSION_CANCEL: { title: "승인 정보 요청 취소", context: "요청한 승인 정보를 취소 하시겠습니까?"},
    SUBMISSION_INSERT: { title: "승인 정보 저장", context: "입력한 승인 정보를 저장 하시겠습니까?"},
    SUBMISSION_INSERT_REQ: { title: "승인 정보 승인 요청", context: "입력한 승인 정보로 승인 요청 하시겠습니까?"},
    SUBMISSION_APPROVAL: { title: "요청 정보 승인", context: "요청된 승인 정보를 승인 하시겠습니까?"},
    SUBMISSION_REJECT: { title: "요청 정보 반려", context: "요청된 승인 정보를 반려 하시겠습니까?"},
}

// 페이지명(path) setting
export const selfFeatPgPpNm = {
    LIST: 'list', // 목록
    DETL: 'detail',  // 상세
    REG:  'reg',  // 등록
    RULE_REG:  'rule_reg',  // Rule 등록
    SQL_REG:  'sql_reg',  // Sql 등록
    EDIT: 'edit',  // 수정
    SUBMCFRM: 'subConfirm', // 승인 요청 팝업
    SUBINFO:  'subInfo',  // 승인 확인 팝업
    SUB_CANCEL: 'subCancel', // 요청 취소
    SUB_APRV: 'subApproval', // 승인 처리
    SUB_REJT: 'subReject', // 반려 처리
    PRNTCHLD: 'parentChildList'
}
// feat 상태
export const subFeatStatus = {
    REG: 'reg', // 등록
    SUBREG: 'sub_reg', // 품의 저장
    SAVE: 'saved', // 등록, 품의 저장
    REQ: 'requested', // 승인요청
    IN_APRV: 'inApproval', // 결재진행중
    APRV: 'approved', // 승인완료
    REJT: 'rejected', // 반려
}