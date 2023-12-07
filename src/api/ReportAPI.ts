import { PortalApiURL } from '@/models/common/ApiURL';
import { Service } from '@/models/common/Service';
import { ReportParams } from '@/models/model/ReportModel';
import { callApi, Method } from '@utils/ApiUtil';

export const getReportVipList = (params: ReportParams) => {
    return callApi({
        service: Service.KAL_BE,
        url: `${PortalApiURL.REPORT}`,
        method: Method.GET,
        params: {
            queryParams: {
                ...params,
            },
        },
    });
};