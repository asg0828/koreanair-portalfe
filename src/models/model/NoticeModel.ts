import { commonModel } from '@/models/model/CommonModel';

export interface NoticeParams {
  searchConditions: string;
  searchTable: string;
}

export interface NoticeModel extends CreatedNoticeModel, commonModel {
  noticeId: string;
}

export interface CreatedNoticeModel {
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
