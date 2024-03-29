import { CommonModel } from '@/models/model/CommonModel';
import { FileInfo } from '@/models/model/FileModel';

export interface QnaParams {
  searchConditions: string;
  searchTable: string;
}

export interface QnaModel extends CreatedQnaModel, CommonModel {
  qnaId: string;
  nextSj: string;
  nextId: string;
  preSj: string;
  preId: string;
  comments: Array<QnaModel>;
  clCodeNm?: string;
  qnaStatNm?: string;
}

export interface CreatedQnaModel extends FileInfo {
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
