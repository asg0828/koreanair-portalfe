import { CommonModel } from '@/models/model/CommonModel';
import { FileInfo } from '@/models/model/FileModel';

export interface NoticeParams {
  searchConditions: string;
  searchTable: string;
}

export interface NoticeModel extends CreatedNoticeModel, CommonModel {
  noticeId: string;
  nextSj: string;
  nextId: string;
  preSj: string;
  preId: string;
}

export interface CreatedNoticeModel extends FileInfo {
  sj: string;
  cn: string;
  startDt: string;
  endDt: string;
  popupYn: string;
  useYn: string;
  importantYn: string;
}

export interface UpdatedNoticeModel extends CreatedNoticeModel {
  noticeId: string;
}
