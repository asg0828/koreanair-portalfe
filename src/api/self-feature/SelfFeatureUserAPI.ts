import { SelfFeatureUserApiURL } from "@/models/common/ApiURL";
import { Service } from "@/models/common/Service";
import { RuleId } from "@/models/selfFeature/FeatureCommon";
import { Method, callApi } from "@/utils/ApiUtil";

export const getTableandColumnMetaInfoByMstrSgmtRuleId = () => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureUserApiURL.FACT_BASEFACT}/${RuleId.MASTERPROF}`,
        method: Method.GET,
    });
}