import { YN, commonInfo } from '@models/common/CommonInfo';

export interface DataroomInfo extends CreatedDataroomInfo, commonInfo {
  dataId: string;
  rgstNmStr: string;
  useYnStr: string;
}

export interface CreatedDataroomInfo {
  clCode: string;
  sj: string;
  cn: string;
  useYn: YN;
}

export interface UpdatedDataroomInfo extends CreatedDataroomInfo {
  dataId: string;
}
