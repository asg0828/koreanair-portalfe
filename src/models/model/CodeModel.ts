import { CommonModel } from '@/models/model/CommonModel';

export interface CodeModel extends CommonModel {
  groupId: string;
  codeId: string;
  codeNm: string;
  codeDsc: string;
}
