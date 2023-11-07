import { YN, commonInfo } from '@models/common/CommonInfo';

export interface QnaInfo extends CreatedQnaInfo, commonInfo {
  qnaId: string;
}

export interface CreatedQnaInfo {
  clCode: string;
  sj: string;
  cn: string;
  qnaStat: string;
  useYn: YN;
}

export interface UpdatedQnaInfo extends CreatedQnaInfo {
  qnaId: string;
}
