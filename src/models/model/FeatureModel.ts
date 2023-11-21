import { commonModel } from '@/models/model/CommonModel';

export interface FeatureParams {
  featureSeGrp: string;
  featureSe: string;
  searchFeature: string;
  searchConditions: Array<string>;
  enrUserId: string;
  enrDeptCode: string;
}

export interface FeatureModel extends CreatedFeatureModel, commonModel {
  featureId: string;
  featureTypNm: string;
  featureSeGrpNm: string;
  featureSeNm: string;
  enrUserNm: string;
  enrDeptNm: string;
}

export interface FeatureSeparatesModel {
  seId: string;
  seNm: string;
  seDsc: string;
  seGrpId: string;
}

export interface CreatedFeatureModel {
  featureId: string;
  featureTyp: string;
  featureSeGrp: string;
  featureSe: string;
  featureKoNm: string;
  featureEnNm: string;
  calcUnt: string;
  featureDef: string;
  featureFm: string;
  enrUserId: string;
  enrDeptCode: string;
  featureRelTb: string;
  featureDsc: string;
}

export interface UpdatedFeatureModel extends CreatedFeatureModel {
  featureId: string;
}
