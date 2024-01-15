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
// 2024-01-15 공통코드 호출 API 중복으로 인한 제거
// export const retrieveAuthCommCodes = (params: string) => {
//     return callApi({
//         service: Service.KAL_SF_BE,
//         url: `${SelfFeatureCmmApiURL.AUTH_CODE}/${params}/ComCdvs`,
//         method: Method.GET,
//     });
// }