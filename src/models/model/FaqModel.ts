import { commonModel } from '@/models/model/CommonModel';

export interface FaqParams {
  searchConditions: string;
  searchTable: string;
}

export interface FaqModel extends CreatedFaqModel, commonModel {
  faqId: string;
}

export interface CreatedFaqModel {
  clCode: string;
  qstn: string;
  answ: string;
  useYn: string;
}

export interface UpdatedFaqModel extends CreatedFaqModel {
  faqId: string;
}
