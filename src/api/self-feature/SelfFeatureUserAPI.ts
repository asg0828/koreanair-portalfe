import { SelfFeatureUserApiURL } from "@/models/common/ApiURL";
import { Service } from "@/models/common/Service";
import { RuleId } from "@/models/selfFeature/FeatureCommon";
import { Method, callApi } from "@/utils/ApiUtil";

export const getTableandColumnMetaInfoByMstrSgmtRuleId = () => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureUserApiURL.FACT_BASEFACT}/${RuleId.MASTERPROF}`,
        method: Method.GET,
    })
}

export const retrieveReadSql = (custFeatRuleId: string) => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureUserApiURL.READ_SQL}/${custFeatRuleId}`,
        method: Method.GET,
    })
}

export const retrieveBatchExecuteLogs = (custFeatRuleId: string) => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureUserApiURL.BATCH_EXECUTE_LOGS}/${custFeatRuleId}`,
        method: Method.GET,
    })
}

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

// mutations
export const runScheduleByManually = (custFeatRuleId: string) => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureUserApiURL.RUN_SCDL}/${custFeatRuleId}`,
        method: Method.POST,
    })
}