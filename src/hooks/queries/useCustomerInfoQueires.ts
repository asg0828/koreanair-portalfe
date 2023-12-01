import {
  getBoardingCnt,
  getCustomerInfo,
  getEmailHis,
  getEtktHis,
  getInternetHis,
  getPetCnt,
  getPnrHis,
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
