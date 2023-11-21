import { commonModel } from '@/models/model/CommonModel';

export interface QnaParams {
  searchConditions: string;
  searchTable: string;
}

export interface QnaModel extends CreatedQnaModel, commonModel {
  qnaId: string;
  comments: Array<QnaModel>;
}

export interface CreatedQnaModel {
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

export interface UpdatedQnaModel extends CreatedQnaModel {
  qnaId: string;
}
