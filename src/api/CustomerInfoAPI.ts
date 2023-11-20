import { PortalApiURL } from '@/models/common/ApiURL';
import { Service } from '@/models/common/Service';
import { PageModel } from '@/models/model/PageModel';
import { callApi, Method } from '@utils/ApiUtil';

// CDP-360
export const getCustomerInfo = (searchInfo: any) => {
  console.log(searchInfo);
  return callApi({
    service: Service.KAL_BE,
    url: `${PortalApiURL.ONEID}`,
    method: Method.GET,
    params: {
      queryParams: {
        ...searchInfo,
      },
    },
  });
};
