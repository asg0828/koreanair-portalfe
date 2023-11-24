import { SelfFeatureAdmApiURL } from '@/models/common/ApiURL';
import { Service } from '@/models/common/Service';
import { CustMetaListSrchInfo } from '@/models/selfFeature/FeatureAdmModel';
import { Method, callApi } from '@/utils/ApiUtil';

export const retrieveColumnsAndComments = () => {
  return callApi({
    service: Service.KAL_SF_BE,
    url: `${SelfFeatureAdmApiURL.COL_AND_CMMT}`,
    method: Method.GET,
  });
};

export const retrieveMetaTableLists = (params: CustMetaListSrchInfo) => {
    return callApi({
        service: Service.KAL_SF_BE,
        url: `${SelfFeatureAdmApiURL.META_TABLE}`,
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

export const retrieveMetaTableDetail = (params: any) => {
  console.log(params);
  return callApi({
    service: Service.KAL_SF_BE,
    url: `${SelfFeatureAdmApiURL.META_TABLE}/${params}`,
    method: Method.GET,
  });
};
