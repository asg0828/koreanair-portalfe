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
// Self-feature 상세정보 조회
export const retrieveCustFeatRuleInfos = (id: string) => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureUserApiURL.FEAT_BASE}/${id}`,
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
// Self-feature 등록
export const createCustFeatRule = (bodyParams: Object) => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureUserApiURL.FEAT_INST_UPDT_BASE}`,
        method: Method.POST,
        params: {
            bodyParams: bodyParams
        }
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

export const retrieveApproverCandidate = () => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureUserApiURL.APRV_USER_PRE}/${FeatureType.CUST}${SelfFeatureUserApiURL.APRV_USER_POST}`,
        method: Method.GET,
    })
}