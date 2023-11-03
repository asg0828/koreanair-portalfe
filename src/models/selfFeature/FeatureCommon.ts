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
    PRNTCHLD: 'parentChildList'
}
// feat 상태
export const subFeatStatus = {
    REG: 'reg', // 등록
    SUBREG: 'sub_reg', // 품의 저장
}