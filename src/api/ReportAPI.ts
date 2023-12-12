import { PortalApiURL } from '@/models/common/ApiURL';
import { Service } from '@/models/common/Service';
import { ReportParams } from '@/models/model/ReportModel';
import { callApi, Method } from '@utils/ApiUtil';
import {PageModel} from "@models/model/PageModel";

export const getReportVipList = (params: ReportParams, page: PageModel) => {
    return callApi({
        service: Service.KAL_BE,
        url: `${PortalApiURL.REPORT_VIP}`,
        method: Method.GET,
        params: {
            queryParams: {
                ...params,
                ...page
            },
        },
    });
};

export const getPurchaseContributionTop100List = (criteria: string) => {
    return callApi({
        service: Service.KAL_BE,
        url: `${PortalApiURL.REPORT_PURCHASE_CONTRIBUTION_TOP100}/${criteria}`,
        method: Method.GET,
    });
};

export const getIntlBoardingTop100List = (criteria: string) => {
    return callApi({
        service: Service.KAL_BE,
        url: `${PortalApiURL.REPORT_INTL_BOARDING_TOP100}/${criteria}`,
        method: Method.GET,
    });
};

export const getDomesticBoardingTop100List = (criteria: string) => {
    return callApi({
        service: Service.KAL_BE,
        url: `${PortalApiURL.REPORT_DOMESTIC_BOARDING_TOP100}/${criteria}`,
        method: Method.GET,
    });
};

export const getTotalMileageTop100List = (criteria: string) => {
    return callApi({
        service: Service.KAL_BE,
        url: `${PortalApiURL.REPORT_TOTAL_MILEAGE_TOP100}/${criteria}`,
        method: Method.GET,
    });
};