import { getTableandColumnMetaInfoByMstrSgmtRuleId } from "@/api/SelfFeatureUserAPI"
import { useQuery } from "@tanstack/react-query"

export const useGetTableandColumnMetaInfoByMstrSgmtRuleId = () => {
    return useQuery(['/table-and-column-meta-info'], () => getTableandColumnMetaInfoByMstrSgmtRuleId())
}