import { commonInfo } from '@models/common/CommonInfo';

export interface FaqInfo extends CreatedFaqInfo, commonInfo {
  faqId: string;
}

export interface CreatedFaqInfo {
  clCode: string;
  qstn: string;
  answ: string;
  useYn: string;
}

export interface UpdatedFaqInfo extends CreatedFaqInfo {
  faqId: string;
}
