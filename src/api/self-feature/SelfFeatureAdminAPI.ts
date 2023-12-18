import { SelfFeatureAdmApiURL } from '@/models/common/ApiURL';
import { Service } from '@/models/common/Service';
import { RowsInfo } from '@/models/components/Table';
import { CustMetaListSrchInfo } from '@/models/selfFeature/FeatureAdmModel';
import { Method, QueryParams, callApi } from '@/utils/ApiUtil';

export const retrieveColumnsAndComments = (tableName: string) => {
  return callApi({
    service: Service.KAL_SF_BE,
    url: `${SelfFeatureAdmApiURL.COL_AND_CMMT}/${tableName}`,
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

export const retrieveSchemaList = () => {
  return callApi({
    service: Service.KAL_SF_BE,
    url: `${SelfFeatureAdmApiURL.SCHEMA}`,
    method: Method.GET,
  });
};

export const retrieveMetaTableDetail = (params: any) => {
  return callApi({
    service: Service.KAL_SF_BE,
    url: `${SelfFeatureAdmApiURL.META_TABLE}/${params}`,
    method: Method.GET,
  });
};
// Resolution Id 조회
export const retrieveResolutionRuleId = () => {
  return callApi({
    service: Service.KAL_SF_BE,
    url: `${SelfFeatureAdmApiURL.RESOLUTION}`,
    method: Method.GET,
  })
}

export const updateMetaTable = (
  metaTblId: string,
  // metaTblLogiNm: string,
  tbCoMetaTbInfo: RowsInfo,
  tbCoMetaTblClmnInfoList: RowsInfo
) => {
  return callApi({
    service: Service.KAL_SF_BE,
    url: `${SelfFeatureAdmApiURL.META_TABLE}/${metaTblId}`,
    method: Method.PUT,
    params: {
      bodyParams: {
        // metaTblId,
        // metaTblLogiNm,
        tbCoMetaTbInfo,
        tbCoMetaTblClmnInfoList,
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

export const createMetaTableInfo = (tbCoMetaTbInfo: any, tbCoMetaTblClmnInfoList: any) => {
  return callApi({
    service: Service.KAL_SF_BE,
    url: `${SelfFeatureAdmApiURL.META_TABLE}`,
    method: Method.POST,
    params: {
      bodyParams: {
        tbCoMetaTbInfo,
        tbCoMetaTblClmnInfoList,
      },
    },
  });
};

export const retrieveTableInfo = (schemaName: string, ifUpdate: string) => {
  return callApi({
    service: Service.KAL_SF_BE,
    url: `${SelfFeatureAdmApiURL.TABLE_INFO}/${schemaName}`,
    method: Method.GET,
    params: {
      queryParams: { ifUpdate },
    },
  });
};

export const retrieveTableColumns = (schemaName: string, tableName: string) => {
  return callApi({
    service: Service.KAL_SF_BE,
    url: `${SelfFeatureAdmApiURL.TABLE_INFO}/${schemaName}/${tableName}`,
    method: Method.GET,
  });
};

// CustomerMeta time 컬럼 데이터 타입, 포맷 조회
export const retrieveTimeColumn = () => {
  return callApi({
    service: Service.KAL_SF_BE,
    url: `${SelfFeatureAdmApiURL.TIME_COLUMN}`,
    method: Method.GET,
  });
};

// Master Profile 메타테이블 전체조회 테이블 선택 콤보박스 조회
export const retrieveMetaInfo = (searchInfo: QueryParams) => {
  return callApi({
    service: Service.KAL_SF_BE,
    url: `${SelfFeatureAdmApiURL.META_TABLE_RULE_TABLE_BASE}/info`,
    method: Method.GET,
    params: {
      queryParams: searchInfo,
    },
  });
};
// Master Profile 선택한 Resolution 룰에 따른 마스터 join key 후보 조회
export const retrieveResolutionKeyList = (rslnRuleId: string) => {
  return callApi({
    service: Service.KAL_SF_BE,
    url: `${SelfFeatureAdmApiURL.MSTR_SGMT_BASE}/getRslnKey/${rslnRuleId}`,
    method: Method.GET,
  });
};
// Master Profile 선택된 메타테이블 id 값으로 메타컬럼테이블조회 meta_tbl_id 에 따라 조회
export const retreiveMetaColumnIsResolutionInfo = (metaTblId: string, searchInfo: QueryParams) => {
  return callApi({
    service: Service.KAL_SF_BE,
    url: `${SelfFeatureAdmApiURL.META_TABLE_RULE_TABLE_BASE}/column/${metaTblId}`,
    method: Method.GET,
    params: {
      queryParams: searchInfo,
    },
  });
};
// Master Profile 목록 조회
export const retrieveMstrProfList = (searchInfo: QueryParams) => {
  return callApi({
    service: Service.KAL_SF_BE,
    url: `${SelfFeatureAdmApiURL.MSTR_SGMT_BASE}`,
    method: Method.GET,
    params: {
      queryParams: searchInfo,
    },
  });
};
// Master Profile 상세 조회
export const retrieveMstrProfInfo = (mstrSgmtRuleId: string) => {
  return callApi({
    service: Service.KAL_SF_BE,
    url: `${SelfFeatureAdmApiURL.MSTR_SGMT_BASE}/${mstrSgmtRuleId}`,
    method: Method.GET,
  });
};
// Master Profile 등록
export const createMstrProfInfo = (bodyParams: Object) => {
  return callApi({
    service: Service.KAL_SF_BE,
    url: `${SelfFeatureAdmApiURL.MSTR_SGMT_BASE}`,
    method: Method.POST,
    params: {
      bodyParams: bodyParams,
    },
  });
};
// Master Profile 수정
export const updateMstrProfInfo = (mstrSgmtRuleId: string, bodyParams: Object) => {
  return callApi({
    service: Service.KAL_SF_BE,
    url: `${SelfFeatureAdmApiURL.MSTR_SGMT_BASE}/${mstrSgmtRuleId}`,
    method: Method.PUT,
    params: {
      bodyParams: bodyParams,
    },
  });
};
// Master Profile 삭제
export const deleteMstrProfInfo = (bodyParams: Object) => {
  return callApi({
    service: Service.KAL_SF_BE,
    url: `${SelfFeatureAdmApiURL.MSTR_SGMT_BASE}`,
    method: Method.DELETE,
    params: {
      bodyParams: bodyParams,
    },
  });
};