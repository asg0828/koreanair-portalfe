import { commonInfo } from '@models/common/CommonInfo';

export interface DataroomInfo extends CreatedDataroomInfo, commonInfo {
  dataId: string;
}

export interface CreatedDataroomInfo {
  clCode: string;
  sj: string;
  cn: string;
  useYn: string;
}

export interface UpdatedDataroomInfo extends CreatedDataroomInfo {
  dataId: string;
}
