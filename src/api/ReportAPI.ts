import { PortalApiURL } from '@/models/common/ApiURL';
import { Service } from '@/models/common/Service';
import { PageModel } from '@models/model/PageModel';
import { callApi, Method } from '@utils/ApiUtil';

export const getReportVipList = (page: PageModel, sortedColumn: string, sortedDirection: string) => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.REPORT_VIP}`,
    method: Method.GET,
    params: {
      queryParams: {
        ...page,
        sortedColumn,
        sortedDirection,
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

export const getBonusTicketTop100List = () => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.REPORT_BONUS_TICKET_TOP100}`,
    method: Method.GET,
  });
};


export const getIntlUpgradeTop100List = () => {
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.REPORT_INTL_UPGRADE_TOP100}`,
    method: Method.GET,
  });
};

