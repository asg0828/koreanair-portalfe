export interface CommonModel {
  rownum?: number;
  modiId: string;
  modiDt: string;
  modiNm?: string;
  modiDeptNm?: string;
  rgstId: string;
  rgstDt: string;
  rgstNm?: string;
  rgstDeptNm?: string;
  ordSeq?: number;
  viewCnt?: number;
  delYn?: 'Y' | 'N';
}
