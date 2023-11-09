import { commonInfo } from '@models/common/CommonInfo';

export interface NoticeInfo extends CreatedNoticeInfo, commonInfo {
  noticeId: string;
}

export interface CreatedNoticeInfo {
  sj: string;
  cn: string;
  startDt: string;
  endDt: string;
  popupYn: string;
  useYn: string;
  importantYn: string;
}

export interface UpdatedNoticeInfo extends CreatedNoticeInfo {
  noticeId: string;
}
