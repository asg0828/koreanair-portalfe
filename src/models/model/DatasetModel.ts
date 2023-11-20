import { commonModel } from '@/models/model/CommonModel';

export interface DatasetParams {
  searchTable: string;
  dataSetConditions: Array<string>;
  srcDbCd: string;
}

export interface DatasetModel extends CreatedDatasetModel, commonModel {
  mtsId: string;
}

export interface DatasetColumnModel {
  index: string | number;
  mcsKoNm: string;
  mcsEnNm: string;
  mcsDef: string;
  srcClNm: string;
  clFm: string;
}

export interface CreatedDatasetModel {
  mtsKoNm: string;
  mtsEnNm: string;
  mtsDef: string;
  srcSys: string;
  srcTbNm: string;
  srcDbCd: string;
  mtsDsc: string;
  columnSpecs: Array<DatasetColumnModel>;
}

export interface UpdatedDatasetModel extends CreatedDatasetModel {
  mtsId: string;
}
