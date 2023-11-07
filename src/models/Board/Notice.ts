export interface NoticeInfo {
  noticeId: string;
  cn: string;
  sj: string;
  startDt: string;
  endDt: string;
  modiId: string;
  modiDt: string;
  rgstId: string;
  rgstDt: string;
  ordSeq: number;
  viewCnt: number;
  importantYn: 'Y' | 'N';
  popupYn: 'Y' | 'N';
  useYn: 'Y' | 'N';
  delYn: 'Y' | 'N';
}

export interface CreatedNoticeInfo {
  sj: string;
  cn: string;
  startDt: string;
  endDt: string;
  popupYn: 'Y' | 'N';
  useYn: 'Y' | 'N';
  importantYn: 'Y' | 'N';
}

export interface UpdatedNoticeInfo extends CreatedNoticeInfo {
  noticeId: string;
}
