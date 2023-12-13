import { SelfFeatureUserApiURL } from "@/models/common/ApiURL";
import { Service } from "@/models/common/Service";
import { 
    FeatureType, 
    RuleId 
} from "@/models/selfFeature/FeatureCommon";
import { FeatListSrchProps } from "@/models/selfFeature/FeatureModel";
import { 
    Method, 
    QueryParams, 
    callApi 
} from "@/utils/ApiUtil";
// useQuery
// Self-feature 목록 조회
export const retrieveCustFeatRules = (qParams: FeatListSrchProps) => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureUserApiURL.FEAT_BASE}`,
        method: Method.GET,
        params: {
            queryParams: qParams
        }
    })
}
// Self-feature 속성,행동,FEAT 데이터 조회
export const getTableandColumnMetaInfoByMstrSgmtRuleId = () => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureUserApiURL.FACT_BASEFACT}/${RuleId.MASTERPROF}`,
        method: Method.GET,
    })
}
// Self-feature 상세정보 조회(Rule-Design)
export const retrieveCustFeatRuleInfos = (id: string) => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureUserApiURL.FEAT_BASE}/${id}`,
        method: Method.GET,
    })
}
// Self-feature 상세정보 조회(SQL)
export const retrieveCustFeatSQLInfos = (id: string) => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureUserApiURL.FEAT_WITH_SUB_SQL_DETL}/${id}`,
        method: Method.GET,
    })
}
// Self-feature 승인정보 리스트 조회(승인정보 ID 조회를 위해)
export const retrieveSubmissionList = (qParams: QueryParams) => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureUserApiURL.FEAT_SUB_BASE}`,
        method: Method.GET,
        params: {
            queryParams: qParams
        }
    })
}
// Self-feature 승인정보 상세 조회
export const retrieveSubmissionInfo = (submissionNo: number) => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureUserApiURL.FEAT_SUB_BASE}/${submissionNo}`,
        method: Method.GET,
    })
}
// Self-feature 결재목록 조회
export const retrieveSubmissionRequests = (email: string, qParams: QueryParams) => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureUserApiURL.SUB_REQ_BASE_PRE}/${email}/submission-requests`,
        method: Method.GET,
        params: {
            queryParams: qParams
        }
    })
}
// Self-feature 쿼리확인 조회
export const retrieveReadSql = (custFeatRuleId: string) => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureUserApiURL.READ_SQL}/${custFeatRuleId}`,
        method: Method.GET,
    })
}
// Self-feature 배치 실행 내역 조회
export const retrieveBatchExecuteLogs = (custFeatRuleId: string) => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureUserApiURL.BATCH_EXECUTE_LOGS}/${custFeatRuleId}`,
        method: Method.GET,
    })
}
// Self-feature 실행 결과 샘플 조회
export const retrieveSampleData = (custFeatRuleId: string) => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureUserApiURL.SAMPLE_DATA}/${custFeatRuleId}`,
        method: Method.GET,
        params: {
            queryParams: { rslnId: RuleId.RESOLUTION }
        }
    })
}
// Self-feature 선후행 관계 리스트 조회
export const retrieveCustFeatParentChildList = (custFeatRuleName: string) => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureUserApiURL.PARENT_CHILD}`,
        method: Method.GET,
        params: {
            queryParams: { mstrSgmtRuleId: RuleId.MASTERPROF , custFeatRuleName: custFeatRuleName }
        }
    })
}
// Self-feature 결재선 조회
export const retrieveApproverCandidate = () => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureUserApiURL.APRV_USER_PRE}/${FeatureType.CUST}${SelfFeatureUserApiURL.APRV_USER_POST}`,
        method: Method.GET,
    })
}
// mutations
// Self-feature 등록(Rule-Design)
export const createCustFeatRule = (bodyParams: Object) => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureUserApiURL.FEAT_WITH_SUB_BASE}`,
        method: Method.POST,
        params: {
            bodyParams: bodyParams
        }
    })
}
// Self-feature 수정(Rule-Design)
export const updateCustFeatRule = (custFeatRuleId: string, bodyParams: Object) => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureUserApiURL.FEAT_WITH_SUB_BASE}/${custFeatRuleId}`,
        method: Method.PUT,
        params: {
            bodyParams: bodyParams
        }
    })
}
// Self-feature 등록(SQL)
export const createCustFeatSQL = (bodyParams: Object) => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureUserApiURL.FEAT_WITH_SUB_SQL_BASE}`,
        method: Method.POST,
        params: {
            bodyParams: bodyParams
        }
    })
}
// Self-feature 수정(SQL)
export const updateCustFeatSQL = (custFeatRuleId: string, bodyParams: Object) => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureUserApiURL.FEAT_WITH_SUB_SQL_BASE}/${custFeatRuleId}`,
        method: Method.PUT,
        params: {
            bodyParams: bodyParams
        }
    })
}
// Self-feature 삭제
export const deleteCustFeatRule = (qParams: QueryParams) => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureUserApiURL.FEAT_WITH_SUB_BASE}`,
        method: Method.DELETE,
        params: {
            queryParams: qParams
        }
    })
}
// Self-feature 승인 요청
export const insertSubmissionRequest = (email: string, submissionId: number) => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureUserApiURL.SUB_REQ_BASE_PRE}/${email}${SelfFeatureUserApiURL.SUB_REQ_BASE_POST}/${submissionId}/request`,
        method: Method.PUT
    })
}
// Self-feature 승인 요청 취소
export const cancelRequestSubmission = (email: string, submissionId: number) => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureUserApiURL.SUB_REQ_BASE_PRE}/${email}${SelfFeatureUserApiURL.SUB_REQ_BASE_POST}/${submissionId}/cancel`,
        method: Method.PUT
    })
}
// Self-feature 수동 실행
export const runScheduleByManually = (custFeatRuleId: string) => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureUserApiURL.RUN_SCDL}/${custFeatRuleId}`,
        method: Method.POST,
    })
}
// Self-feature 승인 처리
export const approveSubmissionApproval = (email: string, approvalId: number, bodyParams: Object) => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureUserApiURL.SUB_REQ_BASE_PRE}/${email}/submission-approvals/${approvalId}/approve`,
        method: Method.PUT,
        params: {
            bodyParams: bodyParams
        }
    })
}
// Self-feature 반려 처리
export const rejectSubmissionApproval = (email: string, approvalId: number, bodyParams: Object) => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureUserApiURL.SUB_REQ_BASE_PRE}/${email}/submission-approvals/${approvalId}/reject`,
        method: Method.PUT,
        params: {
            bodyParams: bodyParams
        }
    })
}