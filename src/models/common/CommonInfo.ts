export type YN = 'Y' | 'N';

export interface commonInfo {
  modiId?: string;
  modiDt?: string;
  rgstId?: string;
  rgstDt?: string;
  ordSeq?: number;
  viewCnt?: number;
  rownum?: number;
  delYn?: YN;
}
