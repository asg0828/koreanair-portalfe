import { YN, commonInfo } from '@models/common/CommonInfo';

export interface FaqInfo extends CreatedFaqInfo, commonInfo {
  faqId: string;
}

export interface CreatedFaqInfo {
  clCode: string;
  qstn: string;
  answ: string;
  useYn: YN;
}

export interface UpdatedFaqInfo extends CreatedFaqInfo {
  faqId: string;
}
