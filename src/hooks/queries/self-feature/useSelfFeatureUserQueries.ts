import { useQuery } from "@tanstack/react-query"
import { 
    getTableandColumnMetaInfoByMstrSgmtRuleId, 
    retrieveApproverCandidate, 
    retrieveBatchExecuteLogs, 
    retrieveCustFeatParentChildList, 
    retrieveCustFeatRuleInfos, 
    retrieveCustFeatRules, 
    retrieveCustFeatSQLInfos, 
    retrieveDirectSQLYn, 
    retrieveReadSql, 
    retrieveRunStateValid, 
    retrieveSampleData,
    retrieveSubmissionInfo,
    retrieveSubmissionList,
    retrieveSubmissionRequests, 
} from "@/api/self-feature/SelfFeatureUserAPI"
import { FeatListSrchProps } from "@/models/selfFeature/FeatureModel"
import { QueryParams } from "@/utils/ApiUtil"

// Self-feature 목록 조회
export const useCustFeatRules = (qParams: FeatListSrchProps) => {
    return useQuery(['/cust-feat-rules'], () => retrieveCustFeatRules(qParams), { enabled: false })
}
// Self-feature 속성,행동,FEAT 데이터 조회
export const useGetTableandColumnMetaInfoByMstrSgmtRuleId = (mstrSgmtRuleId: string) => {
    return useQuery(['/table-and-column-meta-info', mstrSgmtRuleId], () => getTableandColumnMetaInfoByMstrSgmtRuleId(mstrSgmtRuleId), { enabled: false, suspense: false })
}
// Self-feature 상세정보 조회(Rule-Design)
export const useCustFeatRuleInfos = (custFeatRuleId: string) => {
    return useQuery(['/cust-feat-rule-infos', custFeatRuleId], () => retrieveCustFeatRuleInfos(custFeatRuleId), { enabled: false })
}
// Self-feature 상세정보 조회(SQL)
export const useCustFeatSQLInfos = (custFeatRuleId: string) => {
    return useQuery(['/cust-feat-sql-infos', custFeatRuleId], () => retrieveCustFeatSQLInfos(custFeatRuleId), { enabled: false })
}
// Self-feature 승인정보 리스트 조회(승인정보 ID 조회를 위해)
export const useSubmissionList = (qParams: QueryParams) => {
    return useQuery(['/submission-list'], () => retrieveSubmissionList(qParams), { enabled: false })
}
// Self-feature 승인정보 상세 조회
export const useSubmissionInfo = (submissionNo: number) => {
    return useQuery(['/submission-info', submissionNo], () => retrieveSubmissionInfo(submissionNo), { enabled: false })
}
// Self-feature 결재목록 조회
export const useSubmissionRequests = (email: string, qParams: QueryParams) => {
    return useQuery(['/submission-requests', email], () => retrieveSubmissionRequests(email, qParams), { enabled: false })
}
// Self-feature 쿼리확인 조회(팝업)
export const useReadSql = (custFeatRuleId: string) => {
    return useQuery(['/read-sql', custFeatRuleId], () => retrieveReadSql(custFeatRuleId), { enabled: false, suspense: false })
}
// Self-feature 배치 실행 내역 조회(팝업)
export const useBatchExecuteLogs = (custFeatRuleId: string) => {
    return useQuery(['/batch-execute-logs', custFeatRuleId], () => retrieveBatchExecuteLogs(custFeatRuleId), { enabled: false, suspense: false })
}
// Self-feature 실행 결과 샘플 조회(팝업)
export const useSampleData = (rslnId: string, custFeatRuleId: string) => {
    return useQuery(['/sample-data', custFeatRuleId], () => retrieveSampleData(rslnId, custFeatRuleId), { enabled: false, suspense: false })
}
// Self-feature 선후행 관계 리스트 조회(팝업)
export const useCustFeatParentChildList = (mstrSgmtRuleId: string, custFeatRuleName: string) => {
    return useQuery(['/cust-feat-parent-child-list'], () => retrieveCustFeatParentChildList(mstrSgmtRuleId, custFeatRuleName), { enabled: false, suspense: false })
}
// Self-feature 결재선 조회
export const useApproverCandidate = () => {
    return useQuery(['/approver-candidate'], () => retrieveApproverCandidate())
}
// Self-feature SQL 직접입력 여부 조회
export const useDirectSQLYn = (custFeatRuleId: string) => {
    return useQuery(['/direct-sql-yn', custFeatRuleId], () => retrieveDirectSQLYn(custFeatRuleId))
}
// Self-feature 수동실행 validation 조회
export const useRunStateValid = (custFeatRuleId: string) => {
    return useQuery(['/run-state-valid', custFeatRuleId], () => retrieveRunStateValid(custFeatRuleId), { enabled: false })
}