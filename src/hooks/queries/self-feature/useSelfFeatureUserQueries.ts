import { useQuery } from "@tanstack/react-query"
import { 
    getTableandColumnMetaInfoByMstrSgmtRuleId, 
    retrieveCustFeatParentChildList, 
    retrieveReadSql, 
    retrieveSampleData, 
} from "@/api/self-feature/SelfFeatureUserAPI"

export const useGetTableandColumnMetaInfoByMstrSgmtRuleId = () => {
    return useQuery(['/table-and-column-meta-info'], () => getTableandColumnMetaInfoByMstrSgmtRuleId())
}

export const useReadSql = (custFeatRuleId: string) => {
    return useQuery(['/read-sql', custFeatRuleId], () => retrieveReadSql(custFeatRuleId))
}

export const useSampleData = (custFeatRuleId: string) => {
    return useQuery(['/sample-data', custFeatRuleId], () => retrieveSampleData(custFeatRuleId))
}

export const useCustFeatParentChildList = (custFeatRuleName: string) => {
    return useQuery(['/cust-feat-parent-child-list'], () => retrieveCustFeatParentChildList(custFeatRuleName))
}