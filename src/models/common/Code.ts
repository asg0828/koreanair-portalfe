import { commonInfo } from '@models/common/CommonInfo';

export interface CodeInfo extends commonInfo {
  groupId: string;
  codeId: string;
  codeNm: string;
  codeDsc: string;
}
