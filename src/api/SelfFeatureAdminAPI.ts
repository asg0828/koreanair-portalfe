import { SelfFeatureAdmApiURL } from "@/models/common/ApiURL";
import { Service } from "@/models/common/Service";
import { CmSrchInfo } from "@/pages/admin/self-feature-meta-management/customer-meta-management";
import { Method, callApi } from "@/utils/ApiUtil";

export const retrieveColumnsAndComments = () => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureAdmApiURL.COL_AND_CMMT}`,
        method: Method.GET,
    });
}

export const retrieveMetaTableLists = (params: CmSrchInfo) => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureAdmApiURL.META_TABLE_LIST}`,
        method: Method.GET,
        params: {
            queryParams: params
        }
    });
}

export const retrieveSchemaList = () => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureAdmApiURL.SCHEMA}`,
        method: Method.GET,
    });
};