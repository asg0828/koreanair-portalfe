import { SelfFeatureCmmApiURL } from "@/models/common/ApiURL";
import { Service } from "@/models/common/Service";
import { Method, callApi } from "@/utils/ApiUtil";

export const retrieveCommCodes = (params: string) => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureCmmApiURL.CODE}/${params}`,
        method: Method.GET,
    });
}

export const retrieveAuthCommCodes = (params: string) => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureCmmApiURL.AUTH_CODE}/${params}/ComCdvs`,
        method: Method.GET,
    });
}