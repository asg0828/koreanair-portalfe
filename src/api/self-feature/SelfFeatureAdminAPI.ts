import { SelfFeatureAdmApiURL } from '@/models/common/ApiURL';
import { Service } from '@/models/common/Service';
import { RowsInfo } from '@/models/components/Table';
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
      queryParams: params,
    },
  });
};

export const retrieveSchemaList = (schemaName: string, ifUpdate: string) => {
  return callApi({
    service: Service.KAL_SF_BE,
    url: `${SelfFeatureAdmApiURL.SCHEMA}/${schemaName}`,
    method: Method.GET,
    params: {
      queryParams: { ifUpdate },
    },
  });
};

export const retrieveMetaTableDetail = (params: any) => {
  return callApi({
    service: Service.KAL_SF_BE,
    url: `${SelfFeatureAdmApiURL.META_TABLE}/${params}`,
    method: Method.GET,
  });
};

export const updateMetaTable = (
  metaTblId: string,
  metaTblLogiNm: string,
  tbCoMetaTbInfo: RowsInfo,
  tbCoMetaTblClmnInfoList: RowsInfo,
  rtmTblYn: string
) => {
  return callApi({
    service: Service.KAL_SF_BE,
    url: `${SelfFeatureAdmApiURL.META_TABLE}/${metaTblId}`,
    method: Method.PUT,
    params: {
      bodyParams: {
        metaTblId,
        metaTblLogiNm,
        tbCoMetaTbInfo,
        tbCoMetaTblClmnInfoList,
        rtmTblYn,
      },
    },
  });
};

export const deleteMetaTable = (metaTblIds: Array<string>) => {
  return callApi({
    service: Service.KAL_SF_BE,
    url: `${SelfFeatureAdmApiURL.META_TABLE}`,
    method: Method.DELETE,
    params: {
      bodyParams: {
        metaTblIds,
      },
    },
  });
};

export const createMetaTableInfo = () => {
  return callApi({
    service: Service.KAL_SF_BE,
    url: `${SelfFeatureAdmApiURL.META_TABLE}`,
    method: Method.POST,
    params: {},
  });
};
