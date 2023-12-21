import {
  getBoardingCnt,
  getCustomerInfo,
  getEmailHis,
  getEngname,
  getEtktHis,
  getInternetHis,
  getKorname,
  getMobile,
  getPetCnt,
  getPnrHis,
  getProfileOneId,
  getProfileSkypassNo,
  getSmsHis,
  getSnsHis,
  getTelephoneHis,
  getVocHis,
} from '@/api/CustomerInfoAPI';
import { useQuery } from '@tanstack/react-query';

// CDP-360
export const useCustomerInfo = (searchInfo: any) => {
  return useQuery(['/customerInfo'], () => getCustomerInfo(searchInfo), { enabled: false });
};

// OneId로 Profile 조회
export const useProfileOneId = (oneId: string) => {
  return useQuery(['/customerInfo/oneId'], () => getProfileOneId(oneId), { enabled: false });
};

// skypassNo로 Profile 조회
export const useProfileSkypassNo = (skypassNo: number) => {
  return useQuery(['/customerInfo/skypassNumber'], () => getProfileSkypassNo(skypassNo), { enabled: false });
};

// 모바일 번호로 맴버 조회(C-Level)
export const useMobile = (mobile: string) => {
  return useQuery(['/customerInfo/mobile'], () => getMobile(mobile), { enabled: false });
};

// 한글명으로 맴버 조회(C-Level)
export const useKorname = (first: string, last: string) => {
  return useQuery(['/customerInfo/korname'], () => getKorname(first, last), { enabled: false });
};

// 영문명으로 맴버 조회(C-Level)
export const useEngname = (first: string, last: string) => {
  return useQuery(['/customerInfo/engname'], () => getEngname(first, last), { enabled: false });
};

export const useTelephoneHis = () => {
  return useQuery(['/customerInfo/telephone'], () => getTelephoneHis(), { enabled: false });
};
export const useInternetHis = () => {
  return useQuery(['/customerInfo/internet'], () => getInternetHis(), { enabled: false });
};
export const useVocHis = () => {
  return useQuery(['/customerInfo/voc'], () => getVocHis(), { enabled: false });
};

export const useSmsHis = () => {
  return useQuery(['/customerInfo/sms'], () => getSmsHis(), { enabled: false });
};

export const useEmailHis = () => {
  return useQuery(['/customerInfo/email'], () => getEmailHis(), { enabled: false });
};

export const useSnsHis = () => {
  return useQuery(['customerInfo/sns'], () => getSnsHis(), { enabled: false });
};

export const usePnrHis = () => {
  return useQuery(['customerInfo/pnr'], () => getPnrHis(), { enabled: false });
};

export const useEtktHis = () => {
  return useQuery(['customerInfo/Etkt'], () => getEtktHis(), { enabled: false });
};

export const useBoardingCnt = () => {
  return useQuery(['customerInfo/boardingCnt'], () => getBoardingCnt(), { enabled: false });
};

export const usePetCnt = () => {
  return useQuery(['customerInfo/petCnt'], () => getPetCnt(), { enabled: false });
};
