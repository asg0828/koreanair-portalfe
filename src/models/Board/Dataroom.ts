import { YN, commonInfo } from '@models/common/CommonInfo';

export interface DataRoomInfo extends CreatedDataRoomInfo, commonInfo {
  dataId: string;
}

export interface CreatedDataRoomInfo {
  clCode: string;
  sj: string;
  cn: string;
  useYn: YN;
}

export interface UpdatedDataRoomInfo extends CreatedDataRoomInfo {
  dataId: string;
}
