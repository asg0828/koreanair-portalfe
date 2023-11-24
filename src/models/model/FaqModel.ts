import { CommonModel } from '@/models/model/CommonModel';
import { FileInfo } from '@/models/model/FileModel';

export interface FaqParams {
  searchConditions: string;
  searchTable: string;
}

export interface FaqModel extends CreatedFaqModel, CommonModel {
  faqId: string;
}

export interface CreatedFaqModel extends FileInfo {
  clCode: string;
  qstn: string;
  answ: string;
  useYn: string;
}

export interface UpdatedFaqModel extends CreatedFaqModel {
  faqId: string;
}
