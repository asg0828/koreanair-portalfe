import { commonModel } from '@/models/model/CommonModel';

export interface FeatureModel extends CreatedFeatureModel, commonModel {
  featureId: string;
}

export interface CreatedFeatureModel {
  featureId: string;
  featureTyp: string;
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
