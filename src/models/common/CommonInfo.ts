export type YN = 'Y' | 'N';

export interface commonInfo {
  modiId: string;
  modiDt: number | string;
  modiNm?: string;
  modiDeptNm?: string;
  rgstId: string;
  rgstDt: number | string;
  rgstNm?: string;
  rgstDeptNm?: string;
  ordSeq?: number;
  viewCnt?: number;
  rownum?: number;
  delYn?: YN;
}
