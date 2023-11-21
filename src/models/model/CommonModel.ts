export type YN = 'Y' | 'N';

export interface commonModel {
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
  rownum?: number;
  delYn?: YN;
}
