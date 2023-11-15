import { commonModel } from '@/models/model/CommonModel';

export interface CodeModel extends commonModel {
  groupId: string;
  codeId: string;
  codeNm: string;
  codeDsc: string;
}
