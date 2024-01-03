import { CommonModel } from '@/models/model/CommonModel';
export type FileCl = '' | 'notice' | 'faq' | 'qna' | 'dataroom';

export interface FileInfo {
  fileIds: Array<string>;
  fileList: Array<any>;
  fileLinks: Array<string>;
}

export interface FileModel extends CommonModel {
  fileId: string;
  storageSe: string;
  bucketNm: string;
  savePath: string;
  saveFileNm: string;
  saveFileVer: string;
  fileCl: string;
  fileNm: string;
  fileExtsn: string;
  fileSize: number;
  fileSizeNm: string;
  fileUrl: string;
  refId: string;
  refVer: string;
  atmcDelYn: string;
  atmcDelDt: string;
}
