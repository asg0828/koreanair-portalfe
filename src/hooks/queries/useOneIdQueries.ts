import {
  getConversion,
  getCtiVoc,
  getDaily,
  getErrorLog,
  getHistory,
  getMasterHistory,
  getMobile,
  getMobileMaster,
  getPaxMapping,
  getRelation,
  getSamePnr,
} from '@/api/OneIdAPI';
import { PageInfo } from '@/models/components/Page';
import {
  ConversionSearch,
  ctiVocSearch,
  dailySearch,
  errorSearch,
  mobileMasterSearch,
  mobileSearch,
  oneidHistorySearch,
  paxMappingSearch,
  relationSearch,
} from '@/models/oneId/OneIdInfo';
import { useQuery } from '@tanstack/react-query';

// oneid 마스터
export const useMasterHistoryList = (searchInfo: oneidHistorySearch, page: PageInfo) => {
  return useQuery(['/one-id-main/master-history'], () => getMasterHistory(searchInfo, page), { enabled: false });
};

// oneid 히스토리
export const useHistoryList = (searchInfo: oneidHistorySearch, page: PageInfo) => {
  return useQuery(['/one-id-main/history'], () => getHistory(searchInfo, page), { enabled: false });
};

// oneid 팩스 매핑
export const usePaxMapping = (searchInfo: paxMappingSearch, page: PageInfo) => {
  return useQuery(['/one-id-main/pax-mapping'], () => getPaxMapping(searchInfo, page), { enabled: false });
};

// 대리점 추정번호 마스터
export const useMobileMasterNumber = (searchInfo: mobileMasterSearch, page: PageInfo) => {
  return useQuery(['/one-id-main/mobile-master'], () => getMobileMaster(searchInfo, page), { enabled: false });
};

// 대리점 추정번호
export const useMobileNumber = (searchInfo: mobileSearch, page: PageInfo) => {
  return useQuery(['/one-id-main/mobile'], () => getMobile(searchInfo, page), { enabled: false });
};

// 관계이력
export const useRelation = (searchInfo: relationSearch, page: PageInfo) => {
  return useQuery(['/one-id-main/mobile'], () => getRelation(searchInfo, page), { enabled: false });
};

// 에러이력
export const useErrorLog = (searchInfo: errorSearch, page: PageInfo) => {
  return useQuery(['/one-id-main/mobile'], () => getErrorLog(searchInfo, page), { enabled: false });
};

// 데일리 리포트
export const useDaily = (searchInfo: dailySearch, page: PageInfo) => {
  return useQuery(['/one-id-main/mobile'], () => getDaily(searchInfo, page), { enabled: false });
};

// CTI/VOC 리포트
export const useCtiVoc = (searchInfo: ctiVocSearch, page: PageInfo) => {
  return useQuery(['/one-id-main/mobile'], () => getCtiVoc(searchInfo, page), { enabled: false });
};

// samePnrUciid
export const useSamePnr = (page: PageInfo) => {
  return useQuery(['/one-id-main/mobile'], () => getSamePnr(page));
};

// 데이터 변환
export const useConversion = (searchInfo: ConversionSearch, page: PageInfo) => {
  return useQuery(['/one-id-main/mobile'], () => getConversion(searchInfo, page), { enabled: false });
};
