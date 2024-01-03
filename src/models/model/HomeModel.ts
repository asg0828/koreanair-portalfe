export interface BizMetaModel {
  featureCount: number;
  tableSpecCount: number;
  avgUserCount: number;
}

export interface FeatureMyDeptModel {
  featureDeptCount: number;
  featureInterestDeptCount: string;
}

export interface LoginUserDeptModel {
  rank: number;
  deptNm: string;
  loginCount: number;
}

export interface LoginInfoModel {
  logDt: string;
  clientIp: string;
}
