import { useQuery } from "@tanstack/react-query"
import { 
    getTableandColumnMetaInfoByMstrSgmtRuleId, 
    retrieveApproverCandidate, 
    retrieveBatchExecuteLogs, 
    retrieveCustFeatParentChildList, 
    retrieveCustFeatRuleInfos, 
    retrieveCustFeatRules, 
    retrieveReadSql, 
    retrieveSampleData,
    retrieveSubmissionInfo,
    retrieveSubmissionList, 
} from "@/api/self-feature/SelfFeatureUserAPI"
import { FeatListSrchProps } from "@/models/selfFeature/FeatureModel"
import { QueryParams } from "@/utils/ApiUtil"

export const useCustFeatRules = (qParams: FeatListSrchProps) => {
    return useQuery(['/cust-feat-rules'], () => retrieveCustFeatRules(qParams))
}

export const useGetTableandColumnMetaInfoByMstrSgmtRuleId = () => {
    return useQuery(['/table-and-column-meta-info'], () => getTableandColumnMetaInfoByMstrSgmtRuleId())
}

export const useCustFeatRuleInfos = (custFeatRuleId: string) => {
    return useQuery(['/cust-feat-rule-infos', custFeatRuleId], () => retrieveCustFeatRuleInfos(custFeatRuleId))
}

export const useSubmissionList = (qParams: QueryParams) => {
    return useQuery(['/submission-list'], () => retrieveSubmissionList(qParams), { enabled: false })
}

export const useSubmissionInfo = (submissionNo: number) => {
    return useQuery(['/submission-info', submissionNo], () => retrieveSubmissionInfo(submissionNo), { enabled: false })
}

export const useReadSql = (custFeatRuleId: string) => {
    return useQuery(['/read-sql', custFeatRuleId], () => retrieveReadSql(custFeatRuleId), { enabled: false })
}

export const useBatchExecuteLogs = (custFeatRuleId: string) => {
    return useQuery(['/batch-execute-logs', custFeatRuleId], () => retrieveBatchExecuteLogs(custFeatRuleId), { enabled: false })
}

export const useSampleData = (custFeatRuleId: string) => {
    return useQuery(['/sample-data', custFeatRuleId], () => retrieveSampleData(custFeatRuleId), { enabled: false })
}

export const useCustFeatParentChildList = (custFeatRuleName: string) => {
    return useQuery(['/cust-feat-parent-child-list'], () => retrieveCustFeatParentChildList(custFeatRuleName), { enabled: false })
}

export const useApproverCandidate = () => {
    return useQuery(['/approver-candidate'], () => retrieveApproverCandidate())
}