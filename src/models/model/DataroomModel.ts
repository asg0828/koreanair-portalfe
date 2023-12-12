import { CommonModel } from '@/models/model/CommonModel';
import { FileInfo } from '@/models/model/FileModel';

export interface DataroomParams {
  searchConditions: string;
  searchTable: string;
}

export interface DataroomModel extends CreatedDataroomModel, CommonModel {
  dataId: string;
  nextSj: string;
  nextId: string;
  preSj: string;
  preId: string;
}

export interface CreatedDataroomModel extends FileInfo {
  clCode: string;
  sj: string;
  cn: string;
  useYn: string;
}

export interface UpdatedDataroomModel extends CreatedDataroomModel {
  dataId: string;
}
