import { commonInfo } from '@models/common/CommonInfo';

export interface QnaInfo extends CreatedQnaInfo, commonInfo {
  qnaId: string;
  comments: Array<QnaInfo>;
}

export interface CreatedQnaInfo {
  clCode: string;
  sj: string;
  cn: string;
  bfQnaId: string;
  answ: string;
  answRgstId: string;
  answRgstDt: string;
  qnaStat: string;
  openYn: string;
  useYn: string;
}

export interface UpdatedQnaInfo extends CreatedQnaInfo {
  qnaId: string;
}
