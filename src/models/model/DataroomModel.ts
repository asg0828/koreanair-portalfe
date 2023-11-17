import { commonModel } from '@/models/model/CommonModel';

export interface DataroomParams {
  searchConditions: string;
  searchTable: string;
}

export interface DataroomModel extends CreatedDataroomModel, commonModel {
  dataId: string;
}

export interface CreatedDataroomModel {
  clCode: string;
  sj: string;
  cn: string;
  useYn: string;
}

export interface UpdatedDataroomModel extends CreatedDataroomModel {
  dataId: string;
}
